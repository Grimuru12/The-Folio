import { useState, useEffect, useRef } from 'react';

function Game() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('snakeHighScore')) || 0;
  });
  const [gameRunning, setGameRunning] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [startBtnText, setStartBtnText] = useState('Start Game');
  const [pauseBtnText, setPauseBtnText] = useState('Pause');
  const [difficulty, setDifficulty] = useState('normal');

  // Game state refs to avoid stale closures
  const gameStateRef = useRef({
    snake: null,
    food: { x: 15, y: 15 },
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    score: 0,
    gameSpeed: 120,
    gameRunning: false,
    gamePaused: false,
    gameOverFlag: false,
  });

  const GRID_SIZE = 20;
  const CANVAS_WIDTH = 500;
  const CANVAS_HEIGHT = 500;

  const getGameSpeed = (diff) => {
    switch (diff) {
      case 'easy':
        return 150;
      case 'normal':
        return 100;
      case 'hard':
        return 50;
      case 'asian':
        return 10;
      default:
        return 120;
    }
  };

  const getSnakeLength = (diff) => {
    switch (diff) {
      case 'easy':
        return [{ x: 10, y: 10 }];
      case 'normal':
        return [
          { x: 10, y: 10 },
          { x: 10, y: 10 },
          { x: 10, y: 10 },
        ];
      case 'hard':
        return [
          { x: 10, y: 10 },
          { x: 10, y: 10 },
          { x: 10, y: 10 },
          { x: 10, y: 10 },
          { x: 10, y: 10 },
        ];
      case 'asian':
        return [
          { x: 10, y: 10 },
          { x: 10, y: 10 },
          { x: 10, y: 10 },
          { x: 10, y: 10 },
          { x: 10, y: 10 },
          { x: 10, y: 10 },
          { x: 10, y: 10 },
        ];
      default:
        return [
          { x: 10, y: 10 },
          { x: 10, y: 10 },
          { x: 10, y: 10 },
        ];
    }
  };

  const generateFood = (snake) => {
    let food = {
      x: Math.floor(Math.random() * (CANVAS_WIDTH / GRID_SIZE)),
      y: Math.floor(Math.random() * (CANVAS_HEIGHT / GRID_SIZE)),
    };

    if (snake.some((segment) => segment.x === food.x && segment.y === food.y)) {
      return generateFood(snake);
    }
    return food;
  };

  const drawGame = (ctx, snake, food) => {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid
    ctx.strokeStyle = 'rgba(37, 99, 235, 0.1)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= CANVAS_WIDTH; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_HEIGHT);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_WIDTH, i);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      if (index === 0) {
        ctx.fillStyle = '#16a34a';
      } else {
        ctx.fillStyle = '#22c55e';
      }
      ctx.fillRect(
        segment.x * GRID_SIZE + 1,
        segment.y * GRID_SIZE + 1,
        GRID_SIZE - 2,
        GRID_SIZE - 2
      );
    });
    
    if (score > highScore) {
      const newHighScore = score;
      setHighScore(newHighScore);
      localStorage.setItem('snakeHighScore', newHighScore);
    }

    // Draw food
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(
      food.x * GRID_SIZE + GRID_SIZE / 2,
      food.y * GRID_SIZE + GRID_SIZE / 2,
      GRID_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  };

  const endGame = () => {
    gameStateRef.current.gameRunning = false;
    gameStateRef.current.gameOverFlag = true;
    setGameRunning(false);
    setGameOver(true);

    setStartBtnText('Restart');
    setPauseBtnText('Pause');
  };

  const resetGame = () => {
    const newSnake = getSnakeLength(difficulty);
    const newFood = generateFood(newSnake);
    
    gameStateRef.current.snake = newSnake;
    gameStateRef.current.food = newFood;
    gameStateRef.current.direction = { x: 1, y: 0 };
    gameStateRef.current.nextDirection = { x: 1, y: 0 };
    gameStateRef.current.score = 0;
    gameStateRef.current.gameSpeed = getGameSpeed(difficulty);
    gameStateRef.current.gameRunning = false;
    gameStateRef.current.gamePaused = false;
    gameStateRef.current.gameOverFlag = false;

    setScore(0);
    setGameRunning(false);
    setGamePaused(false);
    setGameOver(false);
    setStartBtnText('Start Game');
    setPauseBtnText('Pause');

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      drawGame(ctx, newSnake, newFood);
    }
  };

  const gameLoop = () => {
    const ctx = canvasRef.current.getContext('2d');
    const state = gameStateRef.current;

    if (!state.gamePaused && state.gameRunning) {
      // Update
      state.direction = state.nextDirection;
      const head = {
        x: state.snake[0].x + state.direction.x,
        y: state.snake[0].y + state.direction.y,
      };

      // Check collision with walls
      if (
        head.x < 0 ||
        head.x >= CANVAS_WIDTH / GRID_SIZE ||
        head.y < 0 ||
        head.y >= CANVAS_HEIGHT / GRID_SIZE
      ) {
        endGame();
        return;
      }

      // Check collision with self
      if (state.snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
      }

      state.snake.unshift(head);

      // Check if food is eaten
      if (head.x === state.food.x && head.y === state.food.y) {
        const newScore = state.score + 10;
        state.score = newScore;
        setScore(newScore);
        state.food = generateFood(state.snake);
      } else {
        state.snake.pop();
      }

      // Draw
      drawGame(ctx, state.snake, state.food);
    }

    if (state.gameRunning) {
      setTimeout(gameLoop, state.gameSpeed);
    }
  };

  const handleKeyDown = (e) => {
    if (!gameStateRef.current.gameRunning) return;

    const key = e.key.toLowerCase();

    if (key === 'arrowup' || key === 'w') {
      if (gameStateRef.current.direction.y === 0) {
        gameStateRef.current.nextDirection = { x: 0, y: -1 };
      }
    } else if (key === 'arrowdown' || key === 's') {
      if (gameStateRef.current.direction.y === 0) {
        gameStateRef.current.nextDirection = { x: 0, y: 1 };
      }
    } else if (key === 'arrowleft' || key === 'a') {
      if (gameStateRef.current.direction.x === 0) {
        gameStateRef.current.nextDirection = { x: -1, y: 0 };
      }
    } else if (key === 'arrowright' || key === 'd') {
      if (gameStateRef.current.direction.x === 0) {
        gameStateRef.current.nextDirection = { x: 1, y: 0 };
      }
    }
  };

  const toggleGame = () => {
    if (!gameStateRef.current.gameRunning) {
      resetGame();
      gameStateRef.current.gameRunning = true;
      gameStateRef.current.gamePaused = false;
      setGameRunning(true);
      setGamePaused(false);
      setGameOver(false);
      setStartBtnText('Restart');
      gameLoop();
    } else {
      resetGame();
    }
  };

  const togglePause = () => {
    if (gameStateRef.current.gameRunning) {
      gameStateRef.current.gamePaused = !gameStateRef.current.gamePaused;
      setGamePaused(!gamePaused);
      setPauseBtnText(gameStateRef.current.gamePaused ? 'Resume' : 'Pause');
      if (!gameStateRef.current.gamePaused) {
        gameLoop();
      }
    }
  };

  useEffect(() => {
    // Initialize game
    resetGame();
  }, [difficulty]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <main className="main">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>🐍 Snake Game</h1>

        <div className="flexbox">
          {/* Controls and Info */}
          <div className="box">
            <h2>Game Info</h2>
            <div style={{ fontSize: '1.25rem', margin: '24px 0' }}>
              <div style={{ margin: '12px 0', padding: '12px', backgroundColor: 'var(--bg-main)', borderRadius: '6px' }}>
                <strong>Score:</strong> {score}
              </div>
              <div style={{ margin: '12px 0', padding: '12px', backgroundColor: 'var(--bg-main)', borderRadius: '6px' }}>
                <strong>High Score:</strong> {highScore}
              </div>
            </div>

            <div style={{ margin: '24px 0' }}>
              <h3>Difficulty</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                {['easy', 'normal', 'hard', 'asian'].map((level) => (
                  <label key={level} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="difficulty"
                      value={level}
                      checked={difficulty === level}
                      onChange={(e) => setDifficulty(e.target.value)}
                      disabled={gameRunning}
                    />
                    <span style={{ textTransform: 'capitalize' }}>{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexDirection: 'column' }}>
              <button
                onClick={toggleGame}
                style={{
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  backgroundColor: 'var(--success-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => (e.target.style.transform = 'translateY(-2px)')}
                onMouseOut={(e) => (e.target.style.transform = 'translateY(0)')}
              >
                {startBtnText}
              </button>
              <button
                onClick={togglePause}
                disabled={!gameRunning}
                style={{
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  backgroundColor: gameRunning ? 'var(--accent-color)' : '#cccccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: gameRunning ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  opacity: gameRunning ? 1 : 0.6,
                }}
                onMouseOver={(e) => gameRunning && (e.target.style.transform = 'translateY(-2px)')}
                onMouseOut={(e) => (e.target.style.transform = 'translateY(0)')}
              >
                {pauseBtnText}
              </button>
            </div>
          </div>

          {/* Game Canvas */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                style={{
                  border: '2px solid var(--accent-color)',
                  borderRadius: '8px',
                  backgroundColor: '#1a1a2e',
                  boxShadow: '0 0 20px rgba(37, 99, 235, 0.3)',
                  display: 'block',
                }}
              />
              {gameOver && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#dc2626',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: '24px 32px',
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}
                >
                  GAME OVER!
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              <p style={{ marginBottom: '8px' }}>🎮 Use Arrow Keys or WASD to control the snake</p>
              <p style={{ fontSize: '0.9rem' }}>Eat the red food • Avoid walls and yourself</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="privacy">
        <p>
          Email: <a href="mailto:jgbuca_dummy@gmail.com">jgbuca_dummy@gmail.com</a>
          <span style={{ margin: '0 16px' }}>•</span>
          <a href="#privacy-policy">&copy; 2026 - Portfolio - Privacy Policy</a>
        </p>
      </footer>
    </main>
  );
}

export default Game;
