# 🏉 Especificación Funcional y de Diseño UI/UX — URBA Prode

> **Documento de Requerimientos de Diseño de Interfaz y Experiencia de Usuario**  
> **Destinatario**: Equipo de Diseño UI/UX & Producto  
> **Proyecto**: Prode de Rugby URBA (Unión de Rugby de Buenos Aires)  
> **Fecha de creación**: 2026-08-18  

---

## 1. Visión General del Producto y Contexto del Dominio

**URBA Prode** es una plataforma web orientada a fanáticos, jugadores y clubes de rugby que compiten pronosticando los resultados de los torneos organizados por la **Unión de Rugby de Buenos Aires (URBA)** (ej. *Top 12*, *Primera A*, *Primera B*, etc.).

### 🏉 Particularidades Críticas del Rugby URBA
A diferencia del fútbol u otros deportes:
1. **Jornadas de Clubes Multicategoría**: Cuando dos clubes se enfrentan un sábado (por ejemplo, *CASI vs. SIC* o *Belgrano vs. Alumni*), se disputan partidos consecutivos en **múltiples subdivisiones** ese mismo día:
   * **Primera División**
   * **Intermedia**
   * **Preintermedia A (Pre A)**
   * **Preintermedia B (Pre B)**
   * **Preintermedia C (Pre C)**
2. **Sistema de Puntos**: 
   * **3 puntos** por acertar el ganador del encuentro (`Local`, `Empate` o `Visitante`).
   * **0 puntos** en caso de fallo.
   * Cierre automático de pronósticos al horario de inicio del partido.
3. **Comunidad y Grupos de Amigos**: Los usuarios compiten tanto en una **Tabla General Global** como en **Grupos Privados** con amigos/compañeros de club mediante códigos de invitación.

### 🎨 Requerimientos de Identidad y Estilo
* **Temática**: Rugby tradicional, moderno, competitivo y dinámico.
* **Modos**: Soporte completo para **Light Mode** y **Dark Mode**.
* **Diseño Mobile-First & Responsive**: El 80% del uso ocurre desde smartphones los días de partido (sábados).
* **Feedback Inmediato**: Estados claros de acierto/desacierto, puntos ganados y badges de estado en vivo.

---

## 2. Arquitectura de Información y Layout Global

### 2.1 Estructura de Navegación y Roles
```
Prode URBA
├── 🔓 Rutas Públicas (Sin sesión)
│   ├── Login / Iniciar Sesión (/) (/login)
│   └── Registro de Usuario (/register)
│
├── 🔒 Rutas Protegidas (Usuario Autenticado)
│   ├── Dashboard Principal (/dashboard)
│   ├── Pronósticos & Fixture (/predictions y /match/:tournamentId)
│   ├── Grupos y Comunidad (/groups y /groups/:groupId)
│   ├── Rankings & Posiciones (/ranking y /ranking/:tournamentId)
│   └── Perfil de Usuario (/profile)
│
└── 🛡️ Rutas de Administrador (Role: admin)
    └── Panel de Administración de Fixture (/admin/fixture)
        ├── Tab Torneos
        ├── Tab Subdivisiones
        ├── Tab Equipos y Escudos
        └── Tab Partidos y Carga de Resultados
```

### 2.2 Shell de la Aplicación (Layout Base)
1. **Sidebar / Barra Lateral**:
   * **Desktop**: Fija a la izquierda (ancho ~260px).
   * **Mobile**: Drawer colapsable con botón hamburguesa o Bottom Navigation Bar para acceso rápido con el pulgar.
   * **Contenido**: Logo del prode, avatar + nombre + email del usuario actual, links de navegación con íconos, switch de Light/Dark mode y botón de Cerrar Sesión.
2. **Header Superior**:
   * Título de la sección actual, breadcrumb o botón de retroceso (`Volver`), selector de tema y campana de notificaciones.
3. **Área de Contenido Central**:
   * Grid fluido con scroll independiente y espaciado consistente (`p-4` a `p-8`).

---

## 3. Catálogo Detallado de Pantallas

---

### Pantalla 01: Iniciar Sesión (Login)
* **Ruta**: `/login` (o `/` si no hay sesión activa).
* **Acceso**: Público (redirecciona a `/dashboard` si ya está logueado).
* **Objetivo**: Permitir al usuario ingresar a su cuenta de forma rápida y segura.

#### 📦 Elementos y Componentes a Mostrar:
* **Branding / Hero Lateral**: Imagen o ilustración alegórica al rugby de la URBA, claim del producto ("Viví el rugby de la URBA minuto a minuto").
* **Card de Autenticación**:
  * Título ("¡Bienvenido de vuelta!") y subtítulo motivacional.
  * **Campo de Entrada 1**: Nombre de Usuario o Correo Electrónico (con icono y validación en vivo).
  * **Campo de Entrada 2**: Contraseña (con botón de toggle para mostrar/ocultar contraseña).
  * **Recordar sesión / Olvidé mi contraseña** (link de recuperación).
  * **Botón Principal (CTA)**: "Iniciar Sesión" (con estado spinner al enviar).
  * **Link secundario**: "¿No tenés una cuenta? Registrate acá".
* **Mensajes de Error**: Banner flotante o toast en caso de credenciales inválidas.

---

### Pantalla 02: Registro de Usuario (Register)
* **Ruta**: `/register`
* **Acceso**: Público.
* **Objetivo**: Crear una nueva cuenta de usuario en menos de 1 minuto.

#### 📦 Elementos y Componentes a Mostrar:
* **Formulario de Registro**:
  * **Nombre Completo**: Ej. "Juan Pérez".
  * **Nombre de Usuario (Username)**: Único en la plataforma, sin espacios (ej. "juanperez10").
  * **Email**: Con validación de formato.
  * **Contraseña**: Indicador visual de fortaleza (mínimo 8 caracteres, números, símbolos).
  * **Confirmación de Contraseña**: Validación de coincidencia en tiempo real.
* **Checkbox de Términos y Condiciones**.
* **Botón Principal**: "Crear Cuenta".
* **Link a Login**: "¿Ya tenés cuenta? Iniciar Sesión".

---

### Pantalla 03: Dashboard Principal (Inicio)
* **Ruta**: `/dashboard`
* **Acceso**: Protegido (Usuarios y Admins).
* **Objetivo**: Centro de comando diario del usuario. Brinda un resumen de su desempeño, próximos partidos a pronosticar y actividad reciente.

#### 📦 Elementos y Componentes a Mostrar:
1. **Banner de Bienvenida**:
   * Saludo personalizado ("¡Hola, [Nombre]! 🏉").
   * Fecha actual y recordatorio si hay partidos próximos a comenzar sin pronóstico cargado.
2. **Tarjeta de Estadísticas del Usuario (User Stats Card)**:
   * **Puntos Totales Acumulados** (número destacado grande).
   * **Posición Global Actual** (ej. "#4 en Top 12").
   * **Efectividad / Aciertos** (porcentaje o ratio de aciertos sobre partidos jugados).
   * **Grupos Activos** (cantidad de grupos a los que pertenece).
3. **Tarjeta de Próximos Partidos (Upcoming Matches Card)**:
   * Lista de partidos más cercanos en el tiempo (próximo fin de semana).
   * Para cada partido: Escudos de ambos equipos, nombres, torneo, subdivisión, fecha/hora y **badge indicador**:
     * 🟢 *Pronosticado* (muestra la elección del usuario).
     * 🟡 *Pendiente* (alerta para no olvidarse de jugar).
     * 🔴 *Cerrado* (partido en juego o finalizado).
   * Botón de acción rápida: "Completar Pronósticos".
4. **Tarjeta de Resultados Recientes (Recent Results)**:
   * Últimos partidos finalizados con marcador oficial y feedback visual si el usuario sumó +3 pts o +0 pts.
5. **Feed de Notificaciones / Novedades**:
   * Avisos de apertura de nuevas fechas, cierres de pronósticos y cambios en las tablas de posiciones.

---

### Pantalla 04: Selector de Torneos para Pronósticos (Predictions Hub)
* **Ruta**: `/predictions`
* **Acceso**: Protegido.
* **Objetivo**: Permitir al usuario elegir qué torneo de la URBA desea pronosticar.

#### 📦 Elementos y Componentes a Mostrar:
* **Barra de Búsqueda y Filtros**: Buscar torneos por nombre (ej. "Top 12", "Primera A", "Reubicación").
* **Grid de Tarjetas de Torneo**:
  * Título del Torneo y Temporada (ej. "URBA Top 12 - 2026").
  * Descripción breve y cantidad de subdivisiones incluidas.
  * Cantidad de partidos pendientes de pronóstico en la fecha actual.
  * **Botón de Acción**: "Ingresar al Fixture / Pronosticar".

---

### Pantalla 05: Fixture y Carga de Pronósticos por Torneo
* **Ruta**: `/match/:tournamentId`
* **Acceso**: Protegido.
* **Objetivo**: La pantalla más interactiva y utilizada del producto. Permite navegar las fechas del torneo, cambiar entre subdivisiones (Primera, Intermedia, etc.) y cargar/modificar pronósticos.

#### 📦 Elementos y Componentes a Mostrar:
1. **Cabecera del Torneo**:
   * Botón "Volver a Torneos", nombre del torneo y badge de temporada.
2. **Navegación de Subdivisiones (Tabs Superiores)**:
   * Pestañas horizontales scrolleables en mobile: `[ Primera ]` `[ Intermedia ]` `[ Pre A ]` `[ Pre B ]` `[ Pre C ]`.
3. **Selector / Acordeón de Fechas (Jornadas)**:
   * Selector de fecha: "Fecha 1", "Fecha 2", ..., "Fecha 22", "Semifinales", "Final".
   * Indicador de estado de la fecha ("En curso", "Próxima", "Finalizada").
4. **Lista de Tarjetas de Partido (Match Card)**:
   * Cada tarjeta debe contener:
     * **Fecha y Hora del Partido** (ej. "Sáb 22 Ago - 15:30 hs").
     * **Equipo Local**: Escudo oficial, Nombre completo.
     * **Equipo Visitante**: Escudo oficial, Nombre completo.
     * **Marcador Oficial** (si el partido ya comenzó o finalizó).
     * **Selector de Pronóstico Interactivo (3 Opciones)**:
       * Botón `[ Gana Local ]` | `[ Empate ]` | `[ Gana Visitante ]`
       * Estado seleccionado claramente visible (resaltado con color primario).
       * Si el partido ya comenzó (`new Date() >= match.date`), los botones se bloquean (modo lectura).
     * **Badge de Resultado del Pronóstico** (post-partido):
       * ✅ *+3 Puntos* (Fondo verde suave si acertó el ganador).
       * ❌ *0 Puntos* (Fondo rojo/gris suave si no acertó).
5. **Barra Flotante de Guardado (Sticky Bottom Bar en Mobile)**:
   * Resumen de cambios pendientes: "Tenés 3 pronósticos sin guardar".
   * Botón "Guardar Todos los Pronósticos" con feedback visual inmediato.

---

### Pantalla 06: Mis Grupos y Comunidad (Groups Hub)
* **Ruta**: `/groups`
* **Acceso**: Protegido.
* **Objetivo**: Gestionar la participación en torneos privados entre amigos o peñas de club.

#### 📦 Elementos y Componentes a Mostrar:
1. **Barra de Acciones Superiores**:
   * Contador de grupos: "Participás en **X** grupos".
   * Botón `[ + Crear Grupo ]` (Abre modal).
   * Botón `[ 🔑 Unirse con Código ]` (Abre modal).
2. **Grid de Tarjetas de Grupo (Group Cards)**:
   * Nombre del Grupo (ej. "Los Pumas de Newman", "Camada 98").
   * Descripción breve.
   * Cantidad de miembros (ej. "14 participantes").
   * Torneos en los que compite el grupo (badges de torneos).
   * Posición actual del usuario dentro de ese grupo (ej. "Tu posición: #2").
   * Botón para ingresar al detalle del grupo.
3. **Empty State (Si no tiene grupos)**:
   * Ilustración amigable, texto explicativo sobre cómo invitar amigos y botones directos para crear o unirse.
4. **Modales Asociados**:
   * **Modal "Crear Grupo"**: Input para Nombre, Textarea para Descripción, Selector múltiple de Torneos participantes (checkboxes) y botón "Crear".
   * **Modal "Unirse a Grupo"**: Input para ingresar el código alfanumérico de 6 caracteres (ej. `URBA26`) y botón "Unirme".

---

### Pantalla 07: Detalle de Grupo y Tabla de Posiciones Interna
* **Ruta**: `/groups/:groupId`
* **Acceso**: Protegido (solo para miembros del grupo).
* **Objetivo**: Ver el ranking exclusivo entre los miembros del grupo, compartir el código de invitación y gestionar el grupo si es el creador.

#### 📦 Elementos y Componentes a Mostrar:
1. **Encabezado del Grupo**:
   * Nombre del grupo y descripción (editable en línea si el usuario es el Creador/Admin).
   * Creado por: Avatar y nombre del administrador del grupo.
   * **Caja de Código de Invitación**:
     * Muestra el código en tipografía monoespaciada grande (`A3K9XZ`).
     * Botón "Copiar Código" y botón "Compartir por WhatsApp".
   * Botón "Abandonar Grupo" (con diálogo de confirmación).
2. **Navegación por Torneo y Subdivisión**:
   * Tabs de Torneos asociados al grupo (`Top 12`, `Primera A`).
   * Sub-tabs de Categorías (`Primera`, `Intermedia`, etc.).
3. **Buscador de Miembros**:
   * Input para filtrar usuarios por nombre dentro de la tabla.
4. **Tabla de Posiciones del Grupo (Leaderboard)**:
   * Columnas: `Posición`, `Jugador (Avatar + Nombre)`, `Puntos Totales`.
   * **Destacados visuales**:
     * 🥇 1° Puesto: Icono de Copa dorada y fila destacada en dorado/ámbar.
     * 🥈 2° Puesto: Plata.
     * 🥉 3° Puesto: Bronce.
     * **Fila del usuario actual**: Resaltada con borde o fondo sutil para rápida localización.
   * Si es Administrador del Grupo: Botón en cada fila para expulsar a un miembro del grupo con confirmación.

---

### Pantalla 08: Selector de Torneos para Ranking Global
* **Ruta**: `/ranking`
* **Acceso**: Protegido.
* **Objetivo**: Permitir al usuario seleccionar qué torneo general desea consultar para ver el leaderboard de todos los participantes de la plataforma.

#### 📦 Elementos y Componentes a Mostrar:
* Buscador de Torneos.
* Tarjetas con nombre del torneo, temporada y botón "Ver Tabla General".

---

### Pantalla 09: Tabla de Posiciones Global (Leaderboard General)
* **Ruta**: `/ranking/:tournamentId`
* **Acceso**: Protegido.
* **Objetivo**: Ranking general y transparente de toda la comunidad en un torneo y subdivisión específicos.

#### 📦 Elementos y Componentes a Mostrar:
1. **Cabecera**:
   * Título del Torneo y botón de volver.
2. **Tabs de Subdivisiones**:
   * `[ Primera ]` `[ Intermedia ]` `[ Pre A ]` `[ Pre B ]` `[ Pre C ]`.
3. **Buscador de Jugadores**:
   * Input con icono de lupa para buscar por username o nombre en la tabla.
4. **Tabla / Lista de Posiciones Global**:
   * `Posición` (1, 2, 3... N con medallas en el podio).
   * `Avatar & Usuario` (con inicial o foto).
   * `Puntos Totales`.
5. **Sticky User Position (En mobile)**:
   * Barra flotante inferior fija que muestra la posición y puntos del usuario actual si está ubicado más abajo en la lista, permitiendo hacer tap para scrollear automáticamente hasta su posición.

---

### Pantalla 10: Perfil de Usuario y Configuración de Cuenta
* **Ruta**: `/profile`
* **Acceso**: Protegido.
* **Objetivo**: Editar datos personales, cambiar contraseña y ver estadísticas históricas.

#### 📦 Elementos y Componentes a Mostrar:
1. **Tarjeta de Información Personal**:
   * Avatar del usuario con botón para cambiar avatar/foto.
   * Campos editables: Nombre Completo, Nombre de Usuario, Correo Electrónico.
   * Botón "Guardar Cambios de Perfil".
2. **Tarjeta de Seguridad y Contraseña**:
   * Campo: Contraseña Actual.
   * Campo: Nueva Contraseña.
   * Campo: Confirmar Nueva Contraseña.
   * Botón "Actualizar Contraseña".
3. **Tarjeta de Resumen de Desempeño Histórico**:
   * Total de pronósticos realizados.
   * Total de puntos acumulados en todas las temporadas.
   * Porcentaje de efectividad global.
   * Torneo con mejor rendimiento.

---

### Pantalla 11: Panel de Administración de Fixtures y Torneos (Admin Hub)
* **Ruta**: `/admin/fixture`
* **Acceso**: Exclusivo para Administradores (`role === 'admin'`).
* **Objetivo**: Centro integral de control de datos maestros de la URBA, gestión de clubes, generación de fixtures y actualización de tanteadores oficiales.

#### 📦 Estructura en 4 Pestañas y sus Formularios/Modales:

#### 11.1 Pestaña "Torneos" (Tournaments Admin):
* **Vista Principal**: Tabla con columnas `Nombre del Torneo`, `Temporada`, `Descripción`, `Subdivisiones Asociadas` y columna de `Acciones` (Editar, Eliminar).
* **Modal / Formulario `TournamentForm`**:
  * Input: Nombre del Torneo (ej. "Top 12", "Primera A").
  * Input: Temporada / Año (ej. "2026").
  * Textarea: Descripción y formato del torneo.
  * Selector múltiple: Subdivisiones habilitadas para este torneo (checkboxes).
  * Botones: "Guardar Torneo" y "Cancelar".

#### 11.2 Pestaña "Subdivisiones" (Subdivisions Admin):
* **Vista Principal**: Listado y tabla de categorías de rugby (Primera, Intermedia, Pre A, Pre B, Pre C).
* **Modal / Formulario `SubdivisionForm`**:
  * Input: Nombre de la subdivisión.
  * Botón de guardado rápido.

#### 11.3 Pestaña "Equipos y Clubes" (Teams Admin):
* **Vista Principal**: Grid o tabla con tarjetas de clubes de la URBA (CASI, SIC, Newman, Belgrano, Hindú, CUBA, Alumni, etc.).
* **Datos por Club**: Escudo actual, Nombre Completo, Nombre Corto / Sigla, Torneo al que pertenece.
* **Modal / Formulario `TeamForm`**:
  * Inputs: Nombre completo, Nombre abreviado y Torneo asignado.
* **Componente `UploadTeamLogo` (Uploader a Supabase)**:
  * Zona Drag & Drop para subir imagen PNG/SVG/WEBP del escudo oficial.
  * Preview inmediata de la imagen recortada antes de confirmar subida.

#### 11.4 Pestaña "Fixture, Partidos y Resultados" (Matches Admin):
* **Filtros Superiores**: Selector de Torneo, Subdivisión y selector de Fecha/Jornada.
* **Barra de Herramientas de Carga**:
  * Botón `[ + Crear Partido Individual ]` (Abre `MatchForm`).
  * Botón `[ ⚡ Generar Fixture Automático ]` (Abre `FixtureGeneratorForm` para crear todas las fechas por round-robin).
  * Botón `[ 📂 Importar Fixture ]` (Abre `ImportFixtureForm` para carga masiva vía JSON o planilla).
* **Modal / Formulario `MatchForm`**:
  * Selectores: Equipo Local, Equipo Visitante, Torneo, Fecha y Hora del partido.
  * *Nota de regla URBA*: Al guardar un partido, el sistema replica automáticamente el emparejamiento para todas las subdivisiones activas del club ese sábado.
* **Carga y Edición de Resultados Oficiales en Vivo**:
  * Inputs para tanteador numérico: Puntos Local vs. Puntos Visitante.
  * Selector de Ganador Oficial: `Local` | `Empate` | `Visitante`.
  * Selector de Estado: `UPCOMING` | `LIVE` | `FINISHED`.
  * Botón destacado `[ Guardar Resultado y Calcular Puntos ]` (Dispara el worker de BullMQ para asignación masiva de puntos a los usuarios).

---

## 4. Guía de Componentes Clave y Estados de UI

### 4.1 Tarjeta de Partido (Match Card) — Estados Requeridos
| Estado | Características Visuales | Interacción |
| :--- | :--- | :--- |
| **Próximo (Sin pronóstico)** | Bordes neutros, badge gris "Por jugar". | Botones Local / Empate / Visitante habilitados y listos para seleccionar. |
| **Próximo (Con pronóstico)** | Borde con acento sutil, opción elegida resaltada en color primario. | Permite cambiar la selección hasta la hora de inicio. |
| **En Juego (Live)** | Badge parpadeante rojo/verde "EN VIVO", tanteador en tiempo real. | Bloqueado para cambios. |
| **Finalizado (Acierto)** | Fondo con tinte verde suave, badge "+3 PUNTOS", resultado oficial visible. | Solo lectura. |
| **Finalizado (Fallo)** | Fondo neutro/gris, badge "0 PUNTOS", resultado oficial visible. | Solo lectura. |

### 4.2 Estados de Carga y Vacíos (Loaders & Empty States)
* **Skeletons**: Diseñar versiones pulsantes para tarjetas de partido, filas de tablas y widgets del dashboard mientras se obtienen datos de la API.
* **Empty States**: Ilustraciones vectoriales temáticas con copys claros y botones de acción primaria (ej. "Aún no hay partidos cargados para esta fecha", "No pertenecés a ningún grupo todavía").
* **Feedback Toasts**: Notificaciones flotantes superiores con 4 variantes: Éxito (verde), Error (rojo), Advertencia (amarillo) e Información (azul).

---

## 5. Resumen de Entregables Esperados para el Diseñador

1. **Design System & UI Kit**:
   * Paleta cromática (Primario, Secundario, Acentos, Superficies en Dark y Light mode).
   * Escala tipográfica accesible y jerarquía de títulos.
   * Set de componentes (Botones, Inputs, Tabs, Modales, Badges, Cards, Tablas).
2. **Flujos de Pantallas en Figma / Sketch**:
   * Flujo de Usuario Regular (Login -> Dashboard -> Pronósticos -> Fixture -> Grupos -> Leaderboards).
   * Flujo de Administrador (Panel de Control -> Carga de Fixtures -> Carga de Resultados).
3. **Diseño Responsive Completo**:
   * Vistas en Mobile (375px / 414px) y Desktop (1280px / 1440px+).

---
*Fin del documento de especificación.*
