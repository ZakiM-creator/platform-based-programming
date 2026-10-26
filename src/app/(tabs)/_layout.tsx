// src/app/(tabs)/_layout.tsx

import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Catatan tipe: `color` dari tabBarIcon bertipe ColorValue, tetapi nilainya selalu string
// warna dari tema navigasi (tidak ada tint kustom), sehingga aman di-cast ke string.
export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Beranda",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color as string}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="riwayat"
        options={{
          // Judul header menjelaskan isi layar; label tab dibuat pendek agar muat di 4 tab
          title: "Favorit & Riwayat",
          tabBarLabel: "Riwayat",
          tabBarAccessibilityLabel: "Favorit dan Riwayat pencarian",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "time" : "time-outline"}
              size={size}
              color={color as string}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="pengaturan"
        options={{
          title: "Pengaturan",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={size}
              color={color as string}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tentang"
        options={{
          title: "Tentang",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "information-circle" : "information-circle-outline"}
              size={size}
              color={color as string}
            />
          ),
        }}
      />
    </Tabs>
  );
}
