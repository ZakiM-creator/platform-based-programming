// src/utils/konfirmasi.ts
import { Alert, Platform } from "react-native";

// Dialog konfirmasi lintas platform untuk aksi yang tidak bisa dibatalkan.
// Alert.alert di react-native-web tidak menampilkan apa pun, jadi web memakai window.confirm.
export function konfirmasi(
  judul: string,
  pesan: string,
  labelAksi: string,
  onSetuju: () => void,
) {
  if (Platform.OS === "web") {
    if (window.confirm(`${judul}\n${pesan}`)) onSetuju();
    return;
  }

  Alert.alert(judul, pesan, [
    { text: "Batal", style: "cancel" },
    { text: labelAksi, style: "destructive", onPress: onSetuju },
  ]);
}
