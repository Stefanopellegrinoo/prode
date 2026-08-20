# URBA Prode — Plataforma de Pronósticos de Rugby

Aplicación web full-stack para jugar al prode con los torneos de la **Unión de Rugby de Buenos Aires (URBA)**. Permite cargar pronósticos fecha a fecha, competir en tablas de posiciones generales y crear grupos privados con amigos o compañeros de club.

---

## 🏉 ¿Por qué este proyecto?

El fixture de la URBA tiene una particularidad: cuando dos clubes juegan entre sí (por ejemplo, *CASI vs. SIC*), no juegan un solo partido, sino que se disputan varias categorías el mismo sábado:
* Primera División
* Intermedia
* Preintermedia A, B y C

Diseñé este sistema para poder modelar esas categorías en simultáneo bajo una misma fecha, permitiendo pronosticar tanto la Primera como las intermedias y manteniendo tablas de posiciones independientes.

---

## ✨ Funcionalidades

* **Autenticación y Usuarios**: Registro e inicio de sesión con JWT almacenado en cookies `HttpOnly` y contraseñas hasheadas con bcrypt.
* **Pronósticos**: Carga de resultados (Local, Empate o Visitante) con cierre automático al horario de inicio de cada partido.
* **Grupos de Amigos**: Creación y unión a grupos privados con código para competir entre conocidos.
* **Recálculo de Puntos**: Procesamiento asíncrono con **BullMQ + Redis** para calcular puntos y posiciones en segundo plano cuando se cargan los resultados oficiales.
* **Panel de Administración**: Carga y edición de equipos, fechas, fixtures y resultados finales.

---

## 🛠️ Tecnologías Utilizadas

### Backend
* **Node.js** con **Express 5**
* **PostgreSQL** con **Sequelize ORM**
* **Redis** + **BullMQ** (cola de tareas para cálculo de puntos)
* **Zod** (validación de datos en endpoints)
* **Node.js Test Runner** (`node --test`) para pruebas unitarias

### Frontend
* **React 19** con **Vite**
* **Tailwind CSS v4**
* **React Router v7**
* **Axios** (cliente HTTP con manejo de refresh token)
* **Lucide React** & **Radix UI**

---

## 📁 Estructura del Proyecto

```
prode/
├── prode-back/          # Backend (API REST, base de datos y worker)
│   ├── src/
│   │   ├── config/      # Conexiones a DB, Redis y Supabase
│   │   ├── controller/  # Controladores de rutas
│   │   ├── middlewares/ # Autenticación, roles y rate limit
│   │   ├── models/      # Modelos de Sequelize
│   │   ├── repositories/# Consultas a la base de datos
│   │   ├── routes/      # Endpoints de la API
│   │   ├── services/    # Lógica de negocio
│   │   └── workers/     # Worker de BullMQ para cálculo de puntos
│   ├── tests/           # Tests unitarios
│   └── .env.example
│
├── prode-front/         # Frontend (React SPA)
│   ├── src/
│   │   ├── components/  # Componentes reutilizables
│   │   ├── context/     # Contextos de autenticación y tema
│   │   ├── pages/       # Vistas (Dashboard, Fixture, Grupos, Ranking)
│   │   └── services/    # Llamadas a la API
│   └── .env.example
│
├── package.json         # Scripts para correr el monorepo
└── README.md
```

---

## 🚀 Cómo correr el proyecto localmente

### 1. Prerrequisitos
* Node.js (v18 o superior)
* PostgreSQL
* Redis (local o mediante un servicio como Upstash)

### 2. Clonar el repositorio
```bash
git clone https://github.com/Stefanopellegrinoo/prode.git
cd prode
```

### 3. Instalación de dependencias
```bash
npm run install:all
```

### 4. Configurar Variables de Entorno
* **Backend**: copiar `prode-back/.env.example` a `prode-back/.env` y completar tu base de datos y Redis.
* **Frontend**: copiar `prode-front/.env.example` a `prode-front/.env`.

### 5. Crear Tablas y Cargar Datos Iniciales (Seed)
```bash
npm run db:setup
```
*Crea automáticamente todas las tablas en PostgreSQL e inserta subdivisiones, torneo Top 12, los 12 equipos y usuarios de prueba (Admin y Demo).*

### 6. Iniciar la aplicación
```bash
npm run dev
```
Este comando levanta concurrentemente en una sola terminal:
* 🌐 **API Backend**: `http://localhost:3030`
* ⚙️ **BullMQ Worker**: Procesamiento de puntos en segundo plano
* 🖥️ **Frontend Vite**: `http://localhost:5173`

*(O si preferís levantarlos por separado: `npm run dev:back`, `npm run dev:worker` y `npm run dev:front`)*

---

## 🧪 Tests

Para correr las pruebas unitarias del backend:
```bash
cd prode-back
npm test
```
Incluye pruebas para:
* Hasheo y validación de contraseñas
* Control de acceso y roles (RBAC)
* Validación de schemas (Zod)
* Lógica de grupos y asignación de puntos

---

## 📄 Licencia

Este proyecto está bajo licencia ISC.
