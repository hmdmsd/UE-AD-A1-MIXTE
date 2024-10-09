FROM python:3.12

WORKDIR /app

# Copy all files
COPY . /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Ensure grpcio-tools is installed with the latest version
RUN pip install --upgrade grpcio-tools

# Remove old generated files
RUN rm -f *_pb2.py *_pb2_grpc.py

# Generate gRPC Python files
RUN python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. *.proto

# CMD command for running the service
CMD ["python", "-u", "showtime.py"]