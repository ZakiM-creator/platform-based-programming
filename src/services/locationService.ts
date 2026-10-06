// src/services/locationService.ts
import * as Location from "expo-location";

export type StatusIzinLokasi = "granted" | "denied" | "unavailable";

export async function mintaIzinLokasi(): Promise<StatusIzinLokasi> {
  // 1. Cek apakah hardware/layanan GPS di perangkat menyala
  const layananAktif = await Location.hasServicesEnabledAsync();
  if (!layananAktif) {
    return "unavailable";
  }

  // 2. Minta izin akses lokasi foreground (When In Use)
  const { status } = await Location.requestForegroundPermissionsAsync();

  return status === "granted" ? "granted" : "denied";
}

export async function ambilKoordinatSaatIni() {
  const lokasi = await Location.getCurrentPositionAsync({});
  return {
    latitude: lokasi.coords.latitude,
    longitude: lokasi.coords.longitude,
  };
}
