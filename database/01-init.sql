CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    phoneno VARCHAR(15),
    emailid VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255),
    auth_method VARCHAR(50) DEFAULT 'local', -- Indicates if the user signed up via 'local' or 'google'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
