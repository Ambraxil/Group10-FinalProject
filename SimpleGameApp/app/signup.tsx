import React, { useState } from "react";
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";

export default function SignupScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signup = async () => {
    if (!email || !password) {
      Alert.alert("Missing info", "Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        Alert.alert("Signup error", error.message);
        return;
      }

      Alert.alert(
        "Success",
        "Account created successfully. Please login now."
      );

      router.replace("/login");
    } catch (err) {
      Alert.alert("Error", "Something went wrong during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.titleCard}>
          <Text style={styles.titleText}>Create Account</Text>
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
            onPress={signup}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.mainButtonText}>
              {loading ? "Please wait..." : "Create Account"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.replace("/login")}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Back to Login</Text>
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
  titleCard: {
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingVertical: 26,
    width: "85%",
    alignItems: "center",
    shadowOpacity: 0.1,
    elevation: 5,
  },
  titleText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#0e0e1a",
  },
  formCard: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 25,
    padding: 24,
    shadowOpacity: 0.1,
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