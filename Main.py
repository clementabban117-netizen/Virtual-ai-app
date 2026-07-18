from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from scipy.stats import poisson

app = FastAPI(title="VirtualAI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB = "data.db"

def init_db():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS matches 
                 (id INTEGER PRIMARY KEY, league TEXT, home_goals INT, away_goals INT)''')
    conn.commit()
    conn.close()
init_db()

def predict_score(home_avg, away_avg):
    predictions = {}
    for h in range(4):
        for a in range(4):
            p = poisson.pmf(h, home_avg) * poisson.pmf(a, away_avg)
            predictions[f"{h}-{a}"] = round(p * 100, 2)
    return dict(sorted(predictions.items(), key=lambda x: x[1], reverse=True)[:5])

@app.get("/predict/{league}")
def predict(league: str):
    home_avg, away_avg = 1.4, 1.1
    preds = predict_score(home_avg, away_avg)
    return {
        "league": league, 
        "predictions": preds, 
        "disclaimer": "18+ For entertainment only. Virtuals are RNG"
    }

@app.get("/")
def home():
    return {"message": "VirtualAI API is running"}
