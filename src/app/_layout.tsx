// src/app/_layout.tsx

import { Stack, ThemeProvider, DarkTheme, DefaultTheme } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { TemaProvider, useTema } from "../components/TemaProvider";
import { Colors } from "../constants/theme";

// Tema navigasi (header, tab bar, latar layar) memakai palet yang sama dengan Colors
const temaNavigasi = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: Colors.light.background,
      card: Colors.light.backgroundElement,
      text: Colors.light.text,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: Colors.dark.background,
      card: Colors.dark.backgroundElement,
      text: Colors.dark.text,
    },
  },
};

function NavigasiBertema() {
  const { skema } = useTema();

  return (
    <ThemeProvider value={temaNavigasi[skema]}>
      <StatusBar style={skema === "dark" ? "light" : "dark"} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="detail/[kota]"
          options={{ title: "Detail Cuaca" }}
        />
        <Stack.Screen
          name="tambah-favorit"
          options={{ presentation: "modal", title: "Tambah Favorit" }}
        />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <TemaProvider>
      <NavigasiBertema />
    </TemaProvider>
  );
}
