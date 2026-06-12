-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios (profesores/administradores)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'profesor', 'estudiante')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de estudiantes
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de materias/cursos
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    professor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    semester INTEGER NOT NULL,
    year INTEGER NOT NULL,
    max_students INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de inscripción de estudiantes en cursos
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id)
);

-- Tabla de sesiones/clases
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    topic VARCHAR(255),
    is_closed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de asistencia
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('presente', 'ausente', 'tardanza', 'justificado')),
    notes TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    recorded_by UUID REFERENCES users(id),
    UNIQUE(session_id, student_id)
);

-- Tabla de justificantes
CREATE TABLE justifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attendance_id UUID UNIQUE REFERENCES attendance(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    reason VARCHAR(255) NOT NULL,
    document_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'aprobado', 'rechazado')),
    approved_by UUID REFERENCES users(id),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    UNIQUE(attendance_id)
);

-- Tabla de reportes de asistencia
CREATE TABLE attendance_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    total_sessions INTEGER DEFAULT 0,
    attended_sessions INTEGER DEFAULT 0,
    absent_sessions INTEGER DEFAULT 0,
    late_sessions INTEGER DEFAULT 0,
    justified_absences INTEGER DEFAULT 0,
    attendance_percentage NUMERIC(5, 2),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, student_id)
);

-- Índices para optimizar consultas
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_courses_professor_id ON courses(professor_id);
CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_sessions_course_id ON sessions(course_id);
CREATE INDEX idx_attendance_session_id ON attendance(session_id);
CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_justifications_student_id ON justifications(student_id);
CREATE INDEX idx_justifications_course_id ON justifications(course_id);
CREATE INDEX idx_reports_course_id ON attendance_reports(course_id);
CREATE INDEX idx_reports_student_id ON attendance_reports(student_id);

-- Crear usuario administrativo por defecto (opcional)
-- Password debe ser hasheada en la aplicación
-- INSERT INTO users (name, email, password_hash, role) 
-- VALUES ('Admin', 'admin@example.com', 'hash_aqui', 'admin');
