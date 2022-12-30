FROM python:3.11

WORKDIR /app

COPY ./requirements.txt .


RUN pip3 install -r requirements.txt

COPY . .

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
# CMD ["guinicorn", "-b", "0.0.0.0:5000", "app:app"]