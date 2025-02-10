import { body } from "express-validator";
import { validateErrors } from "./validate.errors.js";
import { existEmail, existUsername } from "../utils/db.validators.js";

// Validaciones para registro de usuario (estudiantes y maestros)
export const registerValidator = [
    body('name', 'Name cannot be empty')
        .notEmpty(),
    body('surname', 'Surname cannot be empty')
        .notEmpty(),
    body('username', 'Username cannot be empty')
        .notEmpty()
        .toLowerCase(),
    body('email', 'Email cannot be empty')
        .notEmpty()
        .isEmail()
        .custom(existEmail),
    body('username')
        .notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('Password must be strong')
        .isLength({ min: 8 })
        .withMessage('Password needs at least 8 characters'),
    body('phone', 'Phone cannot be empty').notEmpty().isMobilePhone(),
    body('role', 'Role is required').notEmpty().isIn(['STUDENT_ROLE', 'TEACHER_ROLE']),
    validateErrors
];

// Validaciones para actualizar usuario (sin cambiar contraseña directamente)
export const updateUserValidators = [
    body('username').optional().notEmpty().toLowerCase().custom((username, { req }) => existUsername(username, req.user)),
    body('email').optional().notEmpty().isEmail().custom((email, { req }) => existEmail(email, req.user)),
    validateErrors
];

// Validaciones para actualizar contraseña
export const updatePasswordValidator = [
    body('currentPassword', 'Current password is required').notEmpty(),
    body('newPassword', 'New password is required')
        .notEmpty()
        .isStrongPassword().withMessage('New password must be strong')
        .isLength({ min: 8 }).withMessage('New password needs at least 8 characters'),
    validateErrors
];

// Validaciones para crear un curso (solo TEACHER_ROLE)
export const createCourseValidator = [
    body("name", "Course name is required").notEmpty().trim(),
    body("description").optional().trim(),
    validateErrors
];

// Validaciones para actualizar un curso (solo TEACHER_ROLE)
export const updateCourseValidator = [
    body("name").optional().notEmpty().trim(),
    body("description").optional().trim(),
    validateErrors
];
