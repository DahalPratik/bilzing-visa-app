import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "./globals.css";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SplineSans: require("../assets/fonts/SplineSans-Regular.ttf"),
    NotoSans: require("../assets/fonts/NotoSans-Regular.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }
  return <Stack />;
}
