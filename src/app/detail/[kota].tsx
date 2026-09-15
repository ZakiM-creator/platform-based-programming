// src/app/detail/[kota].tsx

import { View, Button } from "react-native";
import { useLocalSearchParams, Link } from "expo-router";
import WeatherCard from "../../components/WeatherCard";

export default function HalamanDetail() {
  const { kota } = useLocalSearchParams<{ kota: string }>();

  return (
    <View style={{ padding: 16, gap: 16 }}>
      <WeatherCard kota={kota} suhu={29} tingkatAQI="BAIK" />

      {/* Tambahkan tombol ini untuk membuka modal */}
      <Link href="/tambah-favorit" asChild>
        <Button title="Tambah Favorit" />
      </Link>
    </View>
  );
}
