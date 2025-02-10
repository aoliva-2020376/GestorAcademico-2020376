import User from "../user/user.model.js";
import { hash, verify } from "argon2";

/** 
 * @desc Obtener todos los usuarios (estudiantes y maestros)
 * @route GET /api/users
 */
export const getUsers = async (req, res) => {
    try {
        const { limit = 20, skip = 0 } = req.query;
        const users = await User.find().skip(skip).limit(limit);

        if (users.length === 0) {
            return res.status(400).send({
                success: false,
                message: 'Users not found'
            });
        }
        return res.send({
            success: true,
            message: 'Users found:',
            users
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'General error', error });
    }
};

/** 
 * @desc Obtener un usuario por ID
 * @route GET /api/users/:id
 */
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) return res.status(404).send({
            success: false,
            message: 'User not found'
        });

        return res.send({
            success: true,
            message: 'User found:',
            user
        });
    } catch (error) {
        console.error('General error', error);
        return res.status(500).send({
            success: false,
            message: 'General error',
            error
        });
    }
};

/** 
 * @desc Crear un nuevo usuario (estudiante o maestro)
 * @route POST /api/users
 */
export const createUser = async (req, res) => {
    try {
        const { name, surname, username, email, password, role } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Encriptar la contraseña antes de guardarla
        const hashedPassword = await hash(password);

        // Crear el nuevo usuario
        const newUser = new User({
            name,
            surname,
            username,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: newUser
        });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Error creating user", error });
    }
};

/** 
 * @desc Actualizar datos de un usuario (sin contraseña)
 * @route PUT /api/users/:id
 */
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { password, ...data } = req.body; // Excluir la contraseña de la actualización

        const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
        if (!updatedUser) return res.status(404).send({ success: false, message: 'User not found' });

        return res.send({
            success: true,
            message: 'User updated',
            user: updatedUser
        });
    } catch (error) {
        console.error('General error', error);
        return res.status(500).send({ success: false, message: 'General error', error });
    }
};

/**
 * @desc Actualizar la contraseña de un usuario
 * @route PUT /api/users/:id/password
 */
export const updateUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(id);
        if (!user) return res.status(404).send({ success: false, message: 'User not found' });

        // Verificar la contraseña actual
        const isMatch = await verify(user.password, currentPassword);
        if (!isMatch) return res.status(400).send({ success: false, message: 'Incorrect current password' });

        // Encriptar la nueva contraseña
        const hashedPassword = await hash(newPassword);
        user.password = hashedPassword;
        await user.save();

        return res.send({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('General error', error);
        return res.status(500).send({ success: false, message: 'General error', error });
    }
};

/** 
 * @desc Eliminar un usuario
 * @route DELETE /api/users/:id
 */
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: "User not found" });
        
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting user", error });
    }
};

