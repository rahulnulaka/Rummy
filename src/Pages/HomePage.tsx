import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const startNewGame = () => {
    // Initialize new game data
    const newGame = {
      players: [],
      penalties: { FULL_COUNT: 80, MIDDLE_DROP: 40, OPEN_DROP: 20 },
      rounds: 0,
    };
    localStorage.setItem('currentGame', JSON.stringify(newGame));
    navigate('/game');
  };

  const continueGame = () => {
    const savedGame = localStorage.getItem('currentGame');
    if (savedGame) {
      navigate('/game');
    } else {
      alert('No saved game found!');
    }
  };

  return (
    <div>
      <h1>Rummy Scoreboard</h1>
      <button onClick={startNewGame}>Start New Game</button>
      <button onClick={continueGame}>Continue Game</button>
    </div>
  );
}

export default HomePage;
