// src/components/TemaProvider.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

import { useColorScheme } from "../hooks/use-color-scheme";
import {
  ambilPreferensiTema,
  simpanPreferensiTema,
} from "../services/temaStorage";
import { PreferensiTema, SkemaWarna } from "../types/tema";

interface NilaiTema {
  preferensi: PreferensiTema;
  setPreferensi: (preferensi: PreferensiTema) => void;
  skema: SkemaWarna; // hasil akhir: "light" atau "dark"
}

const TemaContext = createContext<NilaiTema>({
  preferensi: "sistem",
  setPreferensi: () => {},
  skema: "light",
});

export function TemaProvider({ children }: { children: ReactNode }) {
  const skemaSistem = useColorScheme();
  const [preferensi, setPreferensiState] = useState<PreferensiTema>("sistem");

  // Muat pilihan terakhir pengguna saat aplikasi dibuka
  useEffect(() => {
    ambilPreferensiTema()
      .then(setPreferensiState)
      .catch(() => {});
  }, []);

  function setPreferensi(baru: PreferensiTema) {
    setPreferensiState(baru);
    simpanPreferensiTema(baru).catch(() => {});
  }

  // "sistem" mengikuti perangkat; dua pilihan lain mengabaikan perangkat
  const skema: SkemaWarna =
    preferensi === "sistem"
      ? skemaSistem === "dark"
        ? "dark"
        : "light"
      : preferensi === "gelap"
        ? "dark"
        : "light";

  return (
    <TemaContext.Provider value={{ preferensi, setPreferensi, skema }}>
      {children}
    </TemaContext.Provider>
  );
}

export function useTema() {
  return useContext(TemaContext);
}
