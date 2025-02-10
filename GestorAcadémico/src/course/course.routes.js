import { Router } from "express";
import {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    enrollStudentInCourse
} from "./course.controller.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";
import { validateTeacherRole, validateStudentRole } from "../../middlewares/validateRole.js";
import { createCourseValidator, updateCourseValidator } from "../../middlewares/validators.js";

const api = Router();

// Rutas públicas
api.get("/", getCourses); // Obtener todos los cursos
api.get("/:id", getCourseById); // Obtener un curso por ID

// Rutas protegidas para TEACHER_ROLE
api.post("/", [validateJwt, validateTeacherRole, createCourseValidator], createCourse); // Crear curso
api.put("/:id", [validateJwt, validateTeacherRole, updateCourseValidator], updateCourse); // Actualizar curso
api.delete("/:id", [validateJwt, validateTeacherRole], deleteCourse); // Eliminar curso

// Rutas protegidas para STUDENT_ROLE (Inscribirse en un curso)
api.post("/students/:studentId/courses/:courseId", [validateJwt, validateStudentRole], enrollStudentInCourse); // Inscribir estudiante en curso

export default api;
