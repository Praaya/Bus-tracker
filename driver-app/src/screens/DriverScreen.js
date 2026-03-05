import React, { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet, Alert } from "react-native";
import {
  startLocationTracking,
  stopLocationTracking,
} from "../services/locationServices";
import { connectSocket, disconnectSocket, sendLocation } from "../services/socketService";

export default function DriverScreen() {
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
    <View style={styles.container}>
      <Text style={styles.title}>Driver Panel</Text>

      <TextInput
        placeholder="Bus ID"
        style={styles.input}
        value={busId}
        onChangeText={setBusId}
      />

      {location && (
        <Text>
          {location.latitude}{"\n"}
          {location.longitude}
        </Text>
      )}

      {!tracking ? (
        <Button title="Start Trip" onPress={startTrip} />
      ) : (
        <Button title="End Trip" onPress={endTrip} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  input: {
    borderWidth: 1,
    width: 200,
    padding: 10,
    marginBottom: 20,
  },
  title: { fontSize: 22, marginBottom: 20 },
});
