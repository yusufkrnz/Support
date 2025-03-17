from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uvicorn
import time
from typing import Dict, Any

from schemas.feedback import FeedbackRequest, FeedbackResponse, ChatbotRequest, ChatbotResponse
from models.sentiment_model import analyze_sentiment, load_model
from models.chatbot_model import generate_response
from database import get_db, create_tables, AnalysisResult
from config import API_HOST, API_PORT, API_DEBUG

# FastAPI uygulamasını oluştur
app = FastAPI(
    title="Destek Hizmeti AI API",
    description="Destek hizmeti için duygu analizi ve chatbot API'si",
    version="1.0.0"
)

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tüm originlere izin ver (production'da değiştirilmeli)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Uygulama başlangıcında modeli yükle
@app.on_event("startup")
async def startup_event():
    print("Uygulama başlatılıyor...")
    create_tables()
    load_model()
    print("Uygulama başlatıldı!")

# Sağlık kontrolü endpoint'i
@app.get("/health")
async def health_check():
    return {"status": "ok", "timestamp": time.time()}

# Duygu analizi endpoint'i
@app.post("/analyze", response_model=FeedbackResponse)
async def analyze_feedback(request: FeedbackRequest, db: Session = Depends(get_db)):
    try:
        # Duygu analizi yap
        result, confidence = analyze_sentiment(request.text)
        
        # Analiz sonucunu veritabanına kaydet
        db_result = AnalysisResult(
            text=request.text,
            result=result,
            confidence=confidence
        )
        db.add(db_result)
        db.commit()
        
        return FeedbackResponse(result=result, confidence=confidence)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Chatbot endpoint'i
@app.post("/chat", response_model=ChatbotResponse)
async def chat(request: ChatbotRequest):
    try:
        # Yanıt üret
        response, suggested_actions = generate_response(request.text, request.context)
        
        return ChatbotResponse(
            response=response,
            suggested_actions=suggested_actions
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Eğer doğrudan çalıştırılırsa
if __name__ == "__main__":
    uvicorn.run("app:app", host=API_HOST, port=API_PORT, reload=API_DEBUG) 