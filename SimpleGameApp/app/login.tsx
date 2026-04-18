import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";
import { supabase } from "../lib/supabase";

/*
ZOD VALIDATION SCHEMA
*/

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const login = async (data: FormData) => {
    setServerError("");

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email.trim(),
      password: data.password,
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        setServerError("Invalid email or password.");
      } else if (error.message.includes("network")) {
        setServerError("Network error. Check your connection.");
      } else {
        setServerError(error.message);
      }

      return;
    }

    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.titleCard}>
          <Text style={styles.titleText}>Login</Text>
        </View>

        <View style={styles.formCard}>
          {/* EMAIL FIELD */}

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Enter Email"
                placeholderTextColor="#777"
                autoCapitalize="none"
                keyboardType="email-address"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {errors.email && (
            <Text style={styles.errorText}>
              {errors.email.message}
            </Text>
          )}

          {/* PASSWORD FIELD */}

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Enter Password"
                placeholderTextColor="#777"
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {errors.password && (
            <Text style={styles.errorText}>
              {errors.password.message}
            </Text>
          )}

          {/* SERVER ERROR */}

          {serverError !== "" && (
            <Text style={styles.errorText}>
              {serverError}
            </Text>
          )}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={handleSubmit(login)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.mainButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/signup")}
            disabled={isSubmitting}
          >
            <Text style={styles.secondaryButtonText}>
              Create New Account
            </Text>
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
    elevation: 4,
  },
  input: {
    backgroundColor: "#f6f7ff",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#0e0e1a",
    marginBottom: 10,
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
    elevation: 3,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0e0e1a",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});