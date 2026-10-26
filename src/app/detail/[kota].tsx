// src/app/detail/[kota].tsx
import { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

import WeatherCard from "../../components/WeatherCard";
import StatusData from "../../components/StatusData";
import { ambilCuacaOfflineFirst } from "../../services/cuacaRepository";
import { konversiTingkatAQI } from "../../services/weatherAdapter";
import { labelKodeCuaca } from "../../constants/weatherCodes";
import { HasilCuacaOffline } from "../../types/cache";

// Hasil satu kali pemuatan, ditandai nomor percobaannya
interface HasilMuat {
  percobaan: number;
  data: HasilCuacaOffline | null;
}

export default function HalamanDetail() {
  const { kota, id, lat, lon } = useLocalSearchParams<{
    kota: string;
    id?: string;
    lat?: string;
    lon?: string;
  }>();

  const [hasilMuat, setHasilMuat] = useState<HasilMuat | null>(null);
  const [percobaan, setPercobaan] = useState(0);

  const latitude = Number(lat);
  const longitude = Number(lon);
  const koordinatValid =
    !!lat && !!lon && Number.isFinite(latitude) && Number.isFinite(longitude);

  useEffect(() => {
    if (!koordinatValid) return;

    // `batal` mencegah hasil kota lama menimpa layar jika parameter berubah
    let batal = false;
    ambilCuacaOfflineFirst(
      {
        id: Number.isFinite(Number(id)) && id ? Number(id) : -1,
        nama: kota,
        latitude,
        longitude,
      },
      { paksaPerbarui: percobaan > 0 },
    )
      .then((data) => {
        if (!batal) setHasilMuat({ percobaan, data });
      })
      .catch(() => {
        if (!batal) setHasilMuat({ percobaan, data: null });
      });

    return () => {
      batal = true;
    };
  }, [koordinatValid, id, kota, latitude, longitude, percobaan]);

  // Dibuka tanpa koordinat (misalnya lewat tautan langsung): jangan tampilkan data karangan
  if (!koordinatValid) {
    return (
      <View style={{ padding: 16, gap: 16 }}>
        <Text accessibilityLabel="Data lokasi kota tidak lengkap">
          Data lokasi kota tidak lengkap. Buka halaman ini dari tab Riwayat.
        </Text>
        <Button title="Kembali" onPress={() => router.back()} />
      </View>
    );
  }

  const sedangMemuat = hasilMuat?.percobaan !== percobaan;
  const hasil = hasilMuat?.data ?? null;

  return (
    <View style={{ padding: 16, gap: 16 }}>
      {sedangMemuat && <ActivityIndicator accessibilityLabel="Memuat cuaca" />}

      {!sedangMemuat && !hasil && (
        <View style={{ gap: 8 }}>
          <Text accessibilityLabel="Belum ada data tersimpan dan tidak ada koneksi internet">
            Belum ada data tersimpan dan tidak ada koneksi internet. Sambungkan
            internet lalu coba lagi.
          </Text>
          <Button
            title="Coba Lagi"
            onPress={() => setPercobaan((n) => n + 1)}
          />
        </View>
      )}

      {!sedangMemuat && hasil && (
        <>
          <StatusData sumber={hasil.sumber} disimpanPada={hasil.disimpanPada} />
          <WeatherCard
            kota={kota}
            suhu={hasil.cuaca.saatIni.suhu}
            tingkatAQI={konversiTingkatAQI(hasil.kualitasUdara.indeksAQI)}
            indeksAQI={hasil.kualitasUdara.indeksAQI}
          />
          <Text style={{ fontSize: 12, color: "#888888" }}>
            Kondisi: {labelKodeCuaca(hasil.cuaca.saatIni.kodeCuaca)}{" "}
            {"•"} Angin {hasil.cuaca.saatIni.kecepatanAngin} km/j
          </Text>
        </>
      )}

      <Button
        title="Tambahkan ke Favorit"
        onPress={() =>
          router.push({
            pathname: "/tambah-favorit",
            params: {
              id: id ?? "-1",
              nama: kota,
              lat: String(latitude),
              lon: String(longitude),
            },
          })
        }
      />
    </View>
  );
}
