import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function QuizScreen() {
  const router = useRouter();
  const [score, setScore] = useState(0);

  const answers = ["Java", "Python", "JavaScript", "C++"];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        {/* Quiz Header Card */}
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Quiz Game</Text>
        </View>

        <Text style={styles.progressText}>Question 1 of 5</Text>

        {/* Question Card */}
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>Which language is used for React Native?</Text>
        </View>

        {/* Answer Grid */}
        <View style={styles.answerGrid}>
          {answers.map((item) => (
            <TouchableOpacity key={item} style={styles.answerButton}>
              <Text style={styles.answerText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.scoreText}>Score: {score} / 5</Text>
          <TouchableOpacity style={styles.nextButton}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
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
  inner: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 40 },
  headerCard: { backgroundColor: '#fff', width: '100%', padding: 15, borderRadius: 15, alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: '600' },
  progressText: { fontSize: 20, marginBottom: 20 },
  questionCard: { backgroundColor: '#fff', width: '100%', padding: 30, borderRadius: 25, marginBottom: 40 },
  questionText: { fontSize: 22, textAlign: 'center', lineHeight: 30 },
  answerGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 20, marginBottom: 40 },
  answerButton: { backgroundColor: '#fff', width: '45%', paddingVertical: 25, borderRadius: 40, alignItems: 'center', shadowOpacity: 0.05, elevation: 2 },
  answerText: { fontSize: 16, fontWeight: '500' },
  footer: { width: '100%', alignItems: 'center', gap: 20 },
  scoreText: { fontSize: 14, color: '#444' },
  nextButton: { backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, shadowOpacity: 0.1, elevation: 3 },
  nextText: { fontSize: 18, fontWeight: '600' },
  backButton: { position: 'absolute', bottom: 50, left: 24, backgroundColor: '#e0e4f5', borderRadius: 40, width: 60, height: 60, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 28, color: '#0e0e1a' },
});