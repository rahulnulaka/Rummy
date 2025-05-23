//fuckoff
import { useState, useEffect } from "react";
import Button from "../Components/Button";

type Player = {
  id: number;
  name: string;
  isActive: boolean;
  scores: any[];
};

export default function RummyScoreboard() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [round, setRound] = useState(0);
  const [dealerId, setDealerId] = useState<number | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  

  const penalties = {
    FULL_COUNT: "FC",
    MIDDLE_DROP: "MD", 
    OPEN_DROP: "D",
    SHOW: "R",
  };

  const [initialPenalties, setInitialPenalties] = useState({
    FULL_COUNT: 80,
    MIDDLE_DROP: 40,
    OPEN_DROP: 20,
    SHOW: 0,
    GAME_SCORE: 201,
  });

  const [editingScore, setEditingScore] = useState<{ playerId: number; roundIndex: number } | null>(null);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);

  useEffect(() => {
  const activePlayers = players.filter((p) => p.isActive);

  const allScored = activePlayers.every(
    (player) => player.scores[round] !== undefined && player.scores[round] !== null
  );

  if (activePlayers.length > 0 && allScored && !winner) {
    nextRound();
  }
}, [players, round, winner]);


  useEffect(() => {
    const savedState = localStorage.getItem("rummyState");
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      setPlayers(parsedState.players || []);
      setRound(parsedState.round || 0);
      setDealerId(parsedState.dealerId || null);
      setInitialPenalties(parsedState.initialPenalties || initialPenalties);
      setWinner(parsedState.winner || winner);
    }
  }, []);

  useEffect(() => {
    const stateToSave = { players, round, dealerId, initialPenalties, winner };
    localStorage.setItem("rummyState", JSON.stringify(stateToSave));
  }, [players, round, dealerId, initialPenalties, winner]);

  const addPlayer = (name?:any) => {
    // console.log(playerName);
    if(playerName === "") {
      setPlayerName(name);
      console.log(playerName);
    };
    if (!playerName.trim()) return;
    const newPlayer: Player = {
      id: Date.now(),
      name: playerName.trim(),
      isActive: true,
      scores: [],
    };
    setPlayers((prevPlayers) => {
    const  updatedPlayers = [...prevPlayers, newPlayer];
      if (updatedPlayers.length === 1) {
        setDealerId(newPlayer.id); // First player is dealer
      }
      return updatedPlayers;
    });
    setPlayerName("");
  };

  const defaultnames:Array<string>=["🙈harsha", "💀krishna", "🦋rahul", "🕊krish"];

  const removePlayer = (id: number) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: false } : p))
    );
  };

  const rejoinPlayer = (id: number) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: true } : p))
    );
  };

  const addScore = (id: number, penaltyKey: keyof typeof penalties) => {
    const penaltySymbol = penalties[penaltyKey];
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updatedScores = [...p.scores];
          updatedScores[round] = penaltySymbol;
          return { ...p, scores: updatedScores };
        }
        return p;
      })
    );
  };

  const deletePlayer = (id:number) =>{
    const newArray:Player[]=[]
    players.map((value)=>{
      if(value.id!==id){ 
        newArray.push(value);
      }
    })
    setPlayers(newArray);
    setDealerId(newArray[0].id);
  }

  const startEditingScore = (playerId: number, roundIndex: number) => {
    const currentScore = players.find((p) => p.id === playerId)?.scores[roundIndex] ?? "";
    setEditingScore({ playerId, roundIndex });
    setSelectedScore(currentScore);
  };

  const saveScore = () => {
    if (editingScore && selectedScore !== null) {
      const { playerId, roundIndex } = editingScore;
      setPlayers((prev) =>
        prev.map((p) => {
          if (p.id === playerId) {
            const updatedScores = [...p.scores];
            updatedScores[roundIndex] = selectedScore;
            return { ...p, scores: updatedScores };
          }
          return p;
        })
      );
      setEditingScore(null);
    }
  };

  const calculateTotalScore = (player: Player): number => {
    return player.scores
      .map((score) => {
        if (score === "FC") return initialPenalties.FULL_COUNT;
        if (score === "MD") return initialPenalties.MIDDLE_DROP;
        if (score === "D") return initialPenalties.OPEN_DROP;
        if (score === "R") return initialPenalties.SHOW;
        const parsed = parseInt(score);
        return isNaN(parsed) ? 0 : parsed;
      })
      .reduce((total, s) => total + s, 0);
  };

  const eliminatePlayerIfReachedScore = () => {
  setPlayers((prev) => {
    const updated = prev.map((p) => {
      const total = calculateTotalScore(p);
      return total >= initialPenalties.GAME_SCORE ? { ...p, isActive: false } : p;
    });

    const active = updated.filter((p) => p.isActive);
    if (active.length === 1) {
      setWinner(active[0].name);
    }

    return updated;
  });
};


  const nextRound = () => {
    eliminatePlayerIfReachedScore();

    const activePlayers = players.filter((p) => p.isActive);
    if (activePlayers.length === 0) return;

    let currentIndex = activePlayers.findIndex((p) => p.id === dealerId);
    if (currentIndex === -1) currentIndex = 0;

    const nextDealer = activePlayers[(currentIndex + 1) % activePlayers.length];
    setDealerId(nextDealer.id);
    setRound((prev) => prev + 1);
  };

  const startNewGame = () => {
    setPlayers([]);
    setRound(0);
    setDealerId(null);
    setInitialPenalties({
      FULL_COUNT: 80,
      MIDDLE_DROP: 40,
      OPEN_DROP: 20,
      SHOW: 0,
      GAME_SCORE: 201,
    });
    localStorage.removeItem("rummyState");
    setWinner(null);
  };

  const formatScoreDisplay = (score: any): string => {
    if (score === "FC" || score === initialPenalties.FULL_COUNT) return "FC";
    if (score === "MB" || score === initialPenalties.MIDDLE_DROP) return "MB";
    if (score === "D" || score === initialPenalties.OPEN_DROP) return "D";
    if (score === "R" || score === initialPenalties.SHOW) return "R";
    if (typeof score === "number") return score.toString();
    return "-";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-4">Rummy Scoreboard</h1>

      <div className="mb-4">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter player name"
          className="border p-2 mr-2"
        />
        <Button title={"Add Player"} onClick={addPlayer} styles={"bg-blue-500"} />
      </div>
      {(round<1) && 
      <div>
        {defaultnames.map((value,index)=>(
          <Button 
            key={index} 
            styles={"m-1 py-0 px-4 text-black text-sm font-medium bg-gray-400 border border-black rounded rounded-md"} 
            title={value}
            disabled={round>1}
            onClick={()=>{
              const newPlayer: Player = {
                id: Date.now(),
                name: value.trim(),
                isActive: true,
                scores: [],
              }
              setPlayers((prevPlayers) => {
                const updatedPlayers = [...prevPlayers, newPlayer];
                 if (updatedPlayers.length === 1) {
                   setDealerId(newPlayer.id); // First player is dealer
                 }
                 return updatedPlayers;
               });
            }} 
          />
        ))}
      </div>}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Scoring Settings</h2>
        <div className="flex gap-4 flex-wrap">
          {["FULL_COUNT", "MIDDLE_DROP", "OPEN_DROP", "SHOW", "GAME_SCORE"].map((key) => (
            <label key={key} >
              {key.replace("_", " ")}:
              <input
                disabled={round>0}
                type="text"
                value={(initialPenalties as any)[key]}
                onChange={(e) =>
                  setInitialPenalties({
                    ...initialPenalties,
                    [key]: parseInt(e.target.value) || 0,
                  })
                }
                className="border px-2 py-1 mx-2 w-24"
              />
            </label>
          ))}
        </div>
      </div>

      <table className="w-full border-collapse border mb-8 text-center">
        <thead>
          <tr>
            <th className="border px-4 py-2 bg-yellow-400">Round</th>
            {players.map((player) => (
              <th
                key={player.id}
                className={`border px-4 py-2 ${
                  calculateTotalScore(player) >= initialPenalties.GAME_SCORE - 20 ? "bg-red-300" : "bg-blue-400"
                }`}
              >
                {player.id === dealerId ? `${player.name} *` : player.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(round + 1).keys()].map((r) => (
            <tr key={r}>
              <td className="border px-4 py-2 bg-green-300">Round {r + 1}</td>
              {players.map((player) => (
                <td
                  key={player.id}
                  className={`border px-4 py-2 cursor-pointer ${
                    player.isActive ? "hover:bg-yellow-100" : "bg-gray-300"
                  }`}
                  onClick={() => player.isActive && startEditingScore(player.id, r)}
                >
                  {editingScore?.playerId === player.id && editingScore.roundIndex === r ? (
                    <input
                      type="number"
                      value={selectedScore !== null ? selectedScore : ""}
                      onChange={(e) => setSelectedScore(parseInt(e.target.value))}
                      onBlur={saveScore}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveScore();
                        if (e.key === "Escape") setEditingScore(null);
                      }}
                      autoFocus
                      className="border px-2 py-1 w-20 text-center"
                      placeholder="Score"
                    />
                  ) : (
                    formatScoreDisplay(player.scores[r])
                  )}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td className="border px-4 py-2 font-bold bg-indigo-600 text-white">Total</td>
            {players.map((player) => (
              <td key={player.id} className="border px-4 py-2 font-bold bg-indigo-500 text-white">
                {calculateTotalScore(player)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Enter Scores for Round {round + 1}</h2>
        {players.filter((p) => p.isActive).map((player) => (
          <div key={player.id} className="mb-2 flex gap-2 items-center">
            <span className="w-32 font-medium">{player.name}</span>
            <button onClick={() => addScore(player.id, "FULL_COUNT")} className="bg-red-400 text-white px-3 py-1 rounded">Full</button>
            <button onClick={() => addScore(player.id, "MIDDLE_DROP")} className="bg-orange-400 px-3 py-1 rounded">Middle</button>
            <button onClick={() => addScore(player.id, "OPEN_DROP")} className="bg-yellow-400 px-3 py-1 rounded">Open</button>
            <button onClick={() => addScore(player.id, "SHOW")} className="bg-green-400 px-3 py-1 rounded">Show</button>
            <button hidden={round>0} onClick={() => deletePlayer(player.id)} className="bg-green-400 px-3 py-1 rounded">Delete</button>
          </div>
        ))}
        {winner && (
  <div className="text-2xl font-bold text-green-600 mb-4">
    🎉 Winner: {winner} 🎉
  </div>
)}
        
    <Button 
      onClick={nextRound} 
      title={"Next Round"} 
      styles={"mt-4 bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-400"}
      disabled={(round==0) || !!winner}
    />
      </div>

      <button onClick={startNewGame} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Start New Game</button>
    </div>
  );
}
 