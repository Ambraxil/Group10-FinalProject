import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// --- Global Types & Constants ---
type SquareValue = 'O' | 'X' | null;

const WINNING_LINES: number[][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],             // diagonals
];

// --- Core Game Logic ---

function checkWinner(squares: SquareValue[]) {
  for (const [a, b, c] of WINNING_LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function getAIMove(squares: SquareValue[]): number | null {
  const free = squares
    .map((val, idx) => (val === null ? idx : null))
    .filter((v): v is number => v !== null); // type predicate to remove nulls
  if (free.length === 0) return null;
  // Basic random AI move
  return free[Math.floor(Math.random() * free.length)];
}

// --- Main Component ---

export default function TicTacToeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // Get dynamic safe area padding

  // --- Game State ---
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true); // Player = O, AI = X
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>('Your Turn');
  const [aiThinking, setAiThinking] = useState<boolean>(false);
  const [scoreboard, setScoreboard] = useState({ o: 0, x: 0 });

  // Use this to prevent score updates multiple times per game
  const [didUpdateScore, setDidUpdateScore] = useState<boolean>(false);

  // --- AI Logic (Effect Hook) ---
  useEffect(() => {
    if (!isPlayerTurn && !gameOver) {
      setAiThinking(true);
      setStatusMsg('AI thinking…');

      const timer = setTimeout(() => {
        setSquares((prev) => {
          const next = [...prev];
          const move = getAIMove(next);
          if (move !== null) next[move] = 'X';
          return next;
        });
        setAiThinking(false);
        setIsPlayerTurn(true);
      }, 750); // Small natural delay

      return () => clearTimeout(timer); // cleanup
    }
  }, [isPlayerTurn, gameOver]);

  // --- Win/Draw Logic (Effect Hook) ---
  useEffect(() => {
    if (gameOver || didUpdateScore) return; // Wait until next game

    const result = checkWinner(squares);
    const isDraw = !result && squares.every(Boolean);

    if (result) {
      setGameOver(true);
      setDidUpdateScore(true); // lock scoring for this game

      if (result.winner === 'O') {
        setStatusMsg('You Win! 🎉');
        setScoreboard((prev) => ({ ...prev, o: prev.o + 1 }));
      } else {
        setStatusMsg('AI Wins!');
        setScoreboard((prev) => ({ ...prev, x: prev.x + 1 }));
      }
    } else if (isDraw) {
      setGameOver(true);
      setStatusMsg("It's a draw!");
      setDidUpdateScore(true);
    } else if (isPlayerTurn && !gameOver) {
      setStatusMsg('Your Turn');
    }
  }, [squares, isPlayerTurn, gameOver, didUpdateScore]);

  // --- Callback Handlers ---

  const handlePress = useCallback(
    (index: number) => {
      // Prevent moves if not your turn, game over, square occupied, or AI is moving
      if (!isPlayerTurn || squares[index] || gameOver || aiThinking) return;

      const next = [...squares];
      next[index] = 'O';
      setSquares(next);
      setIsPlayerTurn(false);
    },
    [isPlayerTurn, squares, gameOver, aiThinking]
  );

  const resetBoard = () => {
    setSquares(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameOver(false);
    setStatusMsg('Your Turn');
    setAiThinking(false);
    setDidUpdateScore(false); // unlock scoring for next game
  };

  const handleBack = () => {
    // Reset core game state upon exiting tictactoe
    resetBoard();
    router.back();
  };

  // --- Render Helpers ---

  // Helper function to render a single cell
  const renderCell = (index: number) => (
    <TouchableOpacity
      key={index}
      style={[styles.cell, getCellBorderStyle(index)]}
      onPress={() => handlePress(index)}
      disabled={!!squares[index] || aiThinking} // Disable occupied or during AI turn
    >
      <Text style={[styles.cellText, squares[index] === 'O' ? styles.oText : styles.xText]}>
        {squares[index] === 'O' ? '○' : squares[index] === 'X' ? '✕' : ''}
      </Text>
    </TouchableOpacity>
  );

  const getCellBorderStyle = (index: number) => {
    const borders = [];
    if (index % 3 !== 2) borders.push(styles.cellBorderRight); // add right border for col 0 and 1
    if (index < 6) borders.push(styles.cellBorderBottom);     // add bottom border for row 0 and 1
    return borders;
  };

  // --- Main Render ---

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.headerContainer}>
          <Text style={styles.status}>{statusMsg}</Text>
          {aiThinking && <ActivityIndicator size="small" color="#666" style={{ marginTop: 8 }} />}
        </View>

        <View style={styles.boardCard}>
          <View style={styles.board}>
            {Array.from({ length: 9 }).map((_, i) => renderCell(i))}
          </View>
        </View>

        <View style={styles.scoreboardRow}>
          {/* O (You) */}
          <View style={styles.scoreItem}>
            <Text style={[styles.scoreIconLarge, styles.oText]}>○</Text>
            <Text style={styles.scoreValue}>{scoreboard.o}</Text>
          </View>

          <Text style={styles.scoreSeparator}>-</Text>

          {/* X (AI) */}
          <View style={styles.scoreItem}>
            <Text style={[styles.scoreIconLarge, styles.xText]}>✕</Text>
            <Text style={styles.scoreValue}>{scoreboard.x}</Text>
          </View>
        </View>

        {gameOver && (
          <TouchableOpacity style={styles.playAgainBtn} onPress={resetBoard} activeOpacity={0.8}>
            <Text style={styles.playAgainText}>Play Again?</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[styles.backButton, { bottom: insets.bottom + 16 }]}
        onPress={handleBack}
        activeOpacity={0.8}
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
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  // --- Header ---
  headerContainer: {
    alignItems: 'center',
    height: 70,
  },
  status: {
    fontSize: 22,
    color: '#0e0e1a',
    fontWeight: '600',
    textAlign: 'center',
  },

  // --- Board Card ---
  boardCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    // Add depth shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  board: {
    width: 270,
    height: 270,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  cell: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  cellBorderRight: {
    borderRightWidth: 2,
    borderRightColor: '#0e0e1a',
  },
  cellBorderBottom: {
    borderBottomWidth: 2,
    borderBottomColor: '#0e0e1a',
  },
  cellText: {
    fontSize: 50,
  },
  oText: {
    color: '#e05c5c',
  },
  xText: {
    color: '#5b8ff9',
  },

  // --- Scoreboard Row ---
  scoreboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32, // wide separation
    minHeight: 100, // reserve height so layout doesn't jump
  },
  scoreItem: {
    alignItems: 'center',
    gap: 8,
  },
  scoreIconLarge: {
    fontSize: 48, // Very large icons
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0e0e1a',
  },
  scoreSeparator: {
    fontSize: 28,
    color: '#666',
    fontWeight: '300',
  },

  // --- Play Again Button ---
  playAgainBtn: {
    backgroundColor: '#0e0e1a', // black text
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 36,
    shadowColor: '#0e0e1a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  playAgainText: {
    color: '#cbd4fc', // background color
    fontWeight: '700',
    fontSize: 16,
  },

  // --- Dynamic Back Button ---
  // Style matching the grey circular arrow back buttons in images
  backButton: {
    position: 'absolute',
    left: 24,
    backgroundColor: '#e0e4f5', // light grey circle
    borderRadius: 40,
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  backArrow: {
    fontSize: 22,
    color: '#0e0e1a', // black arrow
    fontWeight: '500',
  },
});