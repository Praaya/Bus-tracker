import React, { useState } from "react";
import { register } from "../services/Api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    busId: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Register Driver</h2>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>Registration successful! Redirecting...</div>}
        
        <input
          name="name"
          placeholder="Full Name"
          style={styles.input}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          style={styles.input}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          style={styles.input}
          onChange={handleChange}
          required
        />
        <input
          name="busId"
          placeholder="Assigned Bus ID (e.g. BUS-01)"
          style={styles.input}
          onChange={handleChange}
          required
        />
        
        <button type="submit" style={styles.button}>Register</button>
        <p style={styles.footer}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5' },
  form: { padding: '40px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '400px' },
  title: { textAlign: 'center', marginBottom: '30px' },
  input: { width: '100%', padding: '12px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
  error: { color: 'red', marginBottom: '15px', textAlign: 'center' },
  success: { color: 'green', marginBottom: '15px', textAlign: 'center' },
  footer: { textAlign: 'center', marginTop: '20px', fontSize: '14px' }
};
