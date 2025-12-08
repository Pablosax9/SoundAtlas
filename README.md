# 🎵 SoundAtlas

**SoundAtlas** es una aplicación web diseñada para el descubrimiento y la gestión musical. Combina la potencia de la **API de Deezer** con una base de datos relacional propia para ofrecer una experiencia personalizada donde los usuarios pueden explorar tendencias, gestionar listas de reproducción y analizar sus estadísticas.

![Estado](https://img.shields.io/badge/Status-Finalizado-success)
![Tecnologías](https://img.shields.io/badge/Stack-PHP%20%7C%20JS%20%7C%20MySQL-blue)

## 🚀 Características Principales

### 1. Exploración Musical (API Deezer)
* **Buscador en Tiempo Real:** Búsqueda instantánea de canciones, álbumes y artistas.
* **Secciones Dinámicas:**
    * **Descubrir:** Exploración por géneros musicales.
    * **Tendencias:** Top 10 mundial actualizado.
    * **Top Artistas:** Los artistas más escuchados del momento.
* **Reproductor:** Previsualización de audio (30 segundos) integrada en las tarjetas.

### 2. Gestión de Usuarios
* **Autenticación Segura:** Registro y Login con encriptación de contraseñas (`password_hash`).
* **Panel de Perfil:**
    * Estadísticas de uso (Contador animado de canciones y listas).
    * Edición de nombre de usuario y contraseña.
    * **Zona de Peligro:** Eliminación de cuenta con borrado en cascada de datos.
* **Modo Demo:** Acceso rápido con usuario invitado (Google Button Simulation).

### 3. Biblioteca Personal (CRUD Completo)
* **Listas de Reproducción:** Creación de carpetas personalizadas para organizar música.
* **Guardado Inteligente:** Ventana modal para elegir dónde guardar cada canción (Favoritos Generales o Listas específicas).
* **Gestión:** Visualización y eliminación de canciones guardadas.

## 🛠️ Tecnologías Utilizadas

* **Frontend:** HTML5, CSS3 (Grid/Flexbox), JavaScript (Vanilla ES6+, Fetch API).
* **Backend:** PHP 8 (Arquitectura API RESTful propia).
* **Base de Datos:** MySQL / MariaDB (Relacional).
* **Integración:** Deezer API (JSONP/CORS handled).
* **Herramientas:** Git, XAMPP.

## ⚙️ Instalación y Despliegue

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/Pablosax9/SoundAtlas.git](https://github.com/Pablosax9/SoundAtlas.git)
    ```

2.  **Servidor Web:**
    * Mueve la carpeta del proyecto a tu directorio público (ej: `htdocs` en XAMPP o `www` en WAMP).

3.  **Base de Datos:**
    * Abre phpMyAdmin y crea una base de datos llamada `soundatlas`.
    * Importa el archivo `soundatlas.sql` que encontrarás en la carpeta raíz del proyecto.

4.  **Configuración:**
    * Revisa el archivo `backend/config/db.php` y asegúrate de que las credenciales coinciden con las de tu servidor local.

5.  **¡Listo!**
    * Abre tu navegador en `http://localhost/SoundAtlas/index.html`.

## 📂 Estructura del Proyecto

```text
SoundAtlas/
├── backend/
│   ├── api/          # Endpoints PHP (Login, CRUD Listas, Stats, Deezer Proxy...)
│   └── config/       # Conexión a Base de Datos
├── frontend/
│   ├── css/          # Estilos (inicio.css, perfil.css, style.css)
│   ├── js/           # Lógica (api.js, perfil.js, app.js)
│   └── img/          # Logos y recursos
├── soundatlas.sql    # Script de importación de la BD
├── index.html        # Landing Page (Login/Registro)
├── inicio.html       # Aplicación Principal (Dashboard)
└── perfil.html       # Panel de Usuario y Configuración
```
## ✒️ Autor

**Pablo Rodríguez Crespo** -Alumno de 2º DAW IES Fernando Wirtz- _Pablosax9_

Proyecto desarrollado como trabajo final para el ciclo superior de Desarrollo de Aplicaciones Web (DAW).
