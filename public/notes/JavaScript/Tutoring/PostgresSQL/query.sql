DROP TABLE IF EXISTS flavors;

CREATE TABLE flavors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some seed data:
INSERT INTO flavors (name, is_favorite) 
VALUES
('Chocolate', false),
('Vanilla', true),
('Strawberry', false);
