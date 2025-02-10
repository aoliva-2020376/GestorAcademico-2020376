import { Router } from "express";
import { 
    getUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    updateUserPassword,
    deleteUser 
} from "./user.controller.js";
import { registerValidator, updateUserValidators } from "../../middlewares/validators.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";

const api = Router();

// Rutas públicas (No autenticación necesaria)
api.get("/", getUsers); // Obtener todos los usuarios (estudiantes y maestros)
api.get("/:id", getUserById); // Obtener usuario por ID

// Rutas protegidas
api.post("/", 
    [
        registerValidator // Validador de registro
    ],
    createUser
); // Crear usuario (puede ser estudiante o maestro)

api.put("/:id", 
    [
        validateJwt, 
        updateUserValidators
    ], 
    updateUser
); // Actualizar usuario (sin contraseña)

api.put("/:id/password", validateJwt, updateUserPassword); // Actualizar contraseña del usuario

api.delete("/:id", validateJwt, deleteUser); // Eliminar usuario

export default api;
