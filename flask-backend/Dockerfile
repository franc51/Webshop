# Use official Python slim image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app source code
COPY . .

# Expose the port that Flask will run on
EXPOSE 8080

# Set environment variable for Flask
ENV FLASK_ENV=production
ENV PORT=8080

# Run the app using Gunicorn on port 8080
CMD exec gunicorn --bind :8080 --workers 1 --threads 8 --timeout 0 app:app
