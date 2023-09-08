import logging

from fastapi import FastAPI
from pydantic import BaseModel
from huggingsound import SpeechRecognitionModel

app = FastAPI()

model = SpeechRecognitionModel("jonatasgrosman/wav2vec2-large-xlsr-53-russian")


@app.get("/")
def read_root():
    return {"Hello": "World"}


class Item(BaseModel):
    file_path: str


@app.post("/transform")
def speech_to_text(item: Item):
    transcriptions = model.transcribe([item.file_path])
    text_results = []
    for x in transcriptions:
        text_results.append(x["transcription"])
    return {"result": text_results}
