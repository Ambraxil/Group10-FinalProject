import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  const [multiplayer, setMultiplayer] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.settingCard}>
          <Text style={styles.label}>Multiplayer Mode</Text>
          <Switch 
            value={multiplayer} 
            onValueChange={setMultiplayer}
            trackColor={{ false: '#d1d1d1', true: '#81b0ff' }}
            thumbColor={multiplayer ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#cbd4fc' },
  inner: { flex: 1, padding: 24, paddingTop: 80 },
  settingCard: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 25, 
    borderRadius: 25,
    shadowOpacity: 0.05,
    elevation: 2
  },
  label: { color: '#0e0e1a', fontSize: 18, fontWeight: '500' },
  backButton: { 
    position: 'absolute', 
    bottom: 50, 
    left: 24, 
    backgroundColor: '#e0e4f5', 
    borderRadius: 40, 
    width: 60, 
    height: 60, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  backArrow: { fontSize: 28, color: '#0e0e1a' },
});