# 🏠 Patitos del Retiro – Sistema de Gestión para Asilo de Ancianos

Patitos del Retiro es un sistema web moderno diseñado para gestionar procesos en un asilo de ancianos de manera eficiente, intuitiva y escalable.

---

## 🚀 Tecnologías utilizadas

- Next.js (App Router)
- React
- TypeScript
- TailwindCSS
- NestJS
- Prisma
- SQL Server Express

---

## 🧩 Requisitos previos

Antes de ejecutar el proyecto asegúrate de tener instalado:

- Node.js (v18 o superior)
- npm
- SQL Server Express

Puedes verificar tu versión con:

```bash
node -v
npm -v
```

## ⚙️ Instalación y ejecución

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/xJeffx23/ShopEasy.git
```

### 2️⃣ Configurar la base de datos

Importa el esquema desde `database/MSSQL_SERVER_Express/01_SCHEMA_PATITOS_RETIRADOS.sql` y los datos desde `02_DATA_PATITOS_RETIRADOS.sql`.

### 3️⃣ Instalar dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4️⃣ Configurar variables de entorno

Crea un archivo `.env` en `backend/` con:
```
DATABASE_URL="sqlserver://localhost:1433;database=Patitos_del_Retiro_DB;trustServerCertificate=true"
JWT_SECRET=tu_jwt_secret
```

### 5️⃣ Ejecutar el backend

```bash
cd backend
npm run start:dev
```

### 6️⃣ Ejecutar el frontend

En otra terminal:

```bash
cd frontend
npm run dev
```

### 7️⃣ Abrir en el navegador

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- Documentación Swagger: http://localhost:3001/api/docs

---

## 📋 Funcionalidades

### Empleados
- Registro de empleados con departamento y perfil
- Gestión de asistencia
- Evaluación del personal
- Generación de planillas

### Pacientes
- Registro de pacientes con nivel de asistencia
- Medicamentos y cuidados especiales
- Paquetes adicionales

### Habitaciones
- Control de estado de habitaciones
- Limpieza y mantenimiento
- Reservaciones

### Reservaciones
- Control de estancias (día, mañana, tarde, full)
- Tipos de habitación

### Reportería
- Estadísticas de pacientes y habitaciones

---

## 🎨 Logo

Logo diseñado con paleta de colores: Negro, Amarillo, Blanco, Celeste, Marrón.

---

## 📊 Base de datos

Base de datos para el asilo Patitos del Retiro, desarrollada en SQL Server Express.

### Contenido
- Tablas para empleados, pacientes, habitaciones, reservaciones, etc.
- Datos de prueba incluidos

### Importación
Sigue las instrucciones en `database/MSSQL_SERVER_Express/README.txt`.

