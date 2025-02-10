export const validateTeacherRole = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).send({ message: "Unauthorized: No token provided." });
        }

        if (req.user.role !== 'TEACHER_ROLE') {
            return res.status(403).send({ message: "Access denied. Only teachers can perform this action." });
        }

        next();
    } catch (error) {
        console.error("Error in validateTeacherRole middleware:", error);
        return res.status(500).send({ message: "Internal server error." });
    }
};

export const validateStudentRole = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).send({ message: "Unauthorized: No token provided." });
        }

        if (req.user.role !== 'STUDENT_ROLE') {
            return res.status(403).send({ message: "Access denied. Only students can perform this action." });
        }

        next();
    } catch (error) {
        console.error("Error in validateStudentRole middleware:", error);
        return res.status(500).send({ message: "Internal server error." });
    }
};
