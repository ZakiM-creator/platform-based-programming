/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useTema } from '@/components/TemaProvider';

// Warna mengikuti pilihan pengguna di Pengaturan (Terang / Gelap / Ikuti Sistem)
export function useTheme() {
  const { skema } = useTema();

  return Colors[skema];
}
