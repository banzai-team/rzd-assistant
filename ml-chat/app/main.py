import logging

from fastapi import FastAPI
from pydantic import BaseModel

from app.model.chat import process

logging.basicConfig(level=logging.INFO)

app = FastAPI()


@app.get("/")
def health():
    return {"ok": 200}


class Item(BaseModel):
    query: str


@app.post("/text")
def speech_to_text(item: Item):
    result = process(item.query, [])
    return {"result": result}
