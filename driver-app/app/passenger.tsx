import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { WebView } from "react-native-webview";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/themed-view";

// Loading your LIVE Vercel Dashboard inside the app
const VERCEL_MAP_URL = "https://bus-tracker-ten-zeta.vercel.app/";

export default function PassengerScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      {/* Floating Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>Live Map</Text>
      </View>

      <WebView 
        source={{ uri: VERCEL_MAP_URL }} 
        style={styles.map}
        startInLoadingState={true}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1a1a1a",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1000,
  },
  backButton: { 
    marginRight: 15, 
    backgroundColor: "#444", 
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    borderRadius: 5 
  },
});
