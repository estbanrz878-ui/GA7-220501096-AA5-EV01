// Importamos las librerías necesarias.
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Creamos la aplicación de Express.
const app = express();

// Permitimos recibir información en formato JSON.
app.use(express.json());

// Puerto donde funcionará nuestro servidor.
const PORT = 3000;

// Creamos el grupo de conexiones con MySQL.
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Ruta principal para comprobar que la API funciona.
app.get('/', (req, res) => {
    res.json({
        mensaje: 'API de autenticación funcionando correctamente'
    });
});

// Comprobamos la conexión con la base de datos.
async function probarConexion() {
    try {
        await pool.query('SELECT 1');
        console.log('Conexión con MySQL establecida correctamente.');
    } catch (error) {
        console.error('Error al conectar con MySQL:', error.message);
    }
}

probarConexion();

// Ruta para registrar un nuevo usuario.
app.post('/api/registro', async (req, res) => {
    try {
        // Obtenemos el usuario y la contraseña enviados por el cliente.
        const { usuario, password } = req.body;

        // Verificamos que los datos requeridos hayan sido enviados.
        if (!usuario || !password) {
            return res.status(400).json({
                error: 'El usuario y la contraseña son obligatorios.'
            });
        }

        // Encriptamos la contraseña antes de almacenarla.
        const bcrypt = require('bcrypt');
        const passwordHash = await bcrypt.hash(password, 10);

        // Guardamos el usuario y la contraseña protegida en MySQL.
        await pool.execute(
            'INSERT INTO usuarios (usuario, password) VALUES (?, ?)',
            [usuario, passwordHash]
        );

        // Respondemos indicando que el registro fue exitoso.
        res.status(201).json({
            mensaje: 'Usuario registrado correctamente.'
        });

    } catch (error) {
        // Controlamos el caso en que el usuario ya exista.
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                error: 'El usuario ya existe.'
            });
        }

        // Mostramos cualquier otro error del servidor.
        console.error('Error en el registro:', error.message);

        res.status(500).json({
            error: 'Error interno del servidor.'
        });
    }
});

// Ruta para iniciar sesión y verificar las credenciales.
app.post('/api/login', async (req, res) => {
    try {
        // Obtenemos el usuario y la contraseña enviados.
        const { usuario, password } = req.body;

        // Verificamos que los datos requeridos hayan sido enviados.
        if (!usuario || !password) {
            return res.status(400).json({
                error: 'El usuario y la contraseña son obligatorios.'
            });
        }

        // Buscamos el usuario en la base de datos.
        const [usuarios] = await pool.execute(
            'SELECT * FROM usuarios WHERE usuario = ?',
            [usuario]
        );

        // Si el usuario no existe, rechazamos la autenticación.
        if (usuarios.length === 0) {
            return res.status(401).json({
                error: 'Error en la autenticación.'
            });
        }

        // Obtenemos la contraseña protegida almacenada en MySQL.
        const usuarioEncontrado = usuarios[0];

        // Comparamos la contraseña recibida con el hash almacenado.
        const passwordCorrecta = await bcrypt.compare(
            password,
            usuarioEncontrado.password
        );

        // Si la contraseña no coincide, rechazamos el acceso.
        if (!passwordCorrecta) {
            return res.status(401).json({
                error: 'Error en la autenticación.'
            });
        }

        // Si las credenciales son correctas, confirmamos la autenticación.
        res.status(200).json({
            mensaje: 'Autenticación satisfactoria.'
        });

    } catch (error) {
        // Controlamos errores inesperados del servidor.
        console.error('Error en el login:', error.message);

        res.status(500).json({
            error: 'Error interno del servidor.'
        });
    }
});

// Iniciamos el servidor.
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});