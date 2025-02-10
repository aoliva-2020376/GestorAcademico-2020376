// Rutas de autenticación
import { Router } from "express";
import { 
    login,
    register, 
    test 
} from "./auth.controller.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";
import { registerValidator } from "../../middlewares/validators.js";

const api = Router()

// Rutas públicas (No requieren autenticación)
api.post('/register', registerValidator, register);
api.post('/login', login);

// Rutas privadas (Protegidas con JWT)
api.get('/test', validateJwt, test);

// Exportamos las rutas
export default api;
