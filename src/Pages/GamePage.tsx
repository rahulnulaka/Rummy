import { useState, useEffect } from 'react';

function GamePage() {
  const [game, setGame] = useState<any>(null);
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    const savedGame = localStorage.getItem('currentGame');
    if (savedGame) {
      setGame(JSON.parse(savedGame));
    }
  }, []);

  const addPlayer = () => {
    if (playerName.trim() && game) {
      const newPlayer = {
        id: Date.now(),
        name: playerName.trim(),
        scores: [],
      };
      const updatedGame = { ...game, players: [...game.players, newPlayer] };
      setGame(updatedGame);
      localStorage.setItem('currentGame', JSON.stringify(updatedGame));
      setPlayerName('');
    }
  };

  const removePlayer = (id: number) => {
    if (game) {
      const updatedPlayers = game.players.filter((p: any) => p.id !== id);
      const updatedGame = { ...game, players: updatedPlayers };
      setGame(updatedGame);
      localStorage.setItem('currentGame', JSON.stringify(updatedGame));
    }
  };

  const addScore = (id: number, score: number) => {
    if (game) {
      const updatedPlayers = game.players.map((p: any) =>
        p.id === id ? { ...p, scores: [...p.scores, score] } : p
      );
      const updatedGame = { ...game, players: updatedPlayers };
      setGame(updatedGame);
      localStorage.setItem('currentGame', JSON.stringify(updatedGame));
    }
  };

  const nextRound = () => {
    if (game) {
      const updatedGame = { ...game, rounds: game.rounds + 1 };
      setGame(updatedGame);
      localStorage.setItem('currentGame', JSON.stringify(updatedGame));
    }
  };

  return (
    <div>
      <h1>Game Page</h1>
      <div>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter player name"
        />
        <button onClick={addPlayer}>Add Player</button>
      </div>

      <div>
        <h2>Players</h2>
        <ul>
          {game?.players.map((player: any) => (
            <li key={player.id}>
              {player.name}
              <button onClick={() => removePlayer(player.id)}>Remove</button>
              <div>
                {Array.from({ length: game.rounds }).map((_, index) => (
                  <input
                    key={index}
                    type="number"
                    onBlur={(e) => addScore(player.id, parseInt(e.target.value))}
                    placeholder={`Round ${index + 1}`}
                  />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Penalties</h2>
        <label>
          Full Count:
          <input
            type="number"
            value={game?.penalties.FULL_COUNT}
            onChange={(e) =>
              setGame({
                ...game,
                penalties: {
                  ...game.penalties,
                  FULL_COUNT: parseInt(e.target.value),
                },
              })
            }
          />
        </label>
        <label>
          Middle Drop:
          <input
            type="number"
            value={game?.penalties.MIDDLE_DROP}
            onChange={(e) =>
              setGame({
                ...game,
                penalties: {
                  ...game.penalties,
                  MIDDLE_DROP: parseInt(e.target.value),
                },
              })
            }
          />
        </label>
        <label>
          Open Drop:
          <input
            type="number"
            value={game?.penalties.OPEN_DROP}
            onChange={(e) =>
              setGame({
                ...game,
                penalties: {
                  ...game.penalties,
                  OPEN_DROP: parseInt(e.target.value),
                },
              })
            }
          />
        </label>
      </div>

      <button onClick={nextRound}>Next Round</button>
    </div>
  );
}

export default GamePage;
