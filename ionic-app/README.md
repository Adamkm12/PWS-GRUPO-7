# CineApp - App Ionic (Sprint 4)

App móvil desarrollada con **Ionic + Angular** para gestionar un catálogo personal de películas. Incluye autenticación, listado de películas desde Firestore y datos locales por usuario.

## Stack tecnológico

| Tecnología | Uso |
|---|---|
| **Ionic + Angular** | Interfaz móvil y lógica de la app |
| **Firebase Authentication** | Registro y login de usuarios |
| **Firebase Firestore** | Catálogo de películas y perfiles |
| **Capacitor SQLite** | Favoritos, vistos y notas locales |

## Pantallas principales

### Registro (`/register`)
- Crea una cuenta de usuario.
- Guarda el perfil básico en Firebase.

### Login (`/login`)
- Autentica con email y contraseña.
- Redirige al catálogo de películas.

### Películas (`/peliculas`)
- Lista el catálogo de películas.
- Permite buscar, ordenar y filtrar.
- Muestra favoritos y películas vistas.

### Detalle (`/detalle/:id`)
- Muestra información completa de una película.
- Permite marcar como favorita, vista y guardar notas.

### Estadísticas (`/estadisticas`)
- Resume favoritos, vistas y progreso del usuario.

## Implementaciones de Adam

- Filtro por década en el listado de películas. Permite ver rápidamente películas de los 1990s, 2000s, 2010s, etc.
- Filtro de pendientes. Muestra solo películas que el usuario todavía no ha marcado como vistas.

## Instalación y ejecución

```bash
cd ionic-app
npm install
npx ng serve
```

Abrir `http://localhost:4200`.

## Firebase

- **Colección `peliculas`**: catálogo de películas.
- **Colección `users`**: perfiles de usuario.

## Datos locales

SQLite guarda favoritos, películas vistas y notas. En navegador se usa fallback con `localStorage`.
