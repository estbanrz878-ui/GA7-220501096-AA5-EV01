-- Creamos la base de datos para la API de autenticación.
CREATE DATABASE IF NOT EXISTS api_login;

-- Seleccionamos la base de datos.
USE api_login;

-- Creamos la tabla de usuarios.
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);