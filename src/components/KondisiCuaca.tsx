// src/components/KondisiCuaca.tsx
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Text } from "./TeksTema";
import { useTheme } from "../hooks/use-theme";
import { ikonKodeCuaca, labelKodeCuaca } from "../constants/weatherCodes";

interface KondisiCuacaProps {
  kodeCuaca: number;
  kecepatanAngin: number;
}

export default function KondisiCuaca({
  kodeCuaca,
  kecepatanAngin,
}: KondisiCuacaProps) {
  const warna = useTheme();
  const label = labelKodeCuaca(kodeCuaca);

  return (
    <View
      accessible
      accessibilityLabel={`Kondisi ${label}, angin ${kecepatanAngin} kilometer per jam`}
      style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
    >
      <Ionicons name={ikonKodeCuaca(kodeCuaca)} size={32} color={warna.text} />
      <View>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>{label}</Text>
        <Text style={{ fontSize: 12, color: warna.textSecondary }}>
          Angin {kecepatanAngin} km/j
        </Text>
      </View>
    </View>
  );
}
