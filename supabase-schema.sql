-- Create tables for the appointment booking system

-- Users table (for Replit Auth)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY,
  email VARCHAR UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  device_brand VARCHAR(100) NOT NULL,
  device_model VARCHAR(100) NOT NULL,
  service_type VARCHAR(50) NOT NULL, -- 'basica' or 'premium'
  status VARCHAR(50) NOT NULL DEFAULT 'confirmado', -- confirmado, cancelado, concluido
  whatsapp_sent TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table (for Replit Auth)
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions (expire);

-- Insert a default admin user (password: admin123)
INSERT INTO admin_users (username, password_hash, role) 
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Enable Row Level Security (RLS) for security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to appointments (for booking form)
CREATE POLICY "Allow public insert on appointments" ON appointments
FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow public read on appointments" ON appointments
FOR SELECT TO anon, authenticated
USING (true);

-- Create policies for admin access
CREATE POLICY "Allow admin full access to appointments" ON appointments
FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow admin access to admin_users" ON admin_users
FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow admin access to users" ON users
FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public access to sessions" ON sessions
FOR ALL TO anon, authenticated
USING (true)
WITH CHECK (true);