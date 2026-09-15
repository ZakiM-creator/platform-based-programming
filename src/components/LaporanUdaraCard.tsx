// src/components/LaporanUdaraCard.tsx
import { View, Text } from "react-native";
import { LaporanUdara } from "../../types/cuaca";

interface LaporanUdaraCardProps {
  laporan: LaporanUdara;
}

export default function LaporanUdaraCard({ laporan }: LaporanUdaraCardProps) {
  // Menentukan warna berdasarkan tingkat AQI
  const getWarnaTingkat = (tingkat: LaporanUdara["tingkat"]) => {
    switch (tingkat) {
      case "BAIK":
        return "green";
      case "SEDANG":
        return "orange";
      case "TIDAK_SEHAT":
        return "#E53E3E";
      case "BERBAHAYA":
        return "#742A2A";
      default:
        return "#4A5568";
    }
  };

  return (
    <View
      style={{
        padding: 16,
        borderRadius: 8,
        backgroundColor: "#EBF8FF",
        borderWidth: 1,
        borderColor: "#BEE3F8",
        gap: 6,
      }}
    >
      <Text style={{ fontSize: 12, color: "#2B6CB0", fontWeight: "bold" }}>
        LAPORAN KUALITAS UDARA
      </Text>
      <Text style={{ fontWeight: "bold", fontSize: 18 }}>{laporan.kota}</Text>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        Indeks AQI: {laporan.indeksAQI}
      </Text>
      <Text style={{ color: getWarnaTingkat(laporan.tingkat), fontWeight: "bold" }}>
        Status: {laporan.tingkat}
      </Text>
      {laporan.diperbaruiPada && (
        <Text style={{ fontSize: 12, color: "#718096" }}>
          Diperbarui pada: {laporan.diperbaruiPada}
        </Text>
      )}
    </View>
  );
}
