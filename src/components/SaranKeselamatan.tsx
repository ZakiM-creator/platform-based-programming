// src/components/SaranKeselamatan.tsx
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Text } from "./TeksTema";
import { warnaPerTingkat } from "./WeatherCard";
import { useTheme } from "../hooks/use-theme";
import { saranKeselamatan } from "../services/weatherAdapter";
import { TingkatAQI } from "../types/cuaca";

interface SaranKeselamatanProps {
  tingkatAQI: TingkatAQI;
}

export default function SaranKeselamatan({ tingkatAQI }: SaranKeselamatanProps) {
  const warna = useTheme();
  const saran = saranKeselamatan(tingkatAQI);
  const aman = tingkatAQI === "BAIK" || tingkatAQI === "SEDANG";

  return (
    <View
      accessible
      accessibilityLabel={`Saran: ${saran}`}
      style={{
        flexDirection: "row",
        gap: 10,
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: warnaPerTingkat[tingkatAQI],
        backgroundColor: warna.backgroundElement,
      }}
    >
      <Ionicons
        name={aman ? "shield-checkmark" : "warning"}
        size={24}
        color={warnaPerTingkat[tingkatAQI]}
      />
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ fontSize: 14 }}>{saran}</Text>
        <Text style={{ fontSize: 11, color: warna.textSecondary }}>
          Saran umum berdasarkan indeks kualitas udara Eropa, bukan nasihat medis.
        </Text>
      </View>
    </View>
  );
}
