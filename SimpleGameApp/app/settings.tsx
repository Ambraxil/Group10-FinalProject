import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../components/AuthProvider";

export default function SettingsScreen() { 
  const router = useRouter();
  const { signOut } = useAuth();

  const [multiplayer, setMultiplayer] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const loadSetting = async () => {
      try {
        const savedValue = await AsyncStorage.getItem("@multiplayer_mode");

        if (savedValue !== null) {
          setMultiplayer(JSON.parse(savedValue));
        }
      } catch (error) {
        console.error("Failed to load multiplayer setting");
      }
    };

    loadSetting();
  }, []);

  const toggleMultiplayer = async (value: boolean) => {
    try {
      setMultiplayer(value);
      await AsyncStorage.setItem("@multiplayer_mode", JSON.stringify(value));
    } catch (error) {
      Alert.alert("Error", "Failed to save multiplayer setting.");
    }
  };

  const logout = async () => {
    try {
      setLoggingOut(true);

      const result = await signOut();

      if (result.error) {
        Alert.alert("Sign Out Error", result.error);
        return;
      }

      router.replace("/login");
    } catch (error) {
      Alert.alert("Error", "Something went wrong during sign out.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.settingCard}>
          <Text style={styles.label}>Multiplayer Mode</Text>

          <Switch
            value={multiplayer}
            onValueChange={toggleMultiplayer}
            trackColor={{ false: "#d1d1d1", true: "#81b0ff" }}
          />
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
          activeOpacity={0.8}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.logoutText}>Log Out</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        disabled={loggingOut}
      >
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#cbd4fc",
  },

  inner: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
  },

  settingCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 25,
  },

  label: {
    color: "#0e0e1a",
    fontSize: 18,
    fontWeight: "500",
  },

  logoutButton: {
    marginTop: 30,
    backgroundColor: "#fff",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    shadowOpacity: 0.1,
    elevation: 3,
  },

  logoutText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0e0e1a",
  },

  backButton: {
    position: "absolute",
    bottom: 50,
    left: 24,
    backgroundColor: "#e0e4f5",
    borderRadius: 40,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },

  backArrow: {
    fontSize: 28,
    color: "#0e0e1a",
  },
});