import logging
import os

from fastapi import FastAPI
from pydantic import BaseModel

from app.model.chat import process
from app.model.rulebased_chat import rule_based_process

logging.basicConfig(level=logging.INFO)

app = FastAPI()


@app.get("/")
def health():
    return {"ok": 200}


class Item(BaseModel):
    query: str
    context: list
    train_id: str


@app.post("/text")
def speech_to_text(item: Item):
    result = process(item.query, [])
    return {"result": result}


@app.post("/rule_based_text")
def rule_based_text(item: Item):
    item.context = [item.query] + item.context
    item.context.reverse()
    result = rule_based_process(item.context, item.train_id, 'tfidf_data')
    return {"result": result}
