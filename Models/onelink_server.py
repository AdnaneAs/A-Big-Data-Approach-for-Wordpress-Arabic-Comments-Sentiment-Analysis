from typing import Dict
from fastapi import FastAPI, HTTPException ,BackgroundTasks
from pydantic import BaseModel
import requests
import json 
import time 
import os 
import pandas as pd
from bs4 import BeautifulSoup
import numpy as np
from datetime import datetime
import pickle
from keras.models import load_model
from keras.preprocessing.sequence import pad_sequences
import uvicorn
from pyngrok import ngrok
import pymongo
from pymongo import MongoClient
from bson.objectid import ObjectId
from fastapi.middleware.cors import CORSMiddleware

# Load model and tokenizer
model = load_model('./best_model_merged.h5')
with open('./tokenizer.pkl', 'rb') as handle:
    tokenizer = pickle.load(handle)

label_mapping = {0: 'negative', 1: 'neutral', 2: 'positive'}

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from your frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)
is_streaming = {"running": False}

uri = 'mongodb+srv://hespress_admin:hespress_admin@quizaicluster.ht9wkvd.mongodb.net/'
client = MongoClient(uri)
db = client["Hespress"]  # Database name
collection = db["hespress_comments"]

class LinkRequest(BaseModel):
    link: str

def convert_arabic_date(date_str):
    # (Same implementation as in your original script)
    arabic_weekdays = {
        "الإثنين": "Monday",
        "الثلاثاء": "Tuesday",
        "الأربعاء": "Wednesday",
        "الخميس": "Thursday",
        "الجمعة": "Friday",
        "السبت": "Saturday",
        "الأحد": "Sunday"
    }
    arabic_months = {
        "يناير": "January",
        "فبراير": "February",
        "مارس": "March",
        "أبريل": "April",
        "ماي": "May",
        "يونيو": "June",
        "يوليوز": "July",
        "غشت": "August",
        "شتنبر": "September",
        "أكتوبر": "October",
        "نونبر": "November",
        "دجنبر": "December"
    }

    for arabic_day, english_day in arabic_weekdays.items():
        if arabic_day in date_str:
            date_str = date_str.replace(arabic_day, english_day)
    for arabic_month, english_month in arabic_months.items():
        if arabic_month in date_str:
            date_str = date_str.replace(arabic_month, english_month)

    date_format = "%A %d %B %Y - %H:%M" 
    return datetime.strptime(date_str, date_format)

def scrape_comments(link):
    r = requests.get(link, headers=headers)
    if r.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to fetch comments")
    
    soup = BeautifulSoup(r.content, 'html.parser')
    second_item = soup.find_all("li", class_="breadcrumb-item")[1]
    category = second_item.get_text(strip=True)
    post_id = int(soup.find('section', class_='apost').get('data-postid'))
    title = soup.find('h1', class_='post-title').text
    date = soup.find('span', class_='date-post').text
    post_date = convert_arabic_date(date)
    

    comments = []
    for comment in soup.find_all('li', class_='comment'):
        comment_date = convert_arabic_date(comment.find('div', class_='comment-date').text.strip())
        comment_id = comment.get('id').split("-")[-1]
        comment_text = comment.find('p').text.strip()
        comment_seq = pad_sequences(tokenizer.texts_to_sequences([comment_text]), maxlen=100)
        sentiment = model.predict(comment_seq)[0]
        sentiment_label = label_mapping[np.argmax(sentiment)]
        neg, neu, pos = sentiment
        score = round(-neg + pos, 2)
        
        comment_timestamp = comment_date.strftime("%Y-%m-%dT%H:%M:%SZ")
        reaction = comment.find('span', class_='comment-recat-number').text

        
        comments.append({
            "comment_id": str(post_id) +"_" + comment_id,
            "post_id": post_id,
            "comment": comment_text, 
            "comment_reaction": int(reaction),
            "comment_timestamp": comment_timestamp,
            "sentiment": {  # Nest the sentiment label inside the "sentiment" dictionary
                "label": sentiment_label,
                "score": round(float(score), 4),
                 "probabilities": {
                    "negative": round(float(neg), 4),
                    "neutral": round(float(neu), 4),
                    "positive": round(float(pos), 4) 
                }
            }       
        })


    # Calculate sentiment statistics
    sentiment_stats = {
            "total_comments": len(comments),
            "positive_comments": sum(1 for c in comments if c["sentiment"]["label"] == "positive"),
            "negative_comments": sum(1 for c in comments if c["sentiment"]["label"] == "negative"),
            "neutral_comments": sum(1 for c in comments if c["sentiment"]["label"] == "neutral"),
        }
    sentiment_stats.update({
        "positive_percentage": round(sentiment_stats["positive_comments"] / sentiment_stats["total_comments"], 2) if sentiment_stats["total_comments"] > 0 else 0.0,
        "negative_percentage": round(sentiment_stats["negative_comments"] / sentiment_stats["total_comments"], 2) if sentiment_stats["total_comments"] > 0 else 0.0,
        "neutral_percentage": round(sentiment_stats["neutral_comments"] / sentiment_stats["total_comments"], 2) if sentiment_stats["total_comments"] > 0 else 0.0
    })
    # Build the data structure
    scraped_data = {
        "scraped_data": [
            {
                "post_id": post_id,
                "post_link": link,
                "category": category,
                "title": title,
                "post_date": post_date.strftime("%d-%m-%Y %H:%M"),
                "comments": comments,
                "sentiment_statistics": sentiment_stats
            }
        ],
        "scraped_at": datetime.utcnow().isoformat() + "Z"
    }

    # Write the data to a JSON file
    with open(f'./data/creaped_comments_{post_id}.json', "w", encoding="utf-8") as json_file:
        json.dump(scraped_data, json_file, separators=(",", ":"), ensure_ascii=False)

    print(f"Data has been saved to 'creaped_comments.json'")

    return scraped_data

#######################3


# Variables for fault tolerance
processed_comments = set()
backup_file = "comments_backup.json"

# Load previously processed comments from backup
try:
    with open(backup_file, 'r') as f:
        backup_data = json.load(f)
        for comment in backup_data.get("comments", []):
            processed_comments.add(comment["text"])
except FileNotFoundError:
    backup_data = {"comments": []}

# Pydantic model for API input
class LinkRequest(BaseModel):
    link: str
    condition: bool = False

def scrape_and_analyze(link, json_file):
    return 0

def live_streaming(link, json_file, interval=10, condition: Dict[str, bool] = None):
    """Continuously scrape and analyze comments."""
    condition["running"] = True
    while condition["running"]:
        scrape_and_analyze(link, json_file)
        time.sleep(interval)

    # Final scrape before exiting
    scrape_and_analyze(link, json_file)



@app.post("/start-streaming/")
def start_streaming(request: LinkRequest, background_tasks: BackgroundTasks):
    """Start live streaming and analysis for a given link."""
    try:
        link = request.link
        json_file = "comments.json"
        background_tasks.add_task(live_streaming, link, json_file, interval=10, condition=is_streaming)
        result = scrape_and_analyze(link, json_file)  # Ensure the result is always returned
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/stop-streaming/")
def stop_streaming():
    """Stop the live streaming."""
    try:
        global is_streaming
        if not is_streaming["running"]:
            return {"message": "No streaming is currently running."}

        is_streaming["running"] = False
        print("message : Live streaming stopped.")
        return {"message": "Live streaming stopped.", "json_file": "comments.json"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.post("/process-link")
async def process_link(request: LinkRequest):
    try:
        result = scrape_comments(request.link)
        
        
        # Insert into MongoDB
        filter_query = {"post_id": result["scraped_data"][0]["post_id"]}  # Match by post_id
        update_data = {"$set": result}  # Update or set new data
        update_result = collection.update_one(filter_query, update_data, upsert=True)

        # Check if it was inserted or updated
        if update_result.upserted_id is not None:
            print(f"Document inserted with ID: {update_result.upserted_id}")
        else:
            print("Document updated successfully.")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def start_ngrok():
    # Open a ngrok tunnel to the dev server
    public_url = ngrok.connect(8000)
    print(f"Ngrok tunnel: {public_url}")

if __name__ == "__main__":
    start_ngrok()
    uvicorn.run(app, host="127.0.0.1", port=8000)

