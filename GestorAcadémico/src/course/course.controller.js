import Course from '../course/course.model.js';
import User from '../user/user.model.js';

/**
 * @desc Obtener todos los cursos
 * @route GET /api/courses
 */
export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('teacher', 'name').populate('students', 'name');
        return res.json({ success: true, courses });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching courses', error });
    }
};

/**
 * @desc Obtener un curso por ID
 * @route GET /api/courses/:id
 */
export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('teacher', 'name').populate('students', 'name');
        if (!course) return res.status(404).json({ message: 'Course not found' });
        return res.json({ success: true, course });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching course', error });
    }
};

/**
 * @desc Crear un curso (solo para maestros)
 * @route POST /api/courses
 */
export const createCourse = async (req, res) => {
    try {
        if (req.user.role !== 'TEACHER_ROLE') {
            return res.status(403).json({ message: 'Only teachers can create courses' });
        }
        
        const { name, description } = req.body;
        const newCourse = new Course({
            name,
            description,
            teacher: req.user.uid
        });
        
        await newCourse.save();
        return res.status(201).json({ success: true, message: 'Course created successfully', course: newCourse });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error creating course', error });
    }
};

/**
 * @desc Actualizar un curso (solo el profesor dueño)
 * @route PUT /api/courses/:id
 */
export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);

        if (!course) return res.status(404).json({ message: 'Course not found' });
        if (course.teacher.toString() !== req.user.uid) {
            return res.status(403).json({ message: 'Only the owner teacher can update this course' });
        }

        const updatedCourse = await Course.findByIdAndUpdate(id, req.body, { new: true });
        return res.json({ success: true, message: 'Course updated successfully', course: updatedCourse });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating course', error });
    }
};

/**
 * @desc Eliminar un curso (y desasignar estudiantes)
 * @route DELETE /api/courses/:id
 */
export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);

        if (!course) return res.status(404).json({ message: 'Course not found' });
        if (course.teacher.toString() !== req.user.uid) {
            return res.status(403).json({ message: 'Only the owner teacher can delete this course' });
        }

        // Desasignar curso de los estudiantes
        await User.updateMany({ _id: { $in: course.students } }, { $pull: { courses: id } });
        await Course.findByIdAndDelete(id);

        return res.json({ success: true, message: 'Course deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error deleting course', error });
    }
};


export const enrollStudentInCourse = async (req, res) => {
    try {
        const { studentId, courseId } = req.params;

        // Verificar si el usuario es un estudiante
        const student = await User.findById(studentId);
        if (!student || student.role !== 'STUDENT_ROLE') {
            return res.status(400).json({ message: 'Only students can enroll in courses' });
        }

        // Verificar si el curso existe
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Verificar si el estudiante ya está en el curso
        if (course.students.includes(studentId)) {
            return res.status(400).json({ message: 'Student is already enrolled in this course' });
        }

        // Agregar estudiante al curso
        course.students.push(studentId);
        await course.save();

        // Agregar el curso a la lista de cursos del estudiante
        student.courses.push(courseId);
        await student.save();

        return res.status(200).json({
            success: true,
            message: 'Student enrolled successfully',
            course
        });
    } catch (error) {
        console.error('Error enrolling student:', error);
        return res.status(500).json({ message: 'Error enrolling student', error });
    }
};
