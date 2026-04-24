import { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import './App.css';

const CHOICES = [
  { id: 'rock', icon: '🪨', label: 'Rock' },
  { id: 'paper', icon: '📄', label: 'Paper' },
  { id: 'scissors', icon: '✂️', label: 'Scissors' },
];

function App() {
  const [userScore, setUserScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [result, setResult] = useState(null); // { outcome, userChoice, computerChoice }
  const [isAnimating, setIsAnimating] = useState(false);

  // Load scores from localStorage on mount
  useEffect(() => {
    const savedUserScore = localStorage.getItem('userScore');
    const savedComputerScore = localStorage.getItem('computerScore');
    if (savedUserScore) setUserScore(parseInt(savedUserScore, 10));
    if (savedComputerScore) setComputerScore(parseInt(savedComputerScore, 10));
  }, []);

  // Save scores to localStorage when they change
  useEffect(() => {
    localStorage.setItem('userScore', userScore.toString());
    localStorage.setItem('computerScore', computerScore.toString());
  }, [userScore, computerScore]);

  const playGame = (userChoiceId) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    const computerChoiceObj = CHOICES[Math.floor(Math.random() * CHOICES.length)];
    const computerChoiceId = computerChoiceObj.id;
    
    let outcome = '';
    let status = '';

    if (userChoiceId === computerChoiceId) {
      outcome = "It's a draw!";
      status = 'draw';
    } else if (
      (userChoiceId === 'rock' && computerChoiceId === 'scissors') ||
      (userChoiceId === 'paper' && computerChoiceId === 'rock') ||
      (userChoiceId === 'scissors' && computerChoiceId === 'paper')
    ) {
      outcome = 'You win!';
      status = 'win';
      setUserScore((prev) => prev + 1);
    } else {
      outcome = 'Computer wins!';
      status = 'lose';
      setComputerScore((prev) => prev + 1);
    }

    setResult({
      outcome,
      status,
      userChoice: CHOICES.find(c => c.id === userChoiceId),
      computerChoice: computerChoiceObj
    });
    
    // Slight delay to prevent spam clicking and allow animation to finish
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const resetGame = () => {
    setUserScore(0);
    setComputerScore(0);
    setResult(null);
  };

  return (
    <div className="app-container">
      <header>
        <h1 className="text-gradient">Rock Paper Scissors</h1>
        <p>First to endless glory wins!</p>
      </header>

      <div className="score-board glass-panel">
        <div className="score-card">
          <span className="score-label">You</span>
          <span className="score-value">{userScore}</span>
        </div>
        <div className="score-divider"></div>
        <div className="score-card">
          <span className="score-label">Computer</span>
          <span className="score-value">{computerScore}</span>
        </div>
      </div>

      <div className="game-area">
        <div className="choices-container">
          {CHOICES.map((choice) => (
            <button
              key={choice.id}
              className="choice-btn"
              onClick={() => playGame(choice.id)}
              disabled={isAnimating}
              aria-label={`Choose ${choice.label}`}
            >
              <span className="choice-icon">{choice.icon}</span>
              <span className="choice-label">{choice.label}</span>
            </button>
          ))}
        </div>

        <div className="result-display">
          {result ? (
            <>
              <h2 className={`result-text ${result.status}`} key={Date.now()}>
                {result.outcome}
              </h2>
              <div className="moves-display">
                <div className="move-item">
                  <span className="move-icon">{result.userChoice.icon}</span>
                  <span>You</span>
                </div>
                <span className="vs-text">VS</span>
                <div className="move-item">
                  <span className="move-icon">{result.computerChoice.icon}</span>
                  <span>CPU</span>
                </div>
              </div>
            </>
          ) : (
            <h2 className="result-text" style={{ color: 'var(--text-secondary)' }}>
              Make your move!
            </h2>
          )}
        </div>
      </div>

      <div className="controls">
        <button className="reset-btn" onClick={resetGame}>
          <RotateCcw size={18} />
          Reset Score
        </button>
      </div>
    </div>
  );
}

export default App;
