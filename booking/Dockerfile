FROM python:3.12

WORKDIR /app

# Copy all files
COPY . /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Ensure grpcio-tools is installed with the latest version
RUN pip install --upgrade grpcio-tools

# Generate gRPC Python files for both booking and showtime
RUN python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. booking.proto
RUN python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. showtime.proto

# CMD command for running the service
CMD ["python", "-u", "booking.py"]