# 🐥 Patitos del Retiro – Sistema de Gestión Clínica

Sistema web para la gestión integral del asilo de ancianos **Patitos del Retiro**. Permite administrar pacientes, habitaciones, empleados, reservaciones y generar reportes desde una sola plataforma.

---

## 🏗️ Arquitectura

El proyecto está organizado como un monorepo con dos carpetas principales:

```
ShopEasy/
├── frontend/   # Next.js + TypeScript
└── backend/    # NestJS + Prisma + SQL Server
```

---

## 🚀 Tecnologías utilizadas

### Frontend
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui + Radix UI
- Framer Motion
- Recharts

### Backend
- NestJS
- Prisma ORM
- Microsoft SQL Server Express
- JWT (autenticación)

---

## 🧩 Requisitos previos

- Node.js v18 o superior
- npm
- Microsoft SQL Server Express

```bash
node -v
npm -v
```

---

## ⚙️ Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/xJeffx23/ShopEasy.git
cd ShopEasy
```

### 2. Configurar el Frontend

```bash
cd frontend
npm install
npm run dev
```

Disponible en: `http://localhost:3000`

### 3. Configurar el Backend

```bash
cd backend
npm install
```

Crear el archivo `.env` en `backend/`:

```env
DATABASE_URL="sqlserver://localhost:1433;database=PatitosDB;user=sa;password=TuPassword;trustServerCertificate=true"
JWT_SECRET="tu_secreto_jwt"
```

Ejecutar migraciones y levantar el servidor:

```bash
npx prisma migrate dev
npm run start:dev
```

Disponible en: `http://localhost:3001`

---

## 📦 Módulos del sistema

| Módulo | Descripción |
|---|---|
| **Autenticación** | Login con JWT, cambio de contraseña en primer acceso |
| **Empleados** | Registro de personal, perfiles de acceso y gestión de usuarios |
| **Pacientes** | Registro con medicamentos, cuidados especiales y paquetes |
| **Habitaciones** | Estados, limpiezas y mantenimientos |
| **Reservaciones** | Control de estancias con tipos y fechas |
| **Reportería** | Estadísticas de ocupación, pacientes y habitaciones |
| **Panel Paciente** | Vista de reservaciones activas e historial |

---

## 👤 Perfiles de acceso

| Perfil | Acceso |
|---|---|
| **Gerencia** | Todos los módulos |
| **Gestión de pacientes** | Pacientes y Habitaciones |
| **Mantenimiento** | Habitaciones |
| **Recepción** | Reservaciones |

---

## 🔑 Credenciales de prueba

| Usuario | Contraseña |
|---|---|
| admin | admin |

> El sistema solicitará cambio de contraseña en el primer inicio de sesión.

---

## 👥 Equipo

- Jefferson Calderón Mesén
- Rodolfo Arévalo Guardado
- Saymon Xavier Araya Garro
- Dorian Salas Elizondo

**Curso:** Arquitectura de Software – Universidad Internacional de las Américas
