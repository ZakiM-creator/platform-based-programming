// src/services/weatherAdapter.ts
import { TingkatAQI } from "../types/cuaca";
export function konversiTingkatAQI(indeksEropa: number): TingkatAQI {
  if (indeksEropa <= 20) return "BAIK";
  if (indeksEropa <= 40) return "SEDANG";
  if (indeksEropa <= 60) return "TIDAK_SEHAT";
  return "BERBAHAYA";
}

// Saran umum per kategori. Bukan nasihat medis: hanya panduan ringan berdasarkan kategori.
export function saranKeselamatan(tingkat: TingkatAQI): string {
  switch (tingkat) {
    case "BAIK":
      return "Kualitas udara baik. Aman untuk beraktivitas di luar ruangan.";
    case "SEDANG":
      return "Kualitas udara cukup baik. Orang yang sensitif terhadap polusi sebaiknya lebih berhati-hati.";
    case "TIDAK_SEHAT":
      return "Kualitas udara kurang sehat. Batasi aktivitas berat di luar ruangan.";
    case "BERBAHAYA":
      return "Kualitas udara buruk. Kurangi aktivitas di luar ruangan dan pertimbangkan memakai masker.";
  }
}
