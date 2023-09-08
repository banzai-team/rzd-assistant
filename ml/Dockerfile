FROM python:3.9 as base

WORKDIR /speech-app

COPY ./requirements.txt /speech-app/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /speech-app/requirements.txt

FROM base
#
COPY ./app /code/app

#
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3333"]