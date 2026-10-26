// src/services/riwayatStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RiwayatPencarian } from "../types/riwayat";

const KUNCI_PENYIMPANAN = "@jelajah_aman:riwayat_pencarian";
export const MAKS_RIWAYAT = 10;

export async function ambilRiwayat(): Promise<RiwayatPencarian[]> {
  try {
    const json = await AsyncStorage.getItem(KUNCI_PENYIMPANAN);
    return json ? JSON.parse(json) : [];
  } catch {
    return []; // data rusak: mulai dari riwayat kosong
  }
}

// Antrean menjaga dua pencatatan beruntun tidak saling menimpa (baca-ubah-tulis)
let antrean: Promise<void> = Promise.resolve();

async function simpanBaru(kota: RiwayatPencarian): Promise<void> {
  const daftar = await ambilRiwayat();
  // Kota yang sama dipindah ke paling atas, bukan dicatat dua kali
  const tanpaDuplikat = daftar.filter((k) => k.id !== kota.id);
  const daftarBaru = [kota, ...tanpaDuplikat].slice(0, MAKS_RIWAYAT);
  await AsyncStorage.setItem(KUNCI_PENYIMPANAN, JSON.stringify(daftarBaru));
}

// Gagal mencatat riwayat tidak boleh mengganggu pencarian, jadi tidak pernah melempar error
export function catatRiwayat(kota: RiwayatPencarian): Promise<void> {
  antrean = antrean.then(() => simpanBaru(kota)).catch(() => {});
  return antrean;
}
