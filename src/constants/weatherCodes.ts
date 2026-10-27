// src/constants/weatherCodes.ts
import type { ComponentProps } from "react";
import type { Ionicons } from "@expo/vector-icons";

const kamusKodeCuaca: Record<number, string> = {
  0: "Cerah",
  1: "Cerah Berawan",
  2: "Berawan Sebagian",
  3: "Mendung",
  45: "Berkabut",
  48: "Kabut Beku",
  51: "Gerimis Ringan",
  53: "Gerimis Sedang",
  55: "Gerimis Lebat",
  61: "Hujan Ringan",
  63: "Hujan Sedang",
  65: "Hujan Lebat",
  71: "Salju Ringan",
  80: "Hujan Lokal Ringan",
  81: "Hujan Lokal Sedang",
  82: "Hujan Lokal Lebat",
  95: "Badai Petir",
};

export function labelKodeCuaca(kode: number): string {
  return kamusKodeCuaca[kode] ?? "Tidak diketahui";
}

export type NamaIkonCuaca = ComponentProps<typeof Ionicons>["name"];

// Hanya kode yang ada di kamus di atas; kode lain jatuh ke ikon tanda tanya,
// sejalan dengan label "Tidak diketahui"
const ikonKodeCuacaMap: Record<number, NamaIkonCuaca> = {
  0: "sunny",
  1: "partly-sunny",
  2: "partly-sunny",
  3: "cloudy",
  45: "cloud",
  48: "cloud",
  51: "rainy",
  53: "rainy",
  55: "rainy",
  61: "rainy",
  63: "rainy",
  65: "rainy",
  71: "snow",
  80: "rainy",
  81: "rainy",
  82: "rainy",
  95: "thunderstorm",
};

export function ikonKodeCuaca(kode: number): NamaIkonCuaca {
  return ikonKodeCuacaMap[kode] ?? "help-circle-outline";
}
