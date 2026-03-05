import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { connectSocket, disconnectSocket } from "../services/Socket";

// Custom bus icon (obvious and visible)
const BusIcon = L.divIcon({
  className: 'bus-marker-icon',
  html: `
    <div style='background-color:#e74c3c; width:40px; height:40px; border-radius:50%; border:3px solid white; display:flex; justify-content:center; align-items:center; color:white; font-size:20px; box-shadow:0 0 15px rgba(0,0,0,0.4)'>
      🚌
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

// Forces map update when location changes
function MapUpdater({ center, autoCenter }) {
  const map = useMap();
  useEffect(() => {
    if (autoCenter && center && center[0] !== 0) {
      map.flyTo(center, map.getZoom(), { animate: true, duration: 1 });
    }
  }, [center, autoCenter, map]);
  return null;
}

export default function Dashboard() {
  const [buses, setBuses] = useState({});
  const [mapCenter, setMapCenter] = useState([26.152, 91.885]);
  const [autoCenter, setAutoCenter] = useState(true);
  const [debugLog, setDebugLog] = useState(["Connecting..."]);

  const log = (msg) => {
    setDebugLog(prev => [msg, ...prev].slice(0, 5));
    console.log("[DASHBOARD]", msg);
  };

  useEffect(() => {
    connectSocket(
      (data) => {
        log(`GOT UPDATE: Bus ${data.busId} @ ${data.latitude}, ${data.longitude}`);
        setBuses((prev) => ({
          ...prev,
          [data.busId]: data,
        }));
        setMapCenter([data.latitude, data.longitude]);
      },
      (initialLocations) => {
        log(`SYNC: Received ${initialLocations.length} existing buses`);
        const locationsMap = {};
        initialLocations.forEach((loc) => {
          locationsMap[loc.busId] = loc;
        });
        setBuses(locationsMap);
        if (initialLocations.length > 0) {
          setMapCenter([initialLocations[0].latitude, initialLocations[0].longitude]);
        }
      }
    );

    return () => disconnectSocket();
  }, []);

  const busList = Object.values(buses);

  return (
    <div style={{ height: "100vh", width: "100vw", margin: 0, padding: 0, display: "flex", flexDirection: "column", backgroundColor: '#f0f2f5' }}>
      
      {/* HEADER */}
      <div style={{ padding: "15px", background: "#1a1a1a", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: '0 2px 10px rgba(0,0,0,0.3)', zIndex: 1000 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>🚍 Bus Tracker Pro</h2>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{busList.length} Buses Active</div>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
           <label style={{ fontSize: '0.9rem', background: autoCenter ? '#27ae60' : '#7f8c8d', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
            <input type="checkbox" checked={autoCenter} onChange={() => setAutoCenter(!autoCenter)} /> Auto-Follow
           </label>
        </div>
      </div>

      {/* MAP AREA */}
      <div style={{ flex: 1, position: 'relative', width: '100%', minHeight: '300px' }}>
        <MapContainer
          center={mapCenter}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater center={mapCenter} autoCenter={autoCenter} />

          {busList.map((bus) => (
            <Marker key={bus.busId} position={[bus.latitude, bus.longitude]} icon={BusIcon}>
              <Popup>
                <div style={{ fontWeight: 'bold' }}>Bus {bus.busId}</div>
                <div>Speed: {(bus.speed * 3.6).toFixed(1)} km/h</div>
                <div style={{ fontSize: '0.8rem' }}>{new Date(bus.timestamp).toLocaleTimeString()}</div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* DEBUG LOG OVERLAY */}
        <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', color: '#00ff00', padding: '10px', borderRadius: '5px', fontSize: '12px', pointerEvents: 'none', zIndex: 1000 }}>
          <b>LIVE LOGS:</b>
          {debugLog.map((line, i) => <div key={i}> {line}</div>)}
        </div>
      </div>

      {/* LIST PANEL */}
      <div style={{ height: "100px", background: "white", padding: "10px", borderTop: "2px solid #ddd", display: "flex", gap: "10px", overflowX: "auto" }}>
        {busList.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', color: '#999' }}>Waiting for driver to start trip...</div>
        ) : (
          busList.map(bus => (
            <div key={bus.busId} style={{ border: '1px solid #eee', padding: '10px', borderRadius: '8px', minWidth: '150px', backgroundColor: '#f9f9f9' }}>
              <div style={{ fontWeight: 'bold' }}>Bus {bus.busId}</div>
              <div style={{ fontSize: '0.9rem', color: '#27ae60' }}>● Live Now</div>
              <div style={{ fontSize: '0.8rem' }}>Speed: {(bus.speed * 3.6).toFixed(1)} km/h</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
