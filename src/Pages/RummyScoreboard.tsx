import { useState, useEffect } from "react";
import Button from "../Components/Button";

type Player = {
  id: number;
  name: string;
  isActive: boolean;
  scores: any[];
};

export default function RummyScoreboard() {
  const [gameId, setGameId] = useState(0)
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [round, setRound] = useState(0);
  const [dealerId, setDealerId] = useState<number | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [editingScore, setEditingScore] = useState<{ playerId: number; roundIndex: number } | null>(null);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [shufflePlayers, setShufflePlayers] = useState(true);
  const [initialPenalties, setInitialPenalties] = useState({
                                                            FULL_COUNT: 80,
                                                            MIDDLE_DROP: 40,
                                                            OPEN_DROP: 20,
                                                            SHOW: 0,
                                                            GAME_SCORE: 201,
                                                          });

  const penalties = {
    FULL_COUNT: "FC",
    MIDDLE_DROP: "MD", 
    OPEN_DROP: "D",
    SHOW: "R",
  };

  useEffect(()=>{
    gameCode();
  },[])

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
      setShufflePlayers(parsedState.shufflePlayers || false);
    }
  }, []);

  useEffect(() => {
    const stateToSave = { players, round, dealerId, initialPenalties, winner, shufflePlayers };
    localStorage.setItem("rummyState", JSON.stringify(stateToSave));
  }, [players, round, dealerId, initialPenalties, winner, shufflePlayers]);

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
    setPlayers((prevPlayers) => [...prevPlayers, newPlayer] );
    setPlayerName("");
  };

  const gameCode = ()=>{
    const code = Math.floor(Math.random()*1000000);
    setGameId(code);
  }

  const arrangePlayer = () =>{
    const set = new Set<number>();
    const orderArray:Player[]=[];
    while (set.size < players.length) {
      set.add(Math.floor(Math.random() * players.length));
    }
    const order=Array.from(set);
    order.map((ordernumber)=>{
      players.map((player,index)=>{
        if(index==ordernumber) orderArray.push(player);
      })
    })
    setPlayers(orderArray);
    setDealerId(orderArray[0].id);
    setShufflePlayers((prev)=>!prev);
  }

  const defaultnames:Array<string>=["🙈Macharshan", "💀Krishna", "🦋Rahul", "🕊Krish"];

  // const rejoinPlayer = (id: number) => {
  //   setPlayers((prev) =>
  //     prev.map((p) => (p.id === id ? { ...p, isActive: true } : p))
  //   );
  // };

  const addScore = (id: number, penaltyKey: keyof typeof penalties) => {
    const penaltySymbol = penalties[penaltyKey];
    console.log(penaltySymbol);
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
<<<<<<< Updated upstream
    let activePlayers:Player[] = [];
    players.map((p)=>{
      let total = calculateTotalScore(p);
      console.log("total:" , total);
      if(total >= initialPenalties.GAME_SCORE){
        p.isActive = false;
      }
       activePlayers.push(p);
    })
    setPlayers(activePlayers);
=======
    players.map((player)=>{
        const total = calculateTotalScore(player);
        if(total >= initialPenalties.GAME_SCORE) {
          player.isActive = false;
        } else {
          player;
        }
    })
    const active = players.filter((p) => p.isActive);
    if (active.length === 1) {
      setWinner(active[0].name);
    }
>>>>>>> Stashed changes
  };

  const nextRound = () => {
    eliminatePlayerIfReachedScore();

    const activePlayers = players.filter((player) => player.isActive);
    if (activePlayers.length === 0) return;

    let currentIndex = activePlayers.findIndex((p) => p.id === dealerId);
<<<<<<< Updated upstream
    console.log(currentIndex);
    // if (currentIndex === -1) currentIndex = 0;

    const nextDealer = activePlayers[(currentIndex + 1) % activePlayers.length];
=======
    if (currentIndex === -1) currentIndex = 0;
    const nextDealer = activePlayers[(currentIndex + 1) % activePlayers.length]; 
>>>>>>> Stashed changes
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
    setShufflePlayers(true);
    gameCode();
  };

  const formatScoreDisplay = (score: any): string => {
    if (score === "FC" || score === initialPenalties.FULL_COUNT) return "FC";
    if (score === "MD" || score === initialPenalties.MIDDLE_DROP) return "MD"; 
    if (score === "D" || score === initialPenalties.OPEN_DROP) return "D";
    if (score === "R" || score === initialPenalties.SHOW) return "R";
    if (typeof score === "number") return score.toString();
    return "-";
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto font-sans text-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
        {/* Left Side - Inputs */}
        <div className="w-full md:w-1/2">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Rummy Scoreboard</h1>
          <h2 className="text-md sm:text-lg mb-4">Game Code : {gameId}</h2>

          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter player name"
              className="text-black border p-2 w-full sm:w-auto"
            />
            <Button
              title="Add Player"
              onClick={addPlayer}
              styles="bg-blue-500 px-4 py-2 font-light rounded-md text-white w-full sm:w-auto"
            />
          </div>

          {shufflePlayers && (
            <div className="flex flex-wrap gap-2">
              {defaultnames.map((name, idx) => (
                <Button
                  key={idx}
                  styles="px-4 py-1 text-sm font-medium text-black bg-cyan-700 border border-black rounded"
                  title={name}
                  disabled={round > 1}
                  onClick={() => {
                    const newPlayer: Player = {
                      id: Date.now(),
                      name: name.trim(),
                      isActive: true,
                      scores: [],
                    };
                    setPlayers((prevPlayers) => {
                      const updated = [...prevPlayers, newPlayer];
                      if (updated.length === 1) setDealerId(newPlayer.id);
                      return updated;
                    });
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Side - Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="https://r4.wallpaperflare.com/wallpaper/901/920/998/poker-cards-card-death-wallpaper-0900684d117a1d0bc627484f10c1667d.jpg"
            alt="rummy card"
            className="h-48 sm:h-52 w-full object-cover rounded"
          />
        </div>
      </div>

      {/* Penalty Settings */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Scoring Settings</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex gap-4 flex-wrap">
          {["FULL_COUNT", "MIDDLE_DROP", "OPEN_DROP", "SHOW", "GAME_SCORE"].map((key) => (
            <div key={key} className="flex items-center space-x-2">
              <label htmlFor={key} className="text-sm">{key.replace("_", " ")}:</label>
              <input
                id={key}
                disabled={round > 0}
                type="text"
                value={(initialPenalties as any)[key]}
                onChange={(e) =>
                  setInitialPenalties({
                    ...initialPenalties,
                    [key]: parseInt(e.target.value) || 0,
                  })
                }
                className="w-14 text-black bg-gray-300 text-center border border-black rounded"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Player List */}
      {shufflePlayers && (
        <div className="flex flex-wrap gap-2 mb-4">
          {players.map((player) => (
            <Button
              key={player.id}
              styles="py-1 px-4 text-black text-sm font-medium bg-gray-400 border border-black rounded"
              title={player.name}
              disabled
            />
          ))}
          {players.length > 0 && (
            <Button title="Shuffle" onClick={arrangePlayer} />
          )}
        </div>
      )}

      {/* Score Table */}
      {!shufflePlayers && (
        <div className="overflow-x-auto mb-6">
          <table className="min-w-[600px] border-collapse border border-3 table-cell border-black text-center rounded">
            <caption className="text-xl font-semibold mb-2">Enter Scores for Round {round + 1}</caption>
            <thead>
              <tr>
                {players.map((player) => (
                  <th
                    key={player.id}
                    className={`bg-black border border-black px-1 m-0 max-w-fit overflow-x-auto 
                      ${!player.isActive ? "text-neutral-500" 
                        :((calculateTotalScore(player) >= initialPenalties.GAME_SCORE - 20)? "text-red-600"
                        :((calculateTotalScore(player) >= initialPenalties.GAME_SCORE - 40)? "text-yellow-500"
                        :"text-white"))}
                      `}
                  >
                    {player.id === dealerId ? `${player.name} *` : player.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(round + 1).keys()].map((r) => (
                <tr key={r}>
                  {players.map((player) => (
                    <td
                      key={player.id}
                      className={`m-1 max-w-fit py-2 bg-blue-500 border border-3 border-black border-r-2 text-sm cursor-pointer `}
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
                          className="border px-2 py-1 w-full max-w-[80px] text-center text-black"
                        />
                      ) : (
                        formatScoreDisplay(player.scores[r])
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                {players.map((player) => (
                  <td key={player.id} 
                  className={`m-1 max-w-fit py-2 text-l bg-blue-700 shadow-lg border border-3 border-black border-r-2 cursor-not-allowed
                              ${!player.isActive ? "text-neutral-500" 
                        :((calculateTotalScore(player) >= initialPenalties.GAME_SCORE - 20)? "text-red-600"
                        :((calculateTotalScore(player) >= initialPenalties.GAME_SCORE - 40)? "text-yellow-500"
                        :"text-white"))}
                      `}>
                    {calculateTotalScore(player)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Score Entry Buttons */}
      <div className="mt-6">
        <div className="space-y-2">
          {(!shufflePlayers)&&
          players.filter((p) => p.isActive).map((player) => (
            <div key={player.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <button
                hidden={round > 0}
                onClick={() => deletePlayer(player.id)}
                className="bg-transparent px-2 py-1"
              >
                🗑
              </button>
              <span className="w-32 font-medium">{player.name}</span>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => addScore(player.id, "FULL_COUNT")} className="bg-red-400 text-white px-3 py-1 rounded">Full</button>
                <button onClick={() => addScore(player.id, "MIDDLE_DROP")} className="bg-orange-400 px-3 py-1 rounded">Middle</button>
                <button onClick={() => addScore(player.id, "OPEN_DROP")} className="bg-yellow-400 px-3 py-1 rounded">Open</button>
                <button onClick={() => addScore(player.id, "SHOW")} className="bg-green-400 px-3 py-1 rounded">Show</button>
              </div>
            </div>
          ))
          }
        </div>

        {/* Winner Message */}
        {winner && (
          <div className="text-center mt-4 text-xl sm:text-2xl font-bold text-green-500">
            🎉 Winner: {winner} 🎉
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <Button
          onClick={nextRound}
          title="Next Round"
          styles="bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-400"
          disabled={round === 0 || !!winner}
        />
        <Button
          title="New Game"
          onClick={startNewGame}
          styles="bg-red-500 text-white px-4 py-2 rounded"
        />
      </div>
    </div>
  );
}
 