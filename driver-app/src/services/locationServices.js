import * as Location from "expo-location";

let watcher = null;

export const startLocationTracking = async (onUpdate) => {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    alert("Permission denied");
    return;
  }

  watcher = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 5000,
      distanceInterval: 10,
    },
    (loc) => {
      onUpdate(loc.coords);
    }
  );
};

export const stopLocationTracking = () => {
  if (watcher) {
    watcher.remove();
    watcher = null;
  }
};
