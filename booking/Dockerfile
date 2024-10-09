FROM python:3.12

WORKDIR /app

# Copy all files
COPY . /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Generate gRPC Python files
RUN python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. *.proto

# CMD command for running the service
CMD ["python", "-u", "booking.py"]