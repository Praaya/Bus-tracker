import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import * as Location from "expo-location";

export default function DriverScreen() {
  const [location, setLocation] = useState(null);
  const [tracking, setTracking] = useState(false);

  const startTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission denied");
      return;
    }

    setTracking(true);

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
      },
      (loc) => {
        setLocation(loc.coords);
      }
    );
  };

  const stopTracking = () => {
    setTracking(false);
    alert("Tracking stopped");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Tracking</Text>

      {location && (
        <Text>
          Lat: {location.latitude}{"\n"}
          Lng: {location.longitude}
        </Text>
      )}

      {!tracking ? (
        <Button title="Start Trip" onPress={startTracking} />
      ) : (
        <Button title="End Trip" onPress={stopTracking} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, marginBottom: 20 },
});
