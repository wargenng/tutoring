-- Drop tables if they exist (for a clean start)
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS departments;

-- Create departments table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Create employees table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    department_id INT NOT NULL REFERENCES departments(id)
);

-- (Optional) Insert some seed data
INSERT INTO departments (name) VALUES
  ('Human Resources'),
  ('Finance'),
  ('IT');

INSERT INTO employees (name, department_id) VALUES
  ('Alice', 1),
  ('Bob', 2),
  ('Charlie', 3);
