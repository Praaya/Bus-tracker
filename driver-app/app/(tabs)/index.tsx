import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import {
  startLocationTracking,
  stopLocationTracking,
} from "../../src/services/locationServices";
import { connectSocket, disconnectSocket, sendLocation } from "../../src/services/socketService";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "../../src/context/AuthContext";

interface LocationCoords {
  latitude: number;
  longitude: number;
  speed: number | null;
}

export default function DriverHomeScreen() {
  const { user, logout } = useAuth();
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [tracking, setTracking] = useState(false);

  const busId = user?.busId || "Unknown";

  const startTrip = async () => {
    setTracking(true);
    connectSocket();

    await startLocationTracking((coords: LocationCoords) => {
      setLocation(coords);

      const payload = {
        busId, // explicitly send busId
        latitude: coords.latitude,
        longitude: coords.longitude,
        speed: coords.speed || 0,
        timestamp: Date.now(),
      };

      console.log("Emitting location for:", busId, payload);
      sendLocation(payload);
    });
  };

  const endTrip = () => {
    stopLocationTracking();
    disconnectSocket();
    setTracking(false);
    setLocation(null);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="subtitle">Welcome, {user?.name}</ThemedText>
        <TouchableOpacity onPress={logout}>
          <ThemedText style={styles.logoutText}>Logout</ThemedText>
        </TouchableOpacity>
      </View>

      <ThemedText type="title" style={styles.title}>Bus: {busId}</ThemedText>

      {location && (
        <View style={styles.locationBox}>
          <ThemedText>Lat: {location.latitude.toFixed(6)}</ThemedText>
          <ThemedText>Lng: {location.longitude.toFixed(6)}</ThemedText>
          <ThemedText>Speed: {(location.speed || 0).toFixed(1)} m/s</ThemedText>
        </View>
      )}

      <View style={styles.buttonContainer}>
        {!tracking ? (
          <Button title="Start Trip" color="#4CAF50" onPress={startTrip} />
        ) : (
          <Button title="End Trip" color="#F44336" onPress={endTrip} />
        )}
      </View>

      {tracking && (
        <ThemedText style={styles.trackingInfo}>
          📡 Live tracking active...
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutText: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  locationBox: {
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 8,
    width: "100%",
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
  },
  trackingInfo: {
    marginTop: 20,
    textAlign: 'center',
    color: "#4CAF50",
    fontWeight: "bold",
  },
});
