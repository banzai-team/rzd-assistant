FROM python:3.9 as base

WORKDIR /speech-app

COPY ./requirements.txt /speech-app/requirements.txt

RUN apt update && apt install -y libsndfile1
RUN pip install --no-cache-dir --upgrade -r /speech-app/requirements.txt

FROM base
#
ADD ./app ./app
#
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3333"]