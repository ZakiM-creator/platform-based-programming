// src/db/database.ts
import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";

const NAMA_DATABASE = "jelajah-aman.db";
const VERSI_DATABASE = 2;
const NAMA_KUNCI_TAB = "jelajah-aman-sqlite";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

// Khusus web: SQLite di browser menyimpan data di OPFS yang hanya boleh dipegang SATU tab.
// Tab kedua yang tetap membuka database membuat worker SQLite macet ("Invalid VFS state")
// dan error itu terus berulang. Kunci Web Locks dipegang tab pertama selama tab hidup
// (dilepas otomatis saat tab ditutup), sehingga tab lain tidak menyentuh worker sama sekali.
// Hasilnya disimpan di globalThis agar selamat dari Fast Refresh saat pengembangan.
const ruangGlobal = globalThis as { __kunciTabJelajahAman?: Promise<boolean> };

function adalahTabPemegangDatabase(): Promise<boolean> {
  if (Platform.OS !== "web" || typeof navigator === "undefined" || !navigator.locks) {
    return Promise.resolve(true); // HP tidak punya masalah ini
  }
  if (!ruangGlobal.__kunciTabJelajahAman) {
    ruangGlobal.__kunciTabJelajahAman = new Promise<boolean>((selesai) => {
      navigator.locks.request(NAMA_KUNCI_TAB, { ifAvailable: true }, (kunci) => {
        selesai(kunci !== null);
        // Pemegang kunci menahan promise ini selamanya; tab lain mendapat kunci = null
        return kunci ? new Promise<void>(() => {}) : undefined;
      });
    });
  }
  return ruangGlobal.__kunciTabJelajahAman;
}

// Satu pintu untuk seluruh aplikasi: database dibuka dan dimigrasi SEKALI saja
export function ambilDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = bukaDanMigrasi().catch((err) => {
      dbPromise = null; // izinkan percobaan ulang jika gagal
      throw err;
    });
  }
  return dbPromise;
}

async function bukaDanMigrasi(): Promise<SQLite.SQLiteDatabase> {
  if (!(await adalahTabPemegangDatabase())) {
    throw new Error("Database sedang dipakai tab lain");
  }
  const db = await SQLite.openDatabaseAsync(NAMA_DATABASE);
  await migrasiDatabase(db);
  return db;
}

async function migrasiDatabase(db: SQLite.SQLiteDatabase): Promise<void> {
  const baris = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );
  let versiSaatIni = baris?.user_version ?? 0;

  if (versiSaatIni >= VERSI_DATABASE) return;

  if (versiSaatIni < 1) {
    await db.execAsync(` 
      PRAGMA journal_mode = 'wal'; 
    CREATE TABLE IF NOT EXISTS cache_cuaca ( 
        kunci TEXT PRIMARY KEY NOT NULL, 
        kota_id INTEGER NOT NULL, 
        nama_kota TEXT NOT NULL, 
        latitude REAL NOT NULL, 
        longitude REAL NOT NULL, 
        cuaca_json TEXT NOT NULL, 
        aqi_json TEXT NOT NULL, 
        disimpan_pada INTEGER NOT NULL 
      ); 
    `);
    versiSaatIni = 1;
  }

  if (versiSaatIni < 2) {
    // ALTER TABLE menambah kolom tanpa menghapus baris yang sudah ada;
    // DEFAULT 0 mengisi baris lama secara otomatis
    await db.execAsync(
      "ALTER TABLE cache_cuaca ADD COLUMN jumlah_dibuka INTEGER NOT NULL DEFAULT 0;",
    );
    versiSaatIni = 2;
  }

  // Migrasi berikutnya ditambahkan di sini, contoh:
  // if (versiSaatIni < 3) { ...ALTER TABLE...; versiSaatIni = 3; }

  await db.execAsync("PRAGMA user_version = " + VERSI_DATABASE);
}
