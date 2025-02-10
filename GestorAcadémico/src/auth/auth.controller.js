import User from '../user/user.model.js';
import { hash, verify } from 'argon2';
import { generateJwt } from '../../utils/jwt.js';

// Test de funcionamiento
export const test = (req, res) => {
    console.log('Test is running');
    return res.send({ message: 'Test is running' });
};

// Registro de usuario (estudiante o maestro)
export const register = async (req, res) => {
    try {
        const { name, surname, username, email, password, role } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Encriptar la contraseña
        const hashedPassword = await hash(password);

        // Crear nuevo usuario
        const newUser = new User({
            name,
            surname,
            username,
            email,
            password: hashedPassword,
            role: role || 'STUDENT_ROLE' // Rol por defecto estudiante
        });

        await newUser.save();
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: newUser
        });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Error registering user', error });
    }
};

// Inicio de sesión
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ 
            $or: [{ email }, { username: email }] 
        });

        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await verify(user.password, password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

        const token = await generateJwt({
            uid: user._id,
            username: user.username,
            name: user.name,
            role: user.role
        });

        return res.json({
            message: `Welcome ${user.name}`,
            user: {
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Error during login', error });
    }
};

