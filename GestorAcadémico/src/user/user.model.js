import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
        maxLength: [55, 'El máximo de caracteres es de 55']
    },
    surname: {
        type: String,
        required: [true, 'El apellido es requerido'],
        maxLength: [25, 'El máximo de caracteres es de 25']
    },
    username: {
        type: String,
        required: [true, 'El nombre de usuario es requerido'],
        maxLength: [15, 'El máximo de caracteres es de 15'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'El correo electrónico es requerido'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minLength: [8, 'La contraseña debe tener al menos 8 caracteres'],
        maxLength: [100, 'El máximo de caracteres es de 100']
    },
    role: {
        type: String,
        required: [true, 'El rol es requerido'],
        enum: ['TEACHER_ROLE', 'STUDENT_ROLE']
    },
    courses: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }],
        validate: {
            validator: function (courses) {
                if (this.role === 'STUDENT_ROLE') {
                    return courses.length <= 3;
                }
                return courses.length === 0; // Un maestro no debería tener cursos asignados en esta lista
            },
            message: function (props) {
                return this.role === 'STUDENT_ROLE' 
                    ? 'Un estudiante no puede estar en más de 3 cursos.' 
                    : 'Un maestro no puede estar inscrito en cursos.';
            }
        },
        default: [] // Asegurar que siempre exista el campo como array vacío si no se usa
    }
}, { timestamps: true });

// Modificar el toJSON -> toObject para excluir datos en la respuesta
userSchema.methods.toJSON = function () {
    const { __v, password, ...user } = this.toObject();
    return user;
};

export default mongoose.model('User', userSchema);
