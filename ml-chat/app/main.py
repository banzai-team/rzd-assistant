import logging
import os
from threading import Thread

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
    userContext: list
    botContext: list
    train_id: str
    message_id: int


class RuleBased(BaseModel):
    query: str
    context: list
    train_id: str


@app.post("/text")
def speech_to_text(item: Item):
    thread = Thread(target=process, args=(item.query, item.userContext, item.botContext, item.message_id, item.train_id))
    thread.start()
    return {"result": ""}


@app.post("/rule_based_text")
def rule_based_text(item: RuleBased):
    item.context = [item.query] + item.context
    item.context.reverse()
    result = rule_based_process(item.context, item.train_id, 'tfidf_data')
    return {"result": result}
