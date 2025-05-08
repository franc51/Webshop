import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

MONGO_URI = os.getenv("MONGO_URI")

# MongoDB connection
client = MongoClient(MONGO_URI)
db = client['users']
collection = db['user_collection']

@app.route('/api/users', methods=['GET'])
def get_users():
    users = list(collection.find({}, {'_id': 0}))
    return jsonify(users)

@app.route('/api/users', methods=['POST'])
def add_user():
    data = request.json
    collection.insert_one(data)
    return jsonify({"message": "User added successfully!"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
