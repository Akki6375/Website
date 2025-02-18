require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Define Schema & Model
const UserSchema = new mongoose.Schema({
    fullname: String,
    age: Number,
    address: String,
    idtype: String,
    idnumber: String,
    mobile: String,
    email: String
});

const User = mongoose.model('User', UserSchema);

// API Endpoint for Registration
app.post('/api/register', async (req, res) => {
    try {
        const { fullname, age, address, idtype, idnumber, mobile, email } = req.body;

        // Basic validation
        if (!fullname || !age || !address || !idtype || !idnumber || !mobile) {
            return res.status(400).json({ error: 'All required fields must be filled' });
        }

        // Check if mobile already exists
        const existingUser = await User.findOne({ mobile });
        if (existingUser) {
            return res.status(400).json({ error: 'Mobile number already registered' });
        }

        // Save user to database
        const newUser = new User({ fullname, age, address, idtype, idnumber, mobile, email });
        await newUser.save();

        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
