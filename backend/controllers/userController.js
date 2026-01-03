const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// const { uploadFile, deleteFile } = require('../supabase/supabaseService');

// Obtener todos los users
const getUsers = async (req, res) => {
    try{
        const categories = await User.find();
        res.status(200).json(categories);
    }
    catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Obtener un user por ID
const getUserByID = async (req, res) => {
    try{
        const user = await User.findById(req.params.id);

        /*if(!user){
            return res.status(404).json({ message: 'User not found' });
        }*/

        res.status(200).json(user);
    } catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Crear un user (registro)
const createUser = async (req, res) => {
    try{   
        /*if(!req.body){
            return res.status(400).json({ message: 'Missing body' });
        }*/
        const { name, email, password } = req.body;

        // Comprobar si existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
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

// Modificar un user
const updateUser = async (req, res) => {
    try{
        const user = await User.findById(req.params.id);

        /*if(!user){
            return res.status(404).json({ message: 'User not found' });
        }*/

        const update = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).json(update);
    } catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Cambiar contraseña
const changePassword = async (req, res) => {
    try{
        const user = await User.findById(req.params.id);

        /*if(!user){
            return res.status(404).json({ message: 'User not found' });
        }*/

        const { oldPassword, newPassword } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPasswordNew = await bcrypt.hash(newPassword, salt);

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Wrong password' });
        }
        
        user.password = hashedPasswordNew;
        await user.save();
        res.status(200).json({ message: 'Password updated successfully' });
    } catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Subir avatar del usuario a Supabase
/*const uploadAvatar = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileBuffer = req.file.buffer;
    // const fileName = `avatars/${userId}/${req.file.originalname}`;
    const fileName = `avatars/${userId}/${userId}`;
    const mimeType = req.file.mimetype;

    // Subir a Supabase
    const publicUrl = await uploadFile(fileBuffer, fileName, mimeType);
    console.log(publicUrl);

    // Actualizar MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: publicUrl },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Upload error', error: error.message });
  }
};


const deleteAvatar = async (req, res) => {
  try {
    const userId = req.params.id;

    // Buscar usuario
    const user = await User.findById(userId);
    if (!user || !user.avatar) {
      return res.status(404).json({ message: 'User or avatar not found' });
    }

    if (user.avatar === '/src/assets/avatar-empty.png')
        return res.status(200).json({ message: 'Avatar already deleted' });

    // Obtener  path
    const bucketPath = '/storage/v1/object/public/molamazogames/';
    const filePath = user.avatar.split(bucketPath)[1];


    if (!filePath) {
      return res.status(400).json({ message: 'Invalid avatar URL' });
    }

    // Eliminar de Supabase
    await deleteFile(filePath);

    // Actualizamos usuario
    user.avatar = '/src/assets/avatar-empty.png';
    await user.save();

    res.status(200).json({ message: 'Avatar deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Delete error', error: error.message });
  }
};*/


// Borrar un user
const deleteUser = async (req, res) => {
    try{
        const user = await User.findById(req.params.id);

        /*if(!user){
            return res.status(404).json({ message: 'User not found' });
        }*/
        
        await user.deleteOne();
        res.status(200).json({message: req.params.id});
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
        const {email, password} = req.body;

        //Comprobar si existe
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Comparar hashes de contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
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

// Me
const getMe = async (req, res) => {
    try{
        res.status(200).json(req.user);
    } catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = {
    getUsers,
    getUserByID,
    updateUser,
    createUser,
    deleteUser,
    loginUser,
    getMe,
    /*uploadAvatar,
    deleteAvatar,*/
    changePassword,
}