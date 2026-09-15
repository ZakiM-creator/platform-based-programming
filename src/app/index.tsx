// import * as Device from 'expo-device';
// import { Platform, StyleSheet } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// import { AnimatedIcon } from '@/components/animated-icon';
// import { HintRow } from '@/components/hint-row';
// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import { WebBadge } from '@/components/web-badge';
// import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

// function getDevMenuHint() {
//   if (Platform.OS === 'web') {
//     return <ThemedText type="small">use browser devtools</ThemedText>;
//   }
//   if (Device.isDevice) {
//     return (
//       <ThemedText type="small">
//         shake device or press <ThemedText type="code">m</ThemedText> in terminal
//       </ThemedText>
//     );
//   }
//   const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
//   return (
//     <ThemedText type="small">
//       press <ThemedText type="code">{shortcut}</ThemedText>
//     </ThemedText>
//   );
// }

// export default function HomeScreen() {
//   return (
//     <ThemedView style={styles.container}>
//       <SafeAreaView style={styles.safeArea}>
//         <ThemedView style={styles.heroSection}>
//           <AnimatedIcon />
//           <ThemedText type="title" style={styles.title}>
//             Build by Zaki Musyaffa wwkwkkwwkwkk
//           </ThemedText>
//         </ThemedView>

//         <ThemedText type="code" style={styles.code}>
//           get started
//         </ThemedText>

//         <ThemedView type="backgroundElement" style={styles.stepContainer}>
//           <HintRow
//             title="Try editing"
//             hint={<ThemedText type="code">src/app/index.tsx</ThemedText>}
//           />
//           <HintRow title="Dev tools" hint={getDevMenuHint()} />
//           <HintRow
//             title="Fresh start"
//             hint={<ThemedText type="code">npm run reset-project</ThemedText>}
//           />
//         </ThemedView>

//         {Platform.OS === 'web' && <WebBadge />}
//       </SafeAreaView>
//     </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     flexDirection: 'row',
//   },
//   safeArea: {
//     flex: 1,
//     paddingHorizontal: Spacing.four,
//     alignItems: 'center',
//     gap: Spacing.three,
//     paddingBottom: BottomTabInset + Spacing.three,
//     maxWidth: MaxContentWidth,
//   },
//   heroSection: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     flex: 1,
//     paddingHorizontal: Spacing.four,
//     gap: Spacing.four,
//   },
//   title: {
//     textAlign: 'center',
//   },
//   code: {
//     textTransform: 'uppercase',
//   },
//   stepContainer: {
//     gap: Spacing.three,
//     alignSelf: 'stretch',
//     paddingHorizontal: Spacing.three,
//     paddingVertical: Spacing.four,
//     borderRadius: Spacing.four,
//   },
// });

// ==========================================================================

// app/index.tsx
import { View } from "react-native";
import { useState, useEffect } from "react";
// Catatan: gunakan ../components/ jika file berada di dalam folder app/
// yang sejajar dengan folder components/
import WeatherCard from "../components/WeatherCard";
import SearchBox from "../components/SearchBox";
import RiwayatList from "../components/RiwayatList";
import LaporanUdaraCard from "../components/LaporanUdaraCard";
import IndikatorAQI from "../components/IndikatorAQI";
import { LaporanUdara } from "../../types/cuaca";

export default function HalamanUtama() {
  const [kotaAktif, setKotaAktif] = useState("Pekalongan");
  const [riwayat, setRiwayat] = useState<string[]>(["Pekalongan"]);

  // State untuk menyimpan data laporan kualitas udara berdasarkan interface LaporanUdara
  const [laporanUdara, setLaporanUdara] = useState<LaporanUdara>({
    kota: "Pekalongan",
    indeksAQI: 45,
    tingkat: "BAIK",
    diperbaruiPada: "08:00 WIB",
  });

  // Tambahkan useEffect untuk mencatat perubahan kota aktif
  useEffect(() => {
    console.log("Kota aktif berubah menjadi:", kotaAktif);
  }, [kotaAktif]);

  function handleCari(kota: string) {
    setKotaAktif(kota);
    if (!riwayat.includes(kota)) {
      setRiwayat([...riwayat, kota]);
    }

    // Simulasi tingkat kualitas udara berdasarkan kota yang dicari
    const lower = kota.toLowerCase();
    let indeks = 75;
    let tingkat: LaporanUdara["tingkat"] = "SEDANG";

    if (lower.includes("pekalongan") || lower.includes("bali")) {
      indeks = 45;
      tingkat = "BAIK";
    } else if (lower.includes("jakarta")) {
      indeks = 155;
      tingkat = "TIDAK_SEHAT";
    } else if (lower.includes("surabaya") || lower.includes("bekasi")) {
      indeks = 210;
      tingkat = "BERBAHAYA";
    } else {
      indeks = 75;
      tingkat = "SEDANG";
    }

    // Update data laporan udara saat pencarian kota
    setLaporanUdara({
      kota: kota,
      indeksAQI: indeks,
      tingkat: tingkat,
      diperbaruiPada: "Baru saja",
    });
  }

  return (
    <View style={{ padding: 16, gap: 16 }}>
      <SearchBox onCari={handleCari} />
      <WeatherCard kota={kotaAktif} suhu={29} tingkatAQI={laporanUdara.tingkat} />
      {/* Integrasi Komponen IndikatorAQI */}
      <IndikatorAQI laporan={laporanUdara} />
      <LaporanUdaraCard laporan={laporanUdara} />
      <RiwayatList daftarKota={riwayat} />
    </View>
  );
}
