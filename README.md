# URBA Prode

Una app para jugar al prode con los torneos de la Unión de Rugby de Buenos Aires.
Cargás pronósticos fecha a fecha, competís en la tabla general y armás grupos
privados con amigos o con gente del club.

---

## Por qué

El fixture de la URBA tiene una particularidad: cuando dos clubes se enfrentan, no
juegan un partido sino varios el mismo sábado — Primera, Intermedia y Preintermedia
A, B y C.

Los prode que hay dando vueltas asumen un partido por cruce. Acá el modelo tiene que
representar varias categorías en simultáneo bajo la misma fecha, dejarte pronosticar
cada una por separado y mantener tablas de posiciones independientes.

---

## Qué hace

- **Pronósticos** por partido (local, empate o visitante), con cierre automático al
  horario de inicio de cada uno.
- **Grupos privados** con código de invitación para competir entre conocidos.
- **Tablas de posiciones** generales y por grupo.
- **Panel de administración** para cargar equipos, fechas, fixtures y resultados
  oficiales.

---

## Cómo se calculan los puntos

Cuando el administrador carga los resultados de una fecha, hay que recalcular los
puntos de todos los usuarios y rearmar las tablas. Eso no corre durante el request:
se encola y lo procesa un worker aparte con BullMQ, así la carga de resultados
responde al instante y, si algo falla en el medio, el trabajo se reintenta sin
perderse.

---

## Stack

**Backend**: Node.js, Express 5, PostgreSQL con Sequelize, Redis + BullMQ, Zod para
validación, tests con el runner nativo de Node.

**Frontend**: React 19 con Vite, Tailwind, React Router, Axios con manejo de refresh
token.

**Auth**: JWT en cookies HttpOnly, contraseñas con bcrypt, control de acceso por
roles.

---

## Estructura

Monorepo con dos paquetes:

- `prode-back/` — API REST, modelos, worker de puntos y tests
- `prode-front/` — SPA de React

---

## Correrlo local

### Requisitos
- Node.js 18+
- PostgreSQL
- Redis

### 1. Clonar e instalar
```bash
git clone https://github.com/Stefanopellegrinoo/prode.git
cd prode
npm run install:all
```

### 2. Configurar entorno
Copiar `prode-back/.env.example` a `prode-back/.env` y completar base de datos,
secretos JWT y Redis. Lo mismo con `prode-front/.env.example`.

### 3. Crear tablas y datos iniciales
```bash
npm run db:setup
```
Crea el esquema e inserta el torneo Top 12, los 12 equipos y usuarios de prueba.

### 4. Levantar todo
```bash
npm run dev
```
Levanta la API en `:3030`, el worker de puntos y el frontend en `:5173`.

---

## Tests

```bash
cd prode-back && npm test
```

Cubren hasheo y validación de contraseñas, control de acceso por roles, validación de
schemas y la lógica de asignación de puntos.

---

## Licencia

ISC