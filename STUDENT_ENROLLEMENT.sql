CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    image BYTEA,          -- Store image as binary data
    gender VARCHAR(50),
    skills VARCHAR(255)
);
--use pgadmin GUI