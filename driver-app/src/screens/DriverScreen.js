import React, { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";
import {
  startLocationTracking,
  stopLocationTracking,
} from "../services/locationService";

export default function DriverScreen() {
  const [busId, setBusId] = useState("");
  const [location, setLocation] = useState(null);
  const [tracking, setTracking] = useState(false);

  const startTrip = () => {
    if (!busId) {
      alert("Enter Bus ID");
      return;
    }

    setTracking(true);

    startLocationTracking((coords) => {
      setLocation(coords);

      const payload = {
        busId,
        lat: coords.latitude,
        lng: coords.longitude,
        speed: coords.speed || 0,
        timestamp: Date.now(),
      };

      console.log("PAYLOAD:", payload);
    });
  };

  const endTrip = () => {
    stopLocationTracking();
    setTracking(false);
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
