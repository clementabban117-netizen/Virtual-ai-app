import { useState, useEffect } from 'react'

const LEAGUES = ["EPL Virtual", "LaLiga Virtual", "Bundesliga Virtual"]

export default function App() {
  const [league, setLeague] = useState(LEAGUES[0])
  const [data, setData] = useState(null)

  useEffect(() => {
    // Change this to your Render URL later
    fetch(`https://your-backend-url.onrender.com/predict/${league}`)
   .then(res => res.json())
   .then(setData)
   .catch(() => setData({error: "Backend not deployed yet"}))
  }, [league])

  return (
    <div style={{padding: 20, background: '#0a0a0a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif'}}>
      <h1>VirtualAI</h1>
      <p style={{color: 'red', fontSize: 12}}>18+ For entertainment only. Virtuals are RNG. Gamble responsibly.</p>
      
      <select onChange={e => setLeague(e.target.value)} style={{padding: 8, margin: '10px 0', background: '#222', color: 'white'}}>
        {LEAGUES.map(l => <option key={l}>{l}</option>)}
      </select>

      <div style={{marginTop: 20}}>
        <h2>Top Predicted Scores</h2>
        {data?.predictions && Object.entries(data.predictions).map(([score, prob]) => (
          <div key={score} style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #333'}}>
            <span>{score}</span>
            <span style={{color: '#4ade80', fontWeight: 'bold'}}>{prob}%</span>
          </div>
        ))}
        {data?.error && <p>{data.error}</p>}
      </div>
    </div>
  )
}
