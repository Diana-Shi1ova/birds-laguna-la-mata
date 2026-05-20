const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// Crear un user (registro)
const createUser = async (req, res) => {
    try{   
        if(!req.body){
            return res.status(400).json({ message: 'Missing body' });
        }
        const { name, email, password } = req.body;

        if(!name) return res.status(400).json({ message: 'Fied "name" is required' });
        if(!email) return res.status(400).json({ message: 'Fied "email" is required' });
        if(!password) return res.status(400).json({ message: 'Fied "password" is required' });

        // Comprobar si existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            // phone,
            password: hashedPassword,
            lastLogin: new Date(),
            avatar: ""
        });

        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            // phone: user.phone,
            token: generateToken(user._id),
        });
    } catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


// Generar token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: '30d',
    });
}

// Login
const loginUser = async (req, res) => {
    try{
        if(!req.body){
            return res.status(400).json({ message: 'Missing body' });
        }

        const {email, password} = req.body;

        if(!email) return res.status(400).json({ message: 'Fied "email" is required' });
        if(!password) return res.status(400).json({ message: 'Fied "password" is required' });

        //Comprobar si existe
        const user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Comparar hashes de contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            phone: user.phone,
            token: generateToken(user._id),
        });
    } catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


module.exports = {
    createUser,
    loginUser,
}