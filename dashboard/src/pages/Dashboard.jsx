import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Link } from "react-router-dom";
import { connectSocket, disconnectSocket } from "../services/Socket";
import { getAllRoutes } from "../services/Api";

// Custom bus icon
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

export default function Dashboard() {
  const [buses, setBuses] = useState({});
  const [routes, setRoutes] = useState([]);
  const [mapCenter, setMapCenter] = useState([26.152, 91.885]);
  const [autoCenter, setAutoCenter] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debugLog, setDebugLog] = useState(["Connecting..."]);

  const log = (msg) => {
    setDebugLog(prev => [msg, ...prev].slice(0, 5));
    console.log("[DASHBOARD]", msg);
  };

  useEffect(() => {
    // Fetch static routes
    const fetchRoutes = async () => {
      try {
        const data = await getAllRoutes();
        setRoutes(data);
        log(`Loaded ${data.length} routes`);
      } catch (err) {
        log("Error loading routes");
      }
    };
    fetchRoutes();

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

  const busList = Object.values(buses).filter(bus => 
    bus.busId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRoutes = routes.filter(route => 
    route.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.routeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ height: "100vh", width: "100vw", margin: 0, padding: 0, display: "flex", flexDirection: "column", backgroundColor: '#f0f2f5' }}>
      
      {/* HEADER */}
      <div style={{ padding: "15px", background: "#1a1a1a", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: '0 2px 10px rgba(0,0,0,0.3)', zIndex: 1000 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>🚍 Bus Tracker Pro</h2>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{Object.keys(buses).length} Total Buses Active</div>
        </div>

        {/* Search Bar */}
        <div style={{ flex: 1, margin: '0 40px', maxWidth: '400px' }}>
          <input 
            type="text" 
            placeholder="Search Bus ID or Route..." 
            style={{ width: '100%', padding: '10px 15px', borderRadius: '20px', border: 'none', background: '#333', color: 'white', outline: 'none' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
           <Link to="/manage" style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem', marginRight: '15px', padding: '5px 10px', border: '1px solid #444', borderRadius: '4px' }}>⚙️ Manage Fleet</Link>
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

          {/* Render Routes */}
          {filteredRoutes.map(route => (
            <React.Fragment key={route._id}>
              <Polyline 
                positions={route.path.map(p => [p.latitude, p.longitude])} 
                color="#3498db" 
                weight={5} 
                opacity={0.6}
              />
              {route.stops.map((stop, idx) => (
                <CircleMarker 
                  key={idx} 
                  center={[stop.latitude, stop.longitude]} 
                  radius={6} 
                  color="#2c3e50" 
                  fillColor="#ecf0f1" 
                  fillOpacity={1}
                >
                  <Popup><b>Stop:</b> {stop.name}</Popup>
                </CircleMarker>
              ))}
            </React.Fragment>
          ))}

          {/* Render Buses */}
          {busList.map((bus) => (
            <Marker 
              key={bus.busId} 
              position={[bus.latitude, bus.longitude]} 
              icon={BusIcon}
              eventHandlers={{
                click: (e) => {
                  const map = e.target._map;
                  map.flyTo(e.latlng, 17, { animate: true, duration: 1.5 });
                },
              }}
            >
              <Popup>
                <div style={{ fontWeight: 'bold' }}>Bus {bus.busId}</div>
                <div>Speed: {(bus.speed * 3.6).toFixed(1)} km/h</div>
                <div style={{ fontSize: '0.8rem' }}>{new Date(bus.lastUpdated).toLocaleTimeString()}</div>
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
