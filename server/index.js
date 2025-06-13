// ✅ Import necessary libraries
import express from 'express';            // Web framework to build API
import cors from 'cors';                  // To allow frontend requests from another origin
import { MongoClient, ObjectId } from 'mongodb'; // To connect and interact with MongoDB
import bcrypt from 'bcryptjs';            // To hash passwords securely
import jwt from 'jsonwebtoken';           // To create and verify login tokens (JWTs)
import dotenv from 'dotenv';              // To load secret variables from .env file

dotenv.config(); // ✅ Load environment variables from .env file

// ✅ Initialize Express app
const app = express(); 

// ✅ Load config values from .env or use defaults
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Middleware to allow CORS (frontend at port 5173 can call this backend)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // allow cookies or headers to be sent
}));

// ✅ Middleware to parse incoming JSON requests
app.use(express.json());

// ===================== DATABASE SETUP ===================== //

// Create variable to hold the database reference
let db;

// Connect to MongoDB
const connectDB = async () => {
  try {
    const client = new MongoClient(MONGODB_URI); // connect using URI
    await client.connect(); // wait until it connects
    db = client.db('Login'); // use or create database called 'loginapp'
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1); // stop server if DB fails
  }
};

// ===================== AUTHENTICATION MIDDLEWARE ===================== //

// This function checks if the user sent a valid JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // e.g., Bearer xyz.token.value
  const token = authHeader && authHeader.split(' ')[1]; // extract token part

  if (!token) return res.status(401).json({ message: 'Access token required' });

  // Verify if token is valid
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });

    req.user = user; // add user info to the request
    next();          // continue to the next route handler
  });
};

// ===================== ROUTES ===================== //

// ✅ Route: Register a new user
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Make sure all fields are present
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists with same email
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password securely
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user object to store
    const user = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    // Insert user into database
    const result = await db.collection('users').insertOne(user);

    // Generate a JWT token to keep user logged in
    const token = jwt.sign(
      { userId: result.insertedId, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' } // expires in 7 days
    );

    // Send back success message and token
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: result.insertedId,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Route: Login an existing user
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for both fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password with hashed one in DB
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send response with user info and token
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Route: Get logged-in user's profile (Protected)
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(req.user.userId) }, // convert string ID to Mongo ObjectId
      { projection: { password: 0 } }         // exclude password from result
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });

  } catch (error) {
    console.error('❌ Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Route: Just to verify if token is valid (used by frontend on page reload)
app.get('/api/verify', authenticateToken, (req, res) => {
  res.json({ message: 'Token is valid', user: req.user });
});

// ===================== SERVER START ===================== //

// Only start server after connecting to MongoDB
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
