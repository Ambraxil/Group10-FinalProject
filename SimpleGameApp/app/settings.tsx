import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

export default function SettingsScreen() {
  const router = useRouter();
  const [multiplayer, setMultiplayer] = useState(false);

  useEffect(() => {
    const loadSetting = async () => {
      const savedValue = await AsyncStorage.getItem('@multiplayer_mode');

      if (savedValue !== null) {
        setMultiplayer(JSON.parse(savedValue));
      }
    };

    loadSetting();
  }, []);

  const toggleMultiplayer = async (value: boolean) => {
    setMultiplayer(value);
    await AsyncStorage.setItem('@multiplayer_mode', JSON.stringify(value));
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.settingCard}>
          <Text style={styles.label}>Multiplayer Mode</Text>

          <Switch
            value={multiplayer}
            onValueChange={toggleMultiplayer}
            trackColor={{ false: '#d1d1d1', true: '#81b0ff' }}
          />
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cbd4fc',
  },

  inner: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
  },

  settingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 25,
  },

  label: {
    color: '#0e0e1a',
    fontSize: 18,
    fontWeight: '500',
  },

  logoutButton: {
    marginTop: 30,
    backgroundColor: '#fff',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowOpacity: 0.1,
    elevation: 3,
  },

  logoutText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0e0e1a',
  },

  backButton: {
    position: 'absolute',
    bottom: 50,
    left: 24,
    backgroundColor: '#e0e4f5',
    borderRadius: 40,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backArrow: {
    fontSize: 28,
    color: '#0e0e1a',
  },
});