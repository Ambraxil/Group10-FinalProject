import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SquareValue = 'O' | 'X' | null;

export default function TicTacToeScreen() {
  const router = useRouter();
  
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [statusMsg, setStatusMsg] = useState('Loading...');
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [scoreboard, setScoreboard] = useState({ o: 0, x: 0 });

  useEffect(() => {
    const checkMode = async () => {
      const savedValue = await AsyncStorage.getItem('@multiplayer_mode');
      const multi = savedValue !== null ? JSON.parse(savedValue) : false;
      setIsMultiplayer(multi);
      setStatusMsg(multi ? "Player 1 (○) Turn" : "Your Turn");
    };
    checkMode();
  }, []);

  // 2. AI Logic (Only runs if NOT multiplayer)
  useEffect(() => {
    if (!isMultiplayer && !isPlayerTurn && !gameOver) {
      const timer = setTimeout(() => {
        setSquares(prev => {
          const next = [...prev];
          const free = next.map((v, i) => v === null ? i : null).filter((v): v is number => v !== null);
          if (free.length > 0) {
            const move = free[Math.floor(Math.random() * free.length)];
            next[move] = 'X';
          }
          return next;
        });
        setIsPlayerTurn(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, gameOver, isMultiplayer]);

  // 3. Status Message Update
  useEffect(() => {
    if (!gameOver) {
      if (isMultiplayer) {
        setStatusMsg(isPlayerTurn ? "Player 1 (○) Turn" : "Player 2 (✕) Turn");
      } else {
        setStatusMsg(isPlayerTurn ? "Your Turn" : "AI Thinking...");
      }
    }
  }, [isPlayerTurn, isMultiplayer, gameOver]);

  // Handle Win/Scoreboar
  useEffect(() => {
    const WIN_LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (const [a, b, c] of WIN_LINES) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        setGameOver(true);
        const winner = squares[a];
        setStatusMsg(winner === 'O' ? "Player 1 Wins!" : "Player 2 Wins!");
        setScoreboard(prev => winner === 'O' ? {...prev, o: prev.o + 1} : {...prev, x: prev.x + 1});
        return;
      }
    }
    if (squares.every(s => s !== null)) {
      setGameOver(true);
      setStatusMsg("Draw!");
    }
  }, [squares]);

  const handlePress = (index: number) => {
    if (squares[index] || gameOver || (!isMultiplayer && !isPlayerTurn)) return;
    const next = [...squares];
    next[index] = isPlayerTurn ? 'O' : 'X';
    setSquares(next);
    setIsPlayerTurn(!isPlayerTurn);
  };

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameOver(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.status}>{statusMsg}</Text>
        
        <View style={styles.boardCard}>
          <View style={styles.board}>
            {squares.map((val, i) => (
              <TouchableOpacity key={i} style={[styles.cell, i%3!==2 && styles.bR, i<6 && styles.bB]} onPress={() => handlePress(i)}>
                <Text style={[styles.cellText, val==='O'?styles.oT:styles.xT]}>
                  {val==='O'?'○':val==='X'?'✕':''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.scoreboardRow}>
          <View style={styles.scoreItem}>
            <Text style={[styles.scoreIconLarge, styles.oT]}>○</Text>
            <Text style={styles.scoreValue}>{scoreboard.o}</Text>
          </View>
          <Text style={styles.scoreSeparator}>-</Text>
          <View style={styles.scoreItem}>
            <Text style={[styles.scoreIconLarge, styles.xT]}>✕</Text>
            <Text style={styles.scoreValue}>{scoreboard.x}</Text>
          </View>
        </View>

        {gameOver && (
          <TouchableOpacity style={styles.playAgainBtn} onPress={resetGame}>
            <Text style={styles.playAgainText}>Play Again?</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#cbd4fc' },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'space-evenly', paddingHorizontal: 24, paddingVertical: 40 },
  status: { fontSize: 22, color: '#0e0e1a', fontWeight: '600' },
  boardCard: { backgroundColor: '#fff', borderRadius: 24, padding: 16, elevation: 8 },
  board: { width: 270, height: 270, flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: 90, height: 90, alignItems: 'center', justifyContent: 'center' },
  bR: { borderRightWidth: 2, borderRightColor: '#0e0e1a' },
  bB: { borderBottomWidth: 2, borderBottomColor: '#0e0e1a' },
  cellText: { fontSize: 50 },
  oT: { color: '#e05c5c' },
  xT: { color: '#5b8ff9' },
  scoreboardRow: { flexDirection: 'row', alignItems: 'center', gap: 32 },
  scoreItem: { alignItems: 'center' },
  scoreIconLarge: { fontSize: 48 },
  scoreValue: { fontSize: 28, fontWeight: '700' },
  scoreSeparator: { fontSize: 28, color: '#666' },
  playAgainBtn: { backgroundColor: '#0e0e1a', borderRadius: 30, paddingVertical: 12, paddingHorizontal: 36 },
  playAgainText: { color: '#cbd4fc', fontWeight: '700' },
  backButton: { position: 'absolute', bottom: 50, left: 24, backgroundColor: '#e0e4f5', borderRadius: 40, width: 60, height: 60, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 28, color: '#0e0e1a' },
});