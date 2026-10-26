// src/services/geocodingService.ts
import { GeocodingResponse, HasilGeocoding } from "../types/geocoding";
const BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const BATAS_WAKTU_MS = 8000;
export async function cariKota(nama: string): Promise<HasilGeocoding[]> {
  const url = `${BASE_URL}?name=${encodeURIComponent(nama)}&count=5&language=id&format=json`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), BATAS_WAKTU_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Gagal memuat data (status ${response.status})`);
    }
    const data: GeocodingResponse = await response.json();
    return data.results ?? [];
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("Pencarian kota melebihi batas waktu, coba lagi");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
