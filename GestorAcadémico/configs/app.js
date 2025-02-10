'use strict'

import express from 'express'; // Servidor HTTP
import morgan from 'morgan'; // Logs
import helmet from 'helmet'; // Seguridad para HTTP
import cors from 'cors'; // Acceso al API
import dotenv from 'dotenv'; // Variables de entorno
import { limiter } from '../middlewares/rate.limit.js';

// Importar rutas
import authRoutes from '../src/auth/auth.routes.js';
import userRoutes from '../src/user/user.routes.js';
import courseRoutes from '../src/course/course.routes.js';

dotenv.config(); // Cargar variables de entorno

// Configuraciones de express
const configs = (app) => {
    app.use(express.json()); // Aceptar y enviar datos en JSON
    app.use(express.urlencoded({ extended: false })); // No encriptar la URL
    app.use(cors()); // Políticas de seguridad
    app.use(helmet()); // Seguridad HTTP
    app.use(morgan('dev')); // Gestionador de Logs
    app.use(limiter); // Límite de peticiones
};

// Cargar rutas
const routes = (app) => {
    app.use('/api/auth', authRoutes); // Rutas de autenticación
    app.use('/api/users', userRoutes); // Rutas de usuarios (estudiantes y maestros)
    app.use('/api/courses', courseRoutes); // Rutas de cursos
};

// Inicializar servidor
export const initServer = () => {
    const app = express(); // Instancia de express
    try {
        configs(app);
        routes(app);
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    } catch (err) {
        console.error('Server init failed', err);
        process.exit(1); // Cerrar proceso en caso de error
    }
};
