import os
from flask import Flask, request, jsonify
from bson import ObjectId
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import bcrypt
import jwt
import datetime

load_dotenv()
# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB connection string and secret key for JWT
MONGO_URI = os.getenv("MONGO_URI")
SECRET_KEY = os.getenv('SECRET_KEY')

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client['cyber']
users_collection = db['users']
product_collection = db['products']

# Signup route
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    # Check for missing fields
    if not name or not email or not password:
        return jsonify({'message': 'Missing fields'}), 400
    # Check if user already exists
    if users_collection.find_one({'email': email}):
        return jsonify({'message': 'User already exists'}), 409
    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    # Insert new user into the database
    users_collection.insert_one({
        'name': name,
        'email': email,
        'password': hashed_password
    })
    return jsonify({'message': 'User created successfully'}), 201

# Login route
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    # Fetch user by email
    user = users_collection.find_one({'email': email})
    if not user:
        return jsonify({'message': 'User not found'}), 404
    # Check if the password matches
    if bcrypt.checkpw(password.encode('utf-8'), user['password']):
        # Create JWT token with user_id and expiration time
        token = jwt.encode({
            'user_id': str(user['_id']),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, SECRET_KEY, algorithm='HS256')
        return jsonify({'message': 'Login successful', 'token': token}), 200
    else:
        return jsonify({'message': 'Invalid password'}), 401

# Update user info route (for editing user account details)
@app.route('/api/user', methods=['GET', 'PUT'])
def user_info():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Token is missing!'}), 401
    try:
        token = token.split(" ")[1]  # Bearer token
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = decoded['user_id']

        if request.method == 'GET':
            user = users_collection.find_one({'_id': ObjectId(user_id)})
            if not user:
                return jsonify({'message': 'User not found'}), 404
            user_info = {
                'name': user['name'],
                'email': user['email']
            }
            return jsonify(user_info)

        if request.method == 'PUT':
            data = request.json
            current_password = data.get('password')
            new_password = data.get('newPassword')
            user = users_collection.find_one({'_id': ObjectId(user_id)})
            if not user:
                return jsonify({'message': 'User not found'}), 404
            if not bcrypt.checkpw(current_password.encode('utf-8'), user['password']):
                return jsonify({'message': 'Incorrect current password'}), 400
            update_data = {'username': data['username'], 'email': data['email']}
            if new_password:
                hashed_new_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
                update_data['password'] = hashed_new_password
            users_collection.update_one({'_id': ObjectId(user_id)}, {'$set': update_data})
            return jsonify({'message': 'Account updated successfully'}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401
    except Exception as e:
        print(f"Unexpected error in /api/user: {e}")  # Log full error on the server console
        return jsonify({'message': 'Internal server error'}), 500


@app.route('/api/add-products', methods=['POST'])
def add_product():
    data = request.json
    name = data.get('name')
    category = data.get('category')
    picture_url = data.get('pictureUrl')
    price = data.get('price')
    new_arrival = data.get('newArrival', False)
    bestseller = data.get('bestseller', False)
    featured = data.get('featured', False)
    # Validate required fields
    if not all([name, category, picture_url, price is not None]):
        return jsonify({'message': 'Missing required fields'}), 400
    try:
        price = float(price)
    except ValueError:
        return jsonify({'message': 'Invalid price value'}), 400
    product = {
        'name': name,
        'category': category,
        'pictureUrl': picture_url,
        'price': price,
        'newArrival': bool(new_arrival),
        'bestseller': bool(bestseller),
        'featured': bool(featured)
    }
    result = product_collection.insert_one(product)
    product['_id'] = str(result.inserted_id)

    return jsonify({
        'message': 'Product added successfully',
        'product': product
    }), 201

@app.route('/api/get-all-products', methods=['GET'])
def get_products():
    filters = {}
    # Read query parameters
    category = request.args.get('category')
    price_min = request.args.get('priceMin')
    price_max = request.args.get('priceMax')
    ram = request.args.get('ram')
    # Add category filter
    if category:
        filters['category'] = category
        print(f"Received category filter: {category}")
    # Combine price range properly
    if price_min or price_max:
        price_filter = {}
        if price_min:
            try:
                price_filter['$gte'] = float(price_min)
            except ValueError:
                print("Invalid priceMin value:", price_min)
        if price_max:
            try:
                price_filter['$lte'] = float(price_max)
            except ValueError:
                print("Invalid priceMax value:", price_max)
        if price_filter:
            filters['price'] = price_filter
    # Add RAM filter
    if ram:
        try:
            filters['ram'] = int(ram)
        except ValueError:
            print("Invalid RAM value:", ram)
    print('Filters applied:', filters)
    # Debug: count matching documents
    match_count = product_collection.count_documents(filters)
    print(f"Matching products count: {match_count}")
    # Debug: print a sample of matching products
    sample_products = list(product_collection.find(filters).limit(3))
    print("Sample matching products:", sample_products)
    # Query MongoDB
    products = product_collection.find(filters)
    product_list = [{**p, '_id': str(p['_id'])} for p in products]
    return jsonify(product_list), 200

port = int(os.environ.get("PORT", 8080))
app.run(host="0.0.0.0", port=port)
