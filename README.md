# GA7-220501096-AA5-EV01

## Diseño y desarrollo de servicios web - caso

Proyecto de una API web de autenticación desarrollada con Node.js y Express, conectada a una base de datos MySQL.

## Funcionalidades

- Registro de usuarios.
- Almacenamiento seguro de contraseñas mediante hash con bcrypt.
- Inicio de sesión mediante usuario y contraseña.
- Validación de credenciales.
- Respuesta de autenticación satisfactoria cuando los datos son correctos.
- Respuesta de error cuando las credenciales son incorrectas.

## Tecnologías utilizadas

- Node.js
- Express
- MySQL
- mysql2
- bcrypt
- dotenv

## Base de datos

La estructura de la base de datos se encuentra en el archivo `database.sql`.

La base de datos utilizada es `api_login` y contiene la tabla `usuarios`.

## Configuración

Las credenciales de conexión a MySQL se configuran mediante variables de entorno en el archivo `.env`.

## Instalación

Ejecutar en la terminal:

```bash
npm install
