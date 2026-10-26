// src/services/temaStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PreferensiTema } from "../types/tema";

const KUNCI_PENYIMPANAN = "@jelajah_aman:tema";

function valid(nilai: string | null): nilai is PreferensiTema {
  return nilai === "terang" || nilai === "gelap" || nilai === "sistem";
}

export async function ambilPreferensiTema(): Promise<PreferensiTema> {
  const nilai = await AsyncStorage.getItem(KUNCI_PENYIMPANAN);
  return valid(nilai) ? nilai : "sistem";
}

export async function simpanPreferensiTema(
  preferensi: PreferensiTema,
): Promise<void> {
  await AsyncStorage.setItem(KUNCI_PENYIMPANAN, preferensi);
}
