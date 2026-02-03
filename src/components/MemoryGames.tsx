import { useState, useEffect } from 'react';

// Card matching game
export function CardMatchingGame() {
  const [cards, setCards] = useState<Array<{ id: number; value: string; flipped: boolean; matched: boolean }>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Simple dementia-friendly icons
  const cardValues = ['🐶', '🐱', '🐰', '🐦', '🌸', '🌞', '🍎', '🍪'];
  const gameCards = [...cardValues, ...cardValues];

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const shuffledCards = gameCards
      .map((value, index) => ({ id: index, value, flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5);
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setGameCompleted(false);
  };

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || cards[index].flipped || cards[index].matched) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const [firstIndex, secondIndex] = newFlippedCards;
      
      if (cards[firstIndex].value === cards[secondIndex].value) {
        // Match found
        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[firstIndex].matched = true;
          updatedCards[secondIndex].matched = true;
          setCards(updatedCards);
          setFlippedCards([]);
          
          // Check if game is complete
          if (updatedCards.every(card => card.matched)) {
            setGameCompleted(true);
          }
        }, 500);
      } else {
        // No match, flip back
        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[firstIndex].flipped = false;
          updatedCards[secondIndex].flipped = false;
          setCards(updatedCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Memory Card Game</h2>
      <p className="mb-4 text-gray-600">Match pairs of cards to exercise your memory!</p>
      
      <div className="mb-6 flex justify-between items-center">
        <div className="text-lg">
          <span className="font-bold">Moves:</span> {moves}
        </div>
        <button
          onClick={resetGame}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          New Game
        </button>
      </div>

      {gameCompleted && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
          <p className="font-bold text-xl">🎉 Congratulations! 🎉</p>
          <p>You completed the game in {moves} moves!</p>
        </div>
      )}

      <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
        {cards.map((card, index) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(index)}
            className={`
              aspect-square flex items-center justify-center text-4xl rounded-lg
              transition-all duration-300 transform
              ${card.flipped || card.matched ? 'bg-blue-100 scale-105' : 'bg-gray-200'}
              ${card.matched ? 'border-4 border-green-500' : ''}
              hover:bg-blue-50
              disabled:opacity-50
            `}
            disabled={card.matched}
          >
            {card.flipped || card.matched ? card.value : '?'}
          </button>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded">
        <h3 className="font-bold mb-2">Game Benefits:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Improves short-term memory</li>
          <li>Enhances concentration</li>
          <li>Stimulates visual recognition</li>
          <li>Provides cognitive exercise</li>
        </ul>
      </div>
    </div>
  );
}

// Simple Quiz Game
export function SimpleQuizGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      question: "What color is the sky on a clear day?",
      options: ["Blue", "Green", "Red", "Yellow"],
      answer: "Blue"
    },
    {
      question: "How many legs does a cat have?",
      options: ["Two", "Four", "Six", "Eight"],
      answer: "Four"
    },
    {
      question: "What do we use to see?",
      options: ["Ears", "Eyes", "Nose", "Mouth"],
      answer: "Eyes"
    },
    {
      question: "What falls from the sky when it rains?",
      options: ["Snow", "Leaves", "Raindrops", "Stones"],
      answer: "Raindrops"
    }
  ];

  const handleAnswer = (selectedAnswer: string) => {
    if (selectedAnswer === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Simple Quiz Game</h2>
      
      {!showResult ? (
        <div>
          <div className="mb-4">
            <p className="text-sm text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
            <h3 className="text-xl font-bold mt-2">{questions[currentQuestion].question}</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-lg"
              >
                {option}
              </button>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-lg">Score: {score}</p>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Quiz Complete! 🎉</h3>
          <p className="text-xl mb-2">Your score: {score} out of {questions.length}</p>
          <p className="mb-6">
            {score === questions.length ? "Perfect! Excellent memory!" :
             score >= questions.length / 2 ? "Good job! Keep practicing!" :
             "Keep playing to improve!"}
          </p>
          <button
            onClick={resetQuiz}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 text-lg"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}