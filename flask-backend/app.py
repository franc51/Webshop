import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import bcrypt
import jwt
import datetime
from bson import ObjectId
from bson.errors import InvalidId
import logging

load_dotenv()
# Initialize Flask app
app = Flask(__name__)

CORS(app)

# MongoDB connection string and secret key for JWT
# Get the Mongo URI from environment variable
MONGO_URI = os.environ.get("MONGO_URI")

if not MONGO_URI:
    raise ValueError("MONGO_URI environment variable is missing")

if not MONGO_URI.startswith("mongodb://") and not MONGO_URI.startswith("mongodb+srv://"):
    raise ValueError("Invalid MONGO_URI: must start with 'mongodb://' or 'mongodb+srv://'")

SECRET_KEY = os.environ.get("SECRET_KEY")

if not SECRET_KEY:
    raise ValueError("SECRET_KEY environment variable is missing")

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client['cyber']
users_collection = db['users']
product_collection = db['products']
order_collection =db['orders']

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
        token = token.split(" ")[1]  # Remove "Bearer"
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = decoded.get('user_id')
        # ✅ Safely convert to ObjectId
        try:
            object_id = ObjectId(user_id)
        except InvalidId:
            return jsonify({'message': 'Invalid user ID format'}), 400
        # --- GET: Fetch user info ---
        if request.method == 'GET':
            user = users_collection.find_one({'_id': object_id})
            if not user:
                return jsonify({'message': 'User not found'}), 404
            user_info = {
                'name': user['name'],
                'email': user['email']
            }
            return jsonify(user_info)
        # --- PUT: Update user info ---
        if request.method == 'PUT':
            data = request.json
            current_password = data.get('password')
            new_password = data.get('newPassword')
            new_name = data.get('username')
            new_email = data.get('email')
            user = users_collection.find_one({'_id': object_id})
            if not user:
                return jsonify({'message': 'User not found'}), 404
            # Check if current password is correct
            if not bcrypt.checkpw(current_password.encode('utf-8'), user['password']):
                return jsonify({'message': 'Incorrect current password'}), 400
            update_data = {}
            if new_name:
                update_data['name'] = new_name
            if new_email:
                update_data['email'] = new_email
            if new_password:
                hashed_new_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
                update_data['password'] = hashed_new_password
            users_collection.update_one({'_id': object_id}, {'$set': update_data})
            return jsonify({'message': 'Account updated successfully'}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401
    except Exception as e:
        print(f"❌ Unexpected error in /api/user: {e}")
        return jsonify({'message': 'Internal server error'}), 500

@app.route('/api/add-products', methods=['POST'])
def add_product():
    data = request.json
    app.logger.info(f"Received data: {data}")

    name = data.get('name')
    category = data.get('category')
    picture_urls = data.get('pictureUrls')
    price = data.get('price')
    new_arrival = data.get('newArrival', False)
    bestseller = data.get('bestseller', False)
    featured = data.get('featured', False)

    # Validate required fields
    if not all([name, category, picture_urls, price is not None]):
        app.logger.error("Missing required fields")
        return jsonify({'message': 'Missing required fields'}), 400

    # Validate picture_urls is a list and has at least one valid url
    if not isinstance(picture_urls, list) or len(picture_urls) == 0:
        app.logger.error("pictureUrls must be a non-empty list")
        return jsonify({'message': 'pictureUrls must be a non-empty list'}), 400

    try:
        price = float(price)
    except (ValueError, TypeError) as e:
        app.logger.error(f"Invalid price value: {price} - {e}")
        return jsonify({'message': 'Invalid price value'}), 400

    product = {
        'name': name,
        'category': category,
        'pictureUrls': picture_urls,
        'price': price,
        'newArrival': bool(new_arrival),
        'bestseller': bool(bestseller),
        'featured': bool(featured)
    }

    try:
        result = product_collection.insert_one(product)
        product['_id'] = str(result.inserted_id)
    except Exception as e:
        app.logger.error(f"Error inserting product into DB: {e}")
        return jsonify({'message': 'Database error'}), 500

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

@app.route('/api/get-product/<product_id>', methods=['GET'])
def get_product(product_id):
    print(f"Fetching product with ID: {product_id}")
    from bson import ObjectId
    try:
        obj_id = ObjectId(product_id)
    except Exception as e:
        print(f"Invalid ObjectId: {e}")
        return jsonify({'error': 'Invalid product ID'}), 400
    product = product_collection.find_one({'_id': obj_id})
    if product:
        product['_id'] = str(product['_id'])
        return jsonify(product), 200
    else:
        print("Product not found")
        return jsonify({'error': 'Product not found'}), 404

@app.route('/api/orders', methods=['POST'])
def create_order():
    try:
        data = request.json
        # Basic field validation
        required_fields = ['buyerId', 'products', 'totalAmount', 'shippingAddress', 'paymentMethod', 'isPaid', 'status']
        if not all(field in data for field in required_fields):
            return jsonify({'message': 'Missing required fields'}), 400
        # Validate product list
        products = data.get('products', [])
        if not isinstance(products, list) or not all('productId' in p and 'name' in p and 'quantity' in p and 'priceAtPurchase' in p for p in products):
            return jsonify({'message': 'Invalid product list'}), 400
        # Build order document
        order = {
            'buyerId': data['buyerId'],
            'products': products,
            'totalAmount': float(data['totalAmount']),
            'shippingAddress': data['shippingAddress'],
            'paymentMethod': data['paymentMethod'],
            'isPaid': bool(data['isPaid']),
            'status': data['status'],
            'createdAt': datetime.datetime.utcnow()
        }
        result = order_collection.insert_one(order)
        order['_id'] = str(result.inserted_id)
        return jsonify({'message': 'Order created successfully', 'order': order}), 201
    except Exception as e:
        print(f"❌ Error creating order: {e}")
        return jsonify({'message': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)

