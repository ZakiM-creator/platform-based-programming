// src/app/(tabs)/index.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Button,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import SearchBox from "../../components/SearchBox";
import WeatherCard from "../../components/WeatherCard";
import AtribusiCuaca from "../../components/AtribusiCuaca";
import StatusData from "../../components/StatusData";
import { useDebounce } from "../../hooks/use-debounce";
import { cariKota } from "../../services/geocodingService";
import {
  ambilCuacaOfflineFirst,
  BATAS_CACHE_MS,
} from "../../services/cuacaRepository";
import {
  bersihkanCacheLama,
  daftarKotaTersimpan,
} from "../../services/cacheRepository";
import { catatRiwayat } from "../../services/riwayatStorage";
import {
  mintaIzinLokasi,
  ambilKoordinatSaatIni,
} from "../../services/locationService";
import { konversiTingkatAQI } from "../../services/weatherAdapter";
import { labelKodeCuaca } from "../../constants/weatherCodes";
import { HasilGeocoding } from "../../types/geocoding";
import { HasilCuacaOffline, RingkasanKotaTersimpan } from "../../types/cache";

type StatusCari = "diam" | "memuat" | "kosong" | "gagal" | "berhasil";

// Hasil satu pencarian, ditandai dengan kata kunci yang dicari
interface HasilCari {
  kueri: string;
  data: HasilGeocoding[];
  galat: boolean;
}

export default function HalamanUtama() {
  const [teksCari, setTeksCari] = useState("");
  const [hasilCari, setHasilCari] = useState<HasilCari | null>(null);
  const [percobaanCari, setPercobaanCari] = useState(0);
  const [kotaTerpilih, setKotaTerpilih] = useState<HasilGeocoding | null>(null);
  const [hasil, setHasil] = useState<HasilCuacaOffline | null>(null);
  const [kotaTersimpan, setKotaTersimpan] = useState<RingkasanKotaTersimpan[]>(
    [],
  );
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanError, setPesanError] = useState<string | null>(null);
  const [pesanLokasi, setPesanLokasi] = useState<string | null>(null);

  // Diisi tab Riwayat saat pengguna mengetuk salah satu kota di riwayat pencarian
  const parameter = useLocalSearchParams<{
    idKota?: string;
    nama?: string;
    lat?: string;
    lon?: string;
    t?: string; // penanda waktu, supaya mengetuk kota yang sama dua kali tetap terbaca
  }>();

  const teksTertunda = useDebounce(teksCari, 500);
  const requestIdRef = useRef(0); // pencegah race condition

  // Status pencarian diturunkan dari data, bukan disimpan terpisah:
  // "memuat" = ada kata kunci aktif tetapi hasilnya belum untuk kata kunci itu
  const kueriAktif = teksTertunda.trim();
  const statusCari: StatusCari =
    kueriAktif === ""
      ? "diam"
      : hasilCari?.kueri !== kueriAktif
        ? "memuat"
        : hasilCari.galat
          ? "gagal"
          : hasilCari.data.length === 0
            ? "kosong"
            : "berhasil";
  const hasilPencarian =
    statusCari === "berhasil" && hasilCari ? hasilCari.data : [];

  async function muatKotaTersimpan() {
    setKotaTersimpan(await daftarKotaTersimpan());
  }

  // Saat aplikasi dibuka: buang cache > 7 hari, lalu tampilkan daftar tersimpan
  useEffect(() => {
    bersihkanCacheLama(BATAS_CACHE_MS)
      .then(muatKotaTersimpan)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (kueriAktif === "") return;

    // `batal` mencegah jawaban pencarian lama menimpa pencarian yang lebih baru
    let batal = false;
    cariKota(kueriAktif)
      .then((data) => {
        if (!batal) setHasilCari({ kueri: kueriAktif, data, galat: false });
      })
      .catch(() => {
        if (!batal) setHasilCari({ kueri: kueriAktif, data: [], galat: true });
      });

    return () => {
      batal = true;
    };
  }, [kueriAktif, percobaanCari]);

  function cobaCariUlang() {
    setHasilCari(null);
    setPercobaanCari((n) => n + 1);
  }

  async function pilihKota(kota: HasilGeocoding, paksaPerbarui = false) {
    setKotaTerpilih(kota);
    // Catat ke riwayat pencarian. Lokasi GPS (id -1) tidak dicatat: koordinat pengguna
    // tidak perlu disimpan sebagai riwayat (prinsip minimalisasi data, Pertemuan 6)
    if (kota.id !== -1) {
      catatRiwayat({
        id: kota.id,
        nama: kota.name,
        latitude: kota.latitude,
        longitude: kota.longitude,
      });
    }
    const idSaatIni = ++requestIdRef.current;
    setSedangMemuat(true);
    setPesanError(null);

    try {
      const data = await ambilCuacaOfflineFirst(
        {
          id: kota.id,
          nama: kota.name,
          latitude: kota.latitude,
          longitude: kota.longitude,
        },
        { paksaPerbarui },
      );
      if (idSaatIni !== requestIdRef.current) return; // hasil basi, abaikan
      setHasil(data);
      muatKotaTersimpan();
    } catch {
      if (idSaatIni !== requestIdRef.current) return;
      setHasil(null);
      setPesanError(
        "Belum ada data tersimpan dan tidak ada koneksi internet. Sambungkan internet lalu coba lagi.",
      );
    } finally {
      if (idSaatIni === requestIdRef.current) setSedangMemuat(false);
    }
  }

  // Kota diketuk dari riwayat pencarian: saat Beranda difokuskan, langsung tampilkan cuacanya.
  // Penanda yang sudah diproses dicatat agar kembali ke tab ini tidak mengulang pencarian.
  const penandaDiprosesRef = useRef<string | undefined>(undefined);
  useFocusEffect(
    useCallback(() => {
      const id = Number(parameter.idKota);
      const latitude = Number(parameter.lat);
      const longitude = Number(parameter.lon);
      if (!parameter.t || !parameter.nama) return;
      if (parameter.t === penandaDiprosesRef.current) return;
      if (![id, latitude, longitude].every(Number.isFinite)) return;

      penandaDiprosesRef.current = parameter.t;
      pilihKota({
        id,
        name: parameter.nama,
        latitude,
        longitude,
        country: "",
      });
      // Hanya bereaksi pada penanda waktu baru, bukan pada setiap render
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parameter.t]),
  );

  async function gunakanLokasiSaatIni() {
    try {
      const status = await mintaIzinLokasi();

      if (status === "denied") {
        setPesanLokasi(
          "Izin lokasi ditolak. Silakan cari kota secara manual di atas.",
        );
        return;
      }
      if (status === "unavailable") {
        setPesanLokasi(
          "Layanan lokasi tidak aktif di perangkat ini. Silakan cari kota secara manual.",
        );
        return;
      }

      setPesanLokasi(null);
      const koordinat = await ambilKoordinatSaatIni();
      pilihKota({
        id: -1,
        name: "Lokasi Saat Ini",
        latitude: koordinat.latitude,
        longitude: koordinat.longitude,
        country: "",
      });
    } catch {
      // GPS gagal mendapat posisi (sinyal lemah, timeout, dll.): jangan crash
      setPesanLokasi(
        "Gagal mengambil lokasi saat ini. Coba lagi atau cari kota secara manual.",
      );
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <SearchBox onCari={setTeksCari} />

        <Button
          title="Gunakan Lokasi Saat Ini"
          onPress={gunakanLokasiSaatIni}
        />
        {pesanLokasi && (
          <Text accessibilityLabel={pesanLokasi}>{pesanLokasi}</Text>
        )}

        {statusCari === "memuat" && (
          <ActivityIndicator accessibilityLabel="Mencari kota" />
        )}

        {statusCari === "kosong" && (
          <Text accessibilityLabel="Kota tidak ditemukan">
            Kota tidak ditemukan
          </Text>
        )}

        {statusCari === "gagal" && (
          <View>
            <Text accessibilityLabel="Gagal mencari kota. Periksa koneksi internet Anda.">
              Gagal mencari kota. Periksa koneksi internet Anda.
            </Text>
            <Button title="Coba Cari Lagi" onPress={cobaCariUlang} />
          </View>
        )}

        {statusCari === "berhasil" && (
          <Text accessibilityLabel={`Ditemukan ${hasilPencarian.length} kota`}>
            Ditemukan {hasilPencarian.length} kota
          </Text>
        )}

        {hasilPencarian.map((kota) => (
          <TouchableOpacity key={kota.id} onPress={() => pilihKota(kota)}>
            <Text>{kota.name}</Text>
          </TouchableOpacity>
        ))}

        {kotaTersimpan.length > 0 && (
          <View style={{ gap: 6 }}>
            <Text style={{ fontWeight: "bold" }}>
              Tersimpan di perangkat (bisa dibuka offline)
            </Text>
            {kotaTersimpan.map((k) => (
              <TouchableOpacity
                key={k.kunci}
                onPress={() =>
                  pilihKota({
                    id: k.id,
                    name: k.nama,
                    latitude: k.latitude,
                    longitude: k.longitude,
                    country: "",
                  })
                }
              >
                <Text>{k.nama}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {sedangMemuat && <ActivityIndicator />}

        {pesanError && (
          <View>
            <Text accessibilityLabel={pesanError}>{pesanError}</Text>
            <Button
              title="Coba Lagi"
              onPress={() => kotaTerpilih && pilihKota(kotaTerpilih, true)}
            />
          </View>
        )}

        {hasil && kotaTerpilih && !sedangMemuat && (
          <>
            <StatusData
              sumber={hasil.sumber}
              disimpanPada={hasil.disimpanPada}
            />
            <WeatherCard
              kota={kotaTerpilih.name}
              suhu={hasil.cuaca.saatIni.suhu}
              tingkatAQI={konversiTingkatAQI(hasil.kualitasUdara.indeksAQI)}
              indeksAQI={hasil.kualitasUdara.indeksAQI}
            />
            <Text style={{ fontSize: 12, color: "#888888" }}>
              Kondisi: {labelKodeCuaca(hasil.cuaca.saatIni.kodeCuaca)}{" "}
              {"\u2022"} Angin {hasil.cuaca.saatIni.kecepatanAngin} km/j
            </Text>
            <Button
              title="Perbarui Sekarang"
              onPress={() => pilihKota(kotaTerpilih, true)}
            />
            <Button
              title="Tambahkan ke Favorit"
              onPress={() =>
                router.push({
                  pathname: "/tambah-favorit",
                  params: {
                    id: String(kotaTerpilih.id),
                    nama: kotaTerpilih.name,
                    lat: String(kotaTerpilih.latitude),
                    lon: String(kotaTerpilih.longitude),
                  },
                })
              }
            />
          </>
        )}

        <AtribusiCuaca />
      </ScrollView>
    </SafeAreaView>
  );
}
