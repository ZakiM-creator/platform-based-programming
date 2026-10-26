// src/app/(tabs)/pengaturan.tsx
import { useState } from "react";
import { Button, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { Text } from "../../components/TeksTema";
import { useTema } from "../../components/TemaProvider";
import { useTheme } from "../../hooks/use-theme";
import { hapusSemuaCache } from "../../services/cacheRepository";
import { PreferensiTema } from "../../types/tema";

const PILIHAN_TEMA: { nilai: PreferensiTema; label: string }[] = [
  { nilai: "terang", label: "Terang" },
  { nilai: "gelap", label: "Gelap" },
  { nilai: "sistem", label: "Ikuti Sistem" },
];

export default function TabPengaturan() {
  const [pesan, setPesan] = useState<string | null>(null);
  const { preferensi, setPreferensi } = useTema();
  const warna = useTheme();

  async function hapusDataTersimpan() {
    try {
      await hapusSemuaCache();
      setPesan("Data cuaca tersimpan sudah dihapus.");
    } catch {
      setPesan("Gagal menghapus data cuaca tersimpan.");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Jelajah Aman</Text>
      <Text>Versi 1.0.0</Text>

      <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 8 }}>
        Tampilan
      </Text>
      {PILIHAN_TEMA.map((pilihan) => {
        const dipilih = preferensi === pilihan.nilai;
        return (
          <Pressable
            key={pilihan.nilai}
            accessibilityRole="radio"
            accessibilityState={{ selected: dipilih }}
            accessibilityLabel={`Mode tampilan ${pilihan.label}`}
            onPress={() => setPreferensi(pilihan.nilai)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              minHeight: 44,
            }}
          >
            <Ionicons
              name={dipilih ? "radio-button-on" : "radio-button-off"}
              size={22}
              color={warna.text}
            />
            <Text>{pilihan.label}</Text>
          </Pressable>
        );
      })}

      <Button title="Hapus Data Cuaca Tersimpan" onPress={hapusDataTersimpan} />
      {pesan && <Text accessibilityLabel={pesan}>{pesan}</Text>}
    </SafeAreaView>
  );
}
