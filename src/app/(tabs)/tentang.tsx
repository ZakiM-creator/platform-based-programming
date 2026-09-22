import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { typeScale, spacing } from "../../constants/styles";

export default function TentangScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.judul} accessibilityLabel="Judul halaman tentang">
        Orientasi Jelajah Aman
      </Text>

      <View style={styles.infoContainer}>
        <Text style={styles.subjudul}>Versi Aplikasi:</Text>
        <Text style={styles.isi}>1.0.0</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.subjudul}>
          Nama Pembuat: Muhammad Zaki Musyaffa
        </Text>
        <Text style={styles.isi}>Nama Aplikasi: Peramal Cuaca</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.sedang,
    backgroundColor: "#fff",
  },
  judul: {
    fontSize: typeScale.judul,
    fontWeight: "bold",
    marginBottom: spacing.besar,
    textAlign: "center",
  },
  infoContainer: {
    marginBottom: spacing.sedang,
  },
  subjudul: {
    fontSize: typeScale.subjudul,
    fontWeight: "600",
    marginBottom: spacing.kecil,
  },
  isi: {
    fontSize: typeScale.isi,
  },
});
