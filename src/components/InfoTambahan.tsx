// src/components/InfoTambahan.tsx
import { View } from "react-native";

import { Text } from "./TeksTema";
import { useTheme } from "../hooks/use-theme";
import { DataCuacaLengkap, DataKualitasUdara } from "../types/weather";

interface InfoTambahanProps {
  cuaca: DataCuacaLengkap;
  kualitasUdara: DataKualitasUdara;
}

// API bisa mengirim null untuk satu nilai (misalnya PM saat sensor kosong): tampilkan "-"
function angka(nilai: number | null | undefined): string {
  return typeof nilai === "number" ? String(nilai) : "-";
}

export default function InfoTambahan({ cuaca, kualitasUdara }: InfoTambahanProps) {
  const warna = useTheme();

  // Elemen pertama prakiraan harian adalah hari ini
  const tertinggi = angka(cuaca.harian.suhuMaksimal?.[0]);
  const terendah = angka(cuaca.harian.suhuMinimal?.[0]);
  const pm25 = angka(kualitasUdara.pm25);
  const pm10 = angka(kualitasUdara.pm10);

  const teksSuhu = `Hari ini: tertinggi ${tertinggi}°C, terendah ${terendah}°C`;
  const teksPartikel = `PM2.5 ${pm25} μg/m³ • PM10 ${pm10} μg/m³`;

  return (
    <View
      accessible
      accessibilityLabel={`${teksSuhu}. Partikel udara: ${teksPartikel}`}
      style={{
        padding: 12,
        borderRadius: 8,
        gap: 4,
        backgroundColor: warna.backgroundElement,
      }}
    >
      <Text style={{ fontSize: 14 }}>{teksSuhu}</Text>
      <Text style={{ fontSize: 14 }}>{teksPartikel}</Text>
    </View>
  );
}
