// src/components/TeksTema.tsx
import { Text as RNText, TextProps } from "react-native";

import { useTheme } from "../hooks/use-theme";

// Pengganti Text bawaan: warna default mengikuti tema aktif.
// Style dari pemanggil tetap menang, jadi teks berwarna khusus tidak berubah.
export function Text({ style, ...props }: TextProps) {
  const warna = useTheme();
  return <RNText {...props} style={[{ color: warna.text }, style]} />;
}
