from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class FeedbackRequest(BaseModel):
    text: str

class FeedbackResponse(BaseModel):
    result: str
    confidence: Optional[float] = None

class ChatbotRequest(BaseModel):
    text: str
    context: Optional[List[Dict[str, Any]]] = None

class ChatbotResponse(BaseModel):
    response: str
    confidence: Optional[float] = None
    suggested_actions: Optional[List[str]] = None 