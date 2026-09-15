// src/components/IndikatorAQI.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LaporanUdara, TingkatAQI } from "../../types/cuaca";

export interface IndikatorAQIProps {
  laporan?: LaporanUdara;
  data?: LaporanUdara;
}

export default function IndikatorAQI({ laporan, data }: IndikatorAQIProps) {
  // Mengambil data dari prop 'laporan' atau 'data'
  const dataLaporan = laporan ?? data;

  if (!dataLaporan) {
    return null;
  }

  // Fungsi untuk menentukan warna dan deskripsi berdasarkan status tingkat AQI
  const getWarnaTingkat = (tingkat: TingkatAQI) => {
    switch (tingkat) {
      case "BAIK":
        return {
          warnaTeks: "#15803D",     // Hijau
          warnaLatar: "#DCFCE7",    // Hijau muda
          warnaBorder: "#86EFAC",   // Border hijau
          keterangan: "Kualitas udara sangat baik dan aman bagi pernapasan.",
        };
      case "SEDANG":
        return {
          warnaTeks: "#D97706",     // Oranye / Kuning tua
          warnaLatar: "#FEF3C7",    // Oranye/Kuning muda
          warnaBorder: "#FDE68A",   // Border oranye
          keterangan: "Kualitas udara dapat diterima untuk kebanyakan orang.",
        };
      case "TIDAK_SEHAT":
        return {
          warnaTeks: "#DC2626",     // Merah
          warnaLatar: "#FEE2E2",    // Merah muda
          warnaBorder: "#FCA5A5",   // Border merah
          keterangan: "Kualitas udara tidak sehat, gunakan masker bila bepergian.",
        };
      case "BERBAHAYA":
        return {
          warnaTeks: "#7F1D1D",     // Merah Tua / Maroon
          warnaLatar: "#FFE4E6",    // Pink / Merah pucat
          warnaBorder: "#FDA4AF",   // Border maroon
          keterangan: "Peringatan darurat! Kualitas udara berbahaya bagi masyarakat.",
        };
      default:
        return {
          warnaTeks: "#4B5563",     // Abu-abu
          warnaLatar: "#F3F4F6",
          warnaBorder: "#E5E7EB",
          keterangan: "Informasi kualitas udara tidak tersedia.",
        };
    }
  };

  const statusConfig = getWarnaTingkat(dataLaporan.tingkat);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: statusConfig.warnaLatar,
          borderColor: statusConfig.warnaBorder,
        },
      ]}
    >
      <Text style={styles.header}>INDIKATOR KUALITAS UDARA (AQI)</Text>

      <View style={styles.contentRow}>
        <View style={styles.infoCol}>
          <Text style={styles.kotaText}>{dataLaporan.kota}</Text>
          {/* Teks dengan warna berbeda tergantung status tingkat kualitas udaranya */}
          <Text style={[styles.statusText, { color: statusConfig.warnaTeks }]}>
            Status: {dataLaporan.tingkat}
          </Text>
        </View>

        <View
          style={[
            styles.badgeAQI,
            { backgroundColor: statusConfig.warnaTeks },
          ]}
        >
          <Text style={styles.badgeLabel}>AQI</Text>
          <Text style={styles.badgeValue}>{dataLaporan.indeksAQI}</Text>
        </View>
      </View>

      <Text style={[styles.keteranganText, { color: statusConfig.warnaTeks }]}>
        {statusConfig.keterangan}
      </Text>

      {dataLaporan.diperbaruiPada && (
        <Text style={styles.updateText}>
          Diperbarui pada: {dataLaporan.diperbaruiPada}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  header: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4B5563",
    letterSpacing: 0.5,
  },
  contentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoCol: {
    flex: 1,
    gap: 2,
  },
  kotaText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  statusText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  badgeAQI: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 64,
  },
  badgeLabel: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  badgeValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  keteranganText: {
    fontSize: 13,
    fontWeight: "500",
  },
  updateText: {
    fontSize: 11,
    color: "#6B7280",
    fontStyle: "italic",
  },
});
