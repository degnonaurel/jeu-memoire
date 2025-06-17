import React, { useEffect, useState } from 'react';
import './App.css';

const cardsSobre = ['🔵', '🔺', '⬛️', '🔶'];
const cardsColore = ['🐶', '🚀', '🎮', '🌟'];

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function App() {
  const [styleMode, setStyleMode] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [disableClick, setDisableClick] = useState(false);
  const [difficulty, setDifficulty] = useState(2);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showFireworks, setShowFireworks] = useState(false);

  const isGameComplete = matched.length === cards.length && cards.length > 0;

  useEffect(() => {
    let timer;
    if (startTime && !isGameComplete) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [startTime, isGameComplete]);

  useEffect(() => {
    if (flipped.length === 2) {
      setDisableClick(true);
      const [firstIdx, secondIdx] = flipped;
      if (cards[firstIdx] === cards[secondIdx]) {
        setMatched((m) => [...m, firstIdx, secondIdx]);
      }
      setTimeout(() => {
        setFlipped([]);
        setDisableClick(false);
      }, 800);
      setMoves((prev) => prev + 1);
    }
  }, [flipped, cards]);

  useEffect(() => {
    if (isGameComplete) {
      setShowFireworks(true);
      setTimeout(() => setShowFireworks(false), 3000);
    }
  }, [isGameComplete]);

  const generateCards = (mode, pairs) => {
    const base = mode === "sobre" ? cardsSobre : cardsColore;
    const selection = base.slice(0, pairs);
    const deck = shuffle([...selection, ...selection]);
    return deck;
  };

  const handleModeSelect = (mode) => {
    setStyleMode(mode);
    setGameStarted(true);
    const deck = generateCards(mode, difficulty);
    setCards(deck);
    setMatched([]);
    setFlipped([]);
    setMoves(0);
    setElapsedTime(0);
    setStartTime(Date.now());
  };

  const handleCardClick = (index) => {
    if (disableClick || flipped.includes(index) || matched.includes(index)) return;
    if (flipped.length < 2) {
      setFlipped([...flipped, index]);
    }
  };

  const handleReturnToMenu = () => {
    setGameStarted(false);
    setStyleMode(null);
    setMoves(0);
    setElapsedTime(0);
    setStartTime(null);
    setShowFireworks(false);
  };

  if (!gameStarted) {
    return (
      <div className="menu">
        <h1>Jeu de Mémoire</h1>
        <p>Choisis un style :</p>
        <div className="mode-buttons">
          <button onClick={() => handleModeSelect("sobre")}>Mode Sobre</button>
          <button onClick={() => handleModeSelect("colore")}>Mode Coloré</button>
        </div>
        <p>Choisis le niveau de difficulté :</p>
        <select onChange={(e) => setDifficulty(Number(e.target.value))} defaultValue={2}>
          <option value={2}>Facile (2 paires)</option>
          <option value={3}>Moyen (3 paires)</option>
          <option value={4}>Difficile (4 paires)</option>
        </select>
      </div>
    );
  }

  return (
    <div className={`game ${styleMode}`}>
      <h2>{styleMode === "sobre" ? "Memory Challenge" : "Memory Blast!"}</h2>
      <button className="back-button" onClick={handleReturnToMenu}>⬅ Retour au menu</button>
      <div className="grid">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`card ${flipped.includes(index) || matched.includes(index) ? 'flipped' : ''}`}
            onClick={() => handleCardClick(index)}
            style={{
              animation: matched.includes(index) ? 'pop 0.4s ease-in-out' : 'none'
            }}
          >
            {flipped.includes(index) || matched.includes(index) ? card : '❓'}
          </div>
        ))}
      </div>
      <p className="feedback">
        {isGameComplete
          ? styleMode === "sobre"
            ? "🎉 Bravo, vous avez tout trouvé !"
            : "🔥 You Rock! Score parfait!"
          : styleMode === "sobre"
          ? `${matched.length / 2} paires trouvées`
          : `💫 ${matched.length / 2} Paires !`}
      </p>
      <p className="stats">
        🕒 Temps : {elapsedTime}s | 🎯 Coups : {moves}
      </p>
      {isGameComplete && (
        <>
          <button className="replay-button" onClick={() => handleModeSelect(styleMode)}>Rejouer</button>
          {showFireworks && <div className="fireworks">🎆🎇✨</div>}
        </>
      )}
    </div>
  );
}

export default App;
