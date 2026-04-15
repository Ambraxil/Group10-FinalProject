import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

type Question = {
  question: string;
  answers: string[];
  correctAnswer: string;
};

const originalQuestions: Question[] = [
  {
    question: 'Which country has the most time zones?',
    answers: ['Russia', 'USA', 'France', 'China'],
    correctAnswer: 'France',
  },
  {
    question: 'Who is known as the father of the World Wide Web?',
    answers: ['Bill Gates', 'Tim Berners-Lee', 'Steve Jobs', 'Alan Turing'],
    correctAnswer: 'Tim Berners-Lee',
  },
  {
    question: 'Which ancient civilization built Machu Picchu?',
    answers: ['Maya', 'Aztec', 'Inca', 'Olmec'],
    correctAnswer: 'Inca',
  },
  {
    question: 'What planet rotates on its side compared to others?',
    answers: ['Venus', 'Neptune', 'Uranus', 'Mercury'],
    correctAnswer: 'Uranus',
  },
  {
    question: 'Which river flows through Paris?',
    answers: ['Thames', 'Rhine', 'Seine', 'Danube'],
    correctAnswer: 'Seine',
  },
  {
    question: 'Which company created the Android operating system?',
    answers: ['Apple', 'Google', 'Microsoft', 'Samsung'],
    correctAnswer: 'Google',
  },
  {
    question: 'The Great Wall of China was mainly built to protect against which group?',
    answers: ['Mongols', 'Romans', 'Persians', 'Vikings'],
    correctAnswer: 'Mongols',
  },
  {
    question: 'What gas makes up the largest portion of Earth’s atmosphere?',
    answers: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],
    correctAnswer: 'Nitrogen',
  },
  {
    question: 'Mount Kilimanjaro is located in:',
    answers: ['Kenya', 'Ethiopia', 'Tanzania', 'Uganda'],
    correctAnswer: 'Tanzania',
  },
  {
    question: 'Which programming language is commonly known for data science and AI beginners?',
    answers: ['C', 'Python', 'Java', 'Swift'],
    correctAnswer: 'Python',
  },
  {
    question: 'Who was the first President of the United States?',
    answers: ['Abraham Lincoln', 'John Adams', 'Thomas Jefferson', 'George Washington'],
    correctAnswer: 'George Washington',
  },
  {
    question: 'What is the chemical symbol for gold?',
    answers: ['Go', 'Gd', 'Au', 'Ag'],
    correctAnswer: 'Au',
  },
  {
    question: 'Which ocean is the largest on Earth?',
    answers: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
    correctAnswer: 'Pacific Ocean',
  },
  {
    question: 'Which company developed the first iPhone?',
    answers: ['Nokia', 'Apple', 'Motorola', 'Sony'],
    correctAnswer: 'Apple',
  },
  {
    question: 'Which empire was ruled by Julius Caesar?',
    answers: ['Greek Empire', 'Roman Empire', 'Persian Empire', 'Ottoman Empire'],
    correctAnswer: 'Roman Empire',
  },
  {
    question: 'What is the closest star to Earth after the Sun?',
    answers: ['Sirius', 'Alpha Centauri', 'Betelgeuse', 'Polaris'],
    correctAnswer: 'Alpha Centauri',
  },
  {
    question: 'Which country has the capital city Canberra?',
    answers: ['New Zealand', 'Australia', 'Canada', 'Ireland'],
    correctAnswer: 'Australia',
  },
  {
    question: 'What does HTTP stand for?',
    answers: ['HyperText Transfer Protocol', 'HighText Transfer Program', 'Hyper Transfer Text Process', 'High Transfer Text Protocol'],
    correctAnswer: 'HyperText Transfer Protocol',
  },
  {
    question: 'Who led the first successful voyage around the world expedition?',
    answers: ['Christopher Columbus', 'Vasco da Gama', 'Ferdinand Magellan', 'James Cook'],
    correctAnswer: 'Ferdinand Magellan',
  },
  {
    question: 'What part of the cell contains genetic material (DNA)?',
    answers: ['Cytoplasm', 'Ribosome', 'Nucleus', 'Membrane'],
    correctAnswer: 'Nucleus',
  },
];

const shuffleArray = (array: Question[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function QuizScreen() {
  const router = useRouter();

  const [quizQuestions, setQuizQuestions] = useState<Question[]>(
    shuffleArray(originalQuestions)
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleAnswerPress = (answer: string) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextPress = () => {
    if (!selectedAnswer) {
      Alert.alert('Select an answer', 'Please choose an answer before pressing Next.');
      return;
    }

    const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

    if (isLastQuestion) {
      setQuizFinished(true);
      return;
    }

    setCurrentQuestionIndex((prev) => prev + 1);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleRestart = () => {
    setQuizQuestions(shuffleArray(originalQuestions));
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setQuizFinished(false);
    setShowResult(false);
  };

  let motivationMessage = '';

  if (score >= 18) {
    motivationMessage = 'Amazing job! You are a quiz master! 🧠✨';
  } else if (score >= 15) {
    motivationMessage = 'Great work! Keep pushing yourself! 👏';
  } else if (score >= 10) {
    motivationMessage = 'Nice effort! You are doing well! 🔥';
  } else {
    motivationMessage = 'Good try! YOU NEED TO PRACTICE MORE 😂 ';
  }

  if (quizFinished) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.inner}>
          <View style={styles.headerCard}>
            <Text style={styles.headerTitle}>Quiz Result</Text>
          </View>

          <View style={styles.questionCard}>
            <Text style={styles.questionText}>You finished the quiz</Text>
            <Text style={styles.resultText}>Score: {score} / {quizQuestions.length}</Text>
            <Text style={styles.motivationText}>{motivationMessage}</Text>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.nextButton} onPress={handleRestart} activeOpacity={0.8}>
              <Text style={styles.nextText}>Restart</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.nextButton} onPress={() => router.back()} activeOpacity={0.8}>
              <Text style={styles.nextText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Quiz Game</Text>
        </View>

        <Text style={styles.progressText}>
          Question {currentQuestionIndex + 1} of {quizQuestions.length}
        </Text>

        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>

        <View style={styles.answerGrid}>
          {currentQuestion.answers.map((item) => {
            const isSelected = selectedAnswer === item;
            const isCorrect = item === currentQuestion.correctAnswer;
            const isWrongSelected =
              showResult && isSelected && item !== currentQuestion.correctAnswer;
            const isCorrectAnswer = showResult && isCorrect;

            return (
              <TouchableOpacity
                key={item}
                style={[
                  styles.answerButton,
                  isSelected && !showResult && styles.selectedAnswerButton,
                  isWrongSelected && styles.wrongAnswerButton,
                  isCorrectAnswer && styles.correctAnswerButton,
                ]}
                onPress={() => handleAnswerPress(item)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.answerText,
                    isSelected && !showResult && styles.selectedAnswerText,
                    isWrongSelected && styles.wrongAnswerText,
                    isCorrectAnswer && styles.correctAnswerText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text style={styles.scoreText}>Score: {score} / {quizQuestions.length}</Text>

          <TouchableOpacity style={styles.nextButton} onPress={handleNextPress} activeOpacity={0.8}>
            <Text style={styles.nextText}>
              {currentQuestionIndex === quizQuestions.length - 1 ? 'Finish' : 'Next'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nextButton} onPress={() => router.back()} activeOpacity={0.8}>
            <Text style={styles.nextText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 30,
  },
  headerCard: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
  },
  progressText: {
    fontSize: 20,
    marginBottom: 20,
  },
  questionCard: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 30,
    borderRadius: 25,
    marginBottom: 40,
    alignItems: 'center',
  },
  questionText: {
    fontSize: 22,
    textAlign: 'center',
    lineHeight: 30,
  },
  resultText: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 20,
    color: '#0e0e1a',
  },
  motivationText: {
    fontSize: 20,
    fontWeight: '500',
    marginTop: 16,
    textAlign: 'center',
    color: '#3b4371',
    lineHeight: 28,
  },
  answerGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  answerButton: {
    backgroundColor: '#fff',
    width: '47%',
    minHeight: 72,
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  selectedAnswerButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#6f7fe8',
  },
  correctAnswerButton: {
    backgroundColor: '#b9f6ca',
    borderWidth: 2,
    borderColor: '#2e7d32',
  },
  wrongAnswerButton: {
    backgroundColor: '#ffcdd2',
    borderWidth: 2,
    borderColor: '#c62828',
  },
  answerText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#0e0e1a',
  },
  selectedAnswerText: {
    fontWeight: '700',
    color: '#0e0e1a',
  },
  correctAnswerText: {
    fontWeight: '700',
    color: '#1b5e20',
  },
  wrongAnswerText: {
    fontWeight: '700',
    color: '#b71c1c',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowOpacity: 0.1,
    elevation: 3,
    minWidth: 160,
    alignItems: 'center',
    marginBottom: 14,
  },
  nextText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0e0e1a',
  },
});