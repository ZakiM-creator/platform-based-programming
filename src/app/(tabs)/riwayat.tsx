// src/app/(tabs)/riwayat.tsx
import { useState, useCallback } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { ambilSemuaFavorit, hapusFavorit } from "../../services/favoritStorage";
import { KotaFavorit } from "../../types/favorit";

export default function TabRiwayat() {
  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);

  useFocusEffect(
    useCallback(() => {
      ambilSemuaFavorit().then(setDaftarFavorit);
    }, []),
  );

  async function prosesHapus(id: number) {
    await hapusFavorit(id);
    setDaftarFavorit((prev) => prev.filter((k) => k.id !== id));
  }

  function konfirmasiHapus(id: number, nama: string) {
    // Khusus Web: Alert.alert tidak mendukung multi-button callback di browser
    if (Platform.OS === "web") {
      const yakin = window.confirm(`Yakin hapus ${nama}?`);
      if (yakin) {
        prosesHapus(id);
      }
      return;
    }

    // Native Android dan iOS: gunakan Alert.alert bawaan
    Alert.alert(
      "Konfirmasi Hapus",
      `Yakin hapus ${nama}?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => prosesHapus(id),
        },
      ],
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Kota Favorit</Text>
      <Text style={{ fontSize: 14, color: "#666" }}>
        Tersimpan {daftarFavorit.length} kota
      </Text>

      {daftarFavorit.length === 0 && <Text>Belum ada kota favorit</Text>}

      {daftarFavorit.map((kota) => (
        <View
          key={kota.id}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link
            href={{
              pathname: "/detail/[kota]",
              params: {
                kota: kota.nama,
                id: String(kota.id),
                lat: String(kota.latitude),
                lon: String(kota.longitude),
              },
            }}
            asChild
          >
            <TouchableOpacity
              accessibilityRole="link"
              accessibilityLabel={`Lihat detail cuaca ${kota.nama}`}
              style={{ flex: 1, minHeight: 44, justifyContent: "center" }}
            >
              <Text>{kota.nama}</Text>
            </TouchableOpacity>
          </Link>
          <Button
            title="Hapus"
            color="#d9534f"
            onPress={() => konfirmasiHapus(kota.id, kota.nama)}
          />
        </View>
      ))}
    </SafeAreaView>
  );
}
