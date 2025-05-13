import { useRef, useState } from "react"

export function AddPlayers(){
    const [playerName, setPlayerName] = useState("");
    const [players, setPlayers] = useState<string[]>([]);

  function handleAddPlayers() {
    if (playerName.trim()) {
      setPlayers([...players, playerName]);
      setPlayerName(""); // Clear input
    }
  }

  return (
    <div className='h-full w-full bg-gray-600 grid content-center'>
         <div className="p-7 text-5xl text-center bg-blue-400 border-b-8 border-blue-700"
         >Score Board</div>
         <div className="flex justify-center items-center">
            <div className="w-1/4 m-4">
                <div className="flex">
                    <input type="text" name="addPlayers" id="addPlayers" placeholder='Add names' 
                    className="w-full p-2 rounded-l-lg"
                    onChange={(e:any)=>{
                        setPlayerName(e.target.value);
                    }} />
                    <button onClick={()=>handleAddPlayers()}
                    className="bg-blue-800 p-2 rounded-r-lg" 
                    >Add</button>
                </div>
                <div>
                    <table
                    className="w-full mt-2 border border-black">
                        <thead className="border border-black">
                            <th>Player Names</th>
                        </thead>
                        <tbody>
                        {players.map((value, index) => (
                            <tr key={index}>
                                <td>{value}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-col">
                    <button className="p-2 m-2 bg-blue-700 rounded-lg">Start Game</button>
                    <button className="p-2 m-2 bg-blue-700 rounded-lg">Reset Game</button>
                    <button className="p-2 m-2 bg-blue-700 rounded-lg">Continue Game</button>
                </div>
            </div>
            <div className="w-3/4">

            </div>
         </div>
         </div>
  )
}
