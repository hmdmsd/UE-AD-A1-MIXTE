FROM python:3.12
WORKDIR /app
COPY requirements.txt /app
COPY .env /app
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
ADD . /app/
CMD ["python","-u","movie.py"]
