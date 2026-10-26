// src/app/tambah-favorit.tsx
import { View, Text, Button } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { tambahFavorit } from "../services/favoritStorage";

export default function ModalTambahFavorit() {
  const { id, nama, lat, lon } = useLocalSearchParams<{
    id: string;
    nama: string;
    lat: string;
    lon: string;
  }>();

  // Jangan pernah menyimpan favorit dari parameter yang kosong atau bukan angka
  const dataValid =
    !!nama &&
    !!id &&
    !!lat &&
    !!lon &&
    Number.isFinite(Number(id)) &&
    Number.isFinite(Number(lat)) &&
    Number.isFinite(Number(lon));

  async function simpan() {
    await tambahFavorit({
      id: Number(id),
      nama,
      latitude: Number(lat),
      longitude: Number(lon),
    });
    router.back();
  }

  if (!dataValid) {
    return (
      <View style={{ padding: 16, gap: 16 }}>
        <Text accessibilityLabel="Data kota tidak lengkap, tidak bisa disimpan">
          Data kota tidak lengkap sehingga tidak bisa disimpan. Buka dari Beranda
          atau halaman Detail.
        </Text>
        <Button title="Tutup" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={{ padding: 16, gap: 16 }}>
      <Text>Tambahkan {nama} ke daftar favorit?</Text>
      <Button title="Simpan" onPress={simpan} />
    </View>
  );
}
