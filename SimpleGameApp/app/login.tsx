import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Text,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace("/");
      } else {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [router]);

  const login = async () => {
    if (!email || !password) {
      Alert.alert("Missing info", "Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert("Login error", error.message);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log("Logged in user:", user);

      router.replace("/");
    } catch (err) {
      Alert.alert("Error", "Something went wrong during login.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0e0e1a" />
          <Text style={styles.loadingText}>Checking session...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.titleCard}>
          <Text style={styles.titleText}>Login</Text>
        </View>

        <View style={styles.formCard}>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            placeholderTextColor="#777"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            placeholderTextColor="#777"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={login}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Text style={styles.mainButtonText}>
              {loading ? "Please wait..." : "Login"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/signup")}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>Create New Account</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 28,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "600",
    color: "#0e0e1a",
  },
  titleCard: {
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingVertical: 26,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  titleText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#0e0e1a",
    textAlign: "center",
  },
  formCard: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 25,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  input: {
    backgroundColor: "#f6f7ff",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#0e0e1a",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e4e7fb",
  },
  footer: {
    width: "100%",
    alignItems: "center",
  },
  mainButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    minWidth: 220,
    alignItems: "center",
    marginBottom: 14,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  mainButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0e0e1a",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    minWidth: 220,
    alignItems: "center",
    shadowOpacity: 0.1,
    elevation: 3,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0e0e1a",
  },
});