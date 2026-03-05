import React, { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet, Alert, Platform } from "react-native";
import {
  startLocationTracking,
  stopLocationTracking,
} from "../../src/services/locationServices";
import { connectSocket, disconnectSocket, sendLocation } from "../../src/services/socketService";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function DriverHomeScreen() {
  const [busId, setBusId] = useState("");
  const [location, setLocation] = useState(null);
  const [tracking, setTracking] = useState(false);

  const startTrip = async () => {
    if (!busId.trim()) {
      Alert.alert("Error", "Please enter a valid Bus ID");
      return;
    }

    setTracking(true);
    connectSocket();

    await startLocationTracking((coords) => {
      setLocation(coords);

      const payload = {
        busId,
        latitude: coords.latitude,
        longitude: coords.longitude,
        speed: coords.speed || 0,
        timestamp: Date.now(),
      };

      console.log("Emitting location:", payload);
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
      <ThemedText type="title" style={styles.title}>Driver Panel</ThemedText>

      <TextInput
        placeholder="Bus ID (e.g., bus_01)"
        placeholderTextColor="#999"
        style={styles.input}
        value={busId}
        onChangeText={setBusId}
        editable={!tracking}
      />

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
          Currently tracking and sending location updates...
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
  },
  title: {
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
    color: "#4CAF50",
    fontWeight: "bold",
  },
});
