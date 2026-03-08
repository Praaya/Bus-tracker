import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";
import axios from "axios";

const API_URL = "https://bus-tracker-production-c53a.up.railway.app/api";

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    busId: ""
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.busId) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/register`, formData);
      Alert.alert("Success", "Account created! Please login.");
      router.replace("/login");
    } catch (error) {
      Alert.alert("Registration Failed", error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>Driver Sign Up</ThemedText>
        
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#999"
          value={formData.name}
          onChangeText={(val) => setFormData({...formData, name: val})}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={formData.email}
          onChangeText={(val) => setFormData({...formData, email: val})}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={formData.password}
          onChangeText={(val) => setFormData({...formData, password: val})}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Assigned Bus ID (e.g. BUS-01)"
          placeholderTextColor="#999"
          value={formData.busId}
          onChangeText={(val) => setFormData({...formData, busId: val})}
        />
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>Create Account</ThemedText>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <ThemedText style={styles.linkText}>Already have an account? Login</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { textAlign: "center", marginBottom: 40 },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd", padding: 15, borderRadius: 8, marginBottom: 20, fontSize: 16, color: "#000" },
  button: { backgroundColor: "#3498db", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  linkText: { textAlign: "center", marginTop: 20, color: "#3498db" }
});
