FROM python:3.12

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

# Nettoyage des anciens fichiers générés
RUN rm -f *_pb2.py *_pb2_grpc.py

# Génération des fichiers gRPC avec la version installée de protobuf
RUN python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. *.proto

CMD ["python", "-u", "booking.py"]