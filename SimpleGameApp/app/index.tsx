import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        {/* Title Card */}
        <View style={styles.titleCard}>
          <Text style={styles.titleText}>Simple Game{'\n'}App</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.gameButton} 
            onPress={() => router.push('/tictactoe')}
            activeOpacity={0.7}
          >
            <Text style={styles.hashIcon}>#</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.gameButton} 
            onPress={() => router.push('/quiz')}
            activeOpacity={0.7}
          >
            <Text style={styles.gameButtonText}>Questions</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.settingsButton} 
          onPress={() => router.push('/settings')}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={32} color="#0e0e1a" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#cbd4fc' },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 60, paddingHorizontal: 24 },
  titleCard: { 
    backgroundColor: '#fff', 
    borderRadius: 30, 
    paddingVertical: 50, 
    width: '85%', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5
  },
  titleText: { fontSize: 32, fontWeight: '700', textAlign: 'center', color: '#0e0e1a', lineHeight: 40 },
  buttonRow: { flexDirection: 'row', gap: 25 },
  gameButton: { 
    backgroundColor: '#fff', 
    borderRadius: 60, 
    width: 130, 
    height: 130, 
    alignItems: 'center', 
    justifyContent: 'center', 
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 4 
  },
  hashIcon: { fontSize: 50, fontWeight: '300', color: '#0e0e1a' },
  gameButtonText: { fontSize: 16, fontWeight: '600', color: '#0e0e1a', textAlign: 'center' },
  settingsButton: { 
    backgroundColor: '#fff', 
    borderRadius: 50, 
    width: 70, 
    height: 70, 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowOpacity: 0.1,
    elevation: 4
  },
});