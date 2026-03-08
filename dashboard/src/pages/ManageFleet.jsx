import React, { useEffect, useState } from "react";
import { getAllBuses, deleteBus } from "../services/Api";
import { Link } from "react-router-dom";

export default function ManageFleet() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const data = await getAllBuses();
      setBuses(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch buses");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this bus?")) {
      try {
        await deleteBus(id);
        setBuses(buses.filter(bus => bus._id !== id));
      } catch (err) {
        alert("Failed to delete bus");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Fleet Management</h2>
        <Link to="/" style={styles.backLink}>← Back to Map</Link>
      </div>

      {loading ? (
        <p>Loading buses...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Bus ID</th>
              <th style={styles.th}>Last Lat</th>
              <th style={styles.th}>Last Lng</th>
              <th style={styles.th}>Last Updated</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.map(bus => (
              <tr key={bus._id} style={styles.tr}>
                <td style={styles.td}><b>{bus.busId}</b></td>
                <td style={styles.td}>{bus.latitude.toFixed(4)}</td>
                <td style={styles.td}>{bus.longitude.toFixed(4)}</td>
                <td style={styles.td}>{new Date(bus.lastUpdated).toLocaleString()}</td>
                <td style={styles.td}>
                  <button 
                    onClick={() => handleDelete(bus._id)}
                    style={styles.deleteButton}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '40px', backgroundColor: '#f0f2f5', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  title: { margin: 0 },
  backLink: { textDecoration: 'none', color: '#3498db', fontWeight: 'bold' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  th: { padding: '15px', backgroundColor: '#1a1a1a', color: 'white', textAlign: 'left' },
  td: { padding: '15px', borderBottom: '1px solid #eee' },
  deleteButton: { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' },
  tr: { hover: { backgroundColor: '#f9f9f9' } }
};
