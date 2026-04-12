# Tutorial de Instalación y Ejecución - ShopEasy

## Requisitos Previos

### 1. Software Necesario
- **Node.js** (versión 18 o superior)
- **SQL Server Express** (o SQL Server local)
- **SQL Server Management Studio (SSMS)**
- **Visual Studio Code** (recomendado)

### 2. Verificar Instalaciones
```bash
# Verificar Node.js
node --version
npm --version

# Verificar SQL Server (desde SSMS o PowerShell)
sqlcmd -S localhost\SQLEXPRESS -E
```

---

## Paso 1: Configurar Base de Datos

### 1.1 Instalar SQL Server Express
1. Descargar SQL Server Express desde: https://www.microsoft.com/sql-server/sql-server-downloads
2. Ejecutar el instalador
3. Seleccionar "Custom" installation
4. Marcar "Database Engine Services"
5. En configuración:
   - Habilitar "Mixed Authentication"
   - Recordar contraseña del usuario `sa`

### 1.2 Habilitar TCP/IP
1. Abrir **SQL Server Configuration Manager**
2. Ir a **SQL Server Network Configuration** > **Protocols for SQLEXPRESS**
3. Habilitar **TCP/IP**
4. Reiniciar SQL Server

### 1.3 Restaurar Base de Datos
1. Abrir **SQL Server Management Studio (SSMS)**
2. Conectarse con autenticación Windows o SQL Server
3. Click derecho en **Databases** > **Restore Database**
4. Seleccionar **Device** > **Add**
5. Buscar el archivo `.bak` en la carpeta `database/BACKUP_PATITOS_RETIRADOS/`
6. Restaurar con nombre: `PATITOS_RETIRADOS`

---

## Paso 2: Configurar Backend

### 2.1 Descomprimir y Abrir Proyecto
```bash
# Descomprimir el archivo .zip
# Navegar a la carpeta del proyecto
cd ShopEasy-main/backend
```

### 2.2 Instalar Dependencias
```bash
# Instalar dependencias de Node.js
npm install
```

### 2.3 Configurar Variables de Entorno
Crear archivo `.env` en la carpeta `backend/`:
```env
# Configuración de Base de Datos
DATABASE_URL="sqlserver://localhost:1433;database=PATITOS_RETIRADOS;trustConnection=true;encrypt=false"

# Puerto del Backend
PORT=3001

# JWT Secret
JWT_SECRET="tu_secreto_jwt_aqui"

# Origen del Frontend
FRONTEND_URL="http://localhost:3000"
```

### 2.4 Generar Prisma Client
```bash
# Generar cliente de Prisma
npx prisma generate
```

### 2.5 Ejecutar Backend
```bash
# En modo desarrollo
npm run start:dev

# O en modo producción
npm run build
npm start
```

El backend estará disponible en: http://localhost:3001/api
Documentación Swagger: http://localhost:3001/api/docs

---

## Paso 3: Configurar Frontend

### 3.1 Navegar a la Carpeta del Frontend
```bash
cd ../frontend
```

### 3.2 Instalar Dependencias
```bash
# Instalar dependencias
npm install
```

### 3.3 Configurar Variables de Entorno
Crear archivo `.env.local` en la carpeta `frontend/`:
```env
# URL del Backend
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3.4 Ejecutar Frontend
```bash
# En modo desarrollo
npm run dev

# O en modo producción
npm run build
npm start
```

El frontend estará disponible en: http://localhost:3000

---

## Paso 4: Usuarios para Acceso

### Usuarios Predeterminados
El sistema incluye estos usuarios para pruebas:

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `cmendez` | `123` | Administrador |
| `jperez` | `123` | Enfermero |
| `rgarcia` | `123` | Doctor |

### Para Crear Nuevos Usuarios
Ejecutar este script en la base de datos:
```sql
-- Ejemplo para crear nuevo usuario
INSERT INTO Usuario (Nombre_usuario, Contrasena, idCatalogo_Perfil, Activo)
VALUES ('nuevo_usuario', '$2b$10$hash_generado', 1, 1);
```

---

## Paso 5: Verificar Funcionamiento

### 5.1 Probar Backend
1. Abrir http://localhost:3001/api/docs
2. Probar endpoint de login: `POST /auth/login`
3. Usar credenciales: `cmendez` / `123`

### 5.2 Probar Frontend
1. Abrir http://localhost:3000
2. Iniciar sesión con las credenciales
3. Navegar por las diferentes secciones

### 5.3 Funcionalidades Clave
- **Dashboard**: Estadísticas del sistema
- **Pacientes**: Gestión completa de pacientes
- **Empleados**: Gestión de personal
- **Habitaciones**: Gestión de habitaciones
- **Reservaciones**: Sistema de reservas
- **Reportes**: Reportes del sistema

---

## Problemas Comunes y Soluciones

### Error: "Cannot connect to SQL Server"
**Solución:**
1. Verificar que SQL Server esté corriendo
2. Habilitar TCP/IP en Configuration Manager
3. Verificar cadena de conexión en `.env`

### Error: "Prisma Client not generated"
**Solución:**
```bash
npx prisma generate
```

### Error: "Port already in use"
**Solución:**
1. Cambiar puerto en `.env`
2. O detener el proceso que usa el puerto:
```bash
# En Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Error: "Module not found"
**Solución:**
```bash
npm install
# O borrar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

---

## Estructura del Proyecto

```
ShopEasy-main/
|-- backend/
|   |-- src/
|   |   |-- auth/          # Autenticación
|   |   |-- pacientes/     # Pacientes
|   |   |-- empleados/     # Empleados
|   |   |-- habitaciones/  # Habitaciones
|   |   |-- reservaciones/ # Reservaciones
|   |   |-- prisma/        # Configuración Prisma
|   |-- .env              # Variables de entorno
|   |-- package.json
|-- frontend/
|   |-- src/
|   |   |-- components/    # Componentes React
|   |   |-- pages/         # Páginas
|   |   |-- services/      # Servicios API
|   |-- .env.local        # Variables de entorno
|   |-- package.json
|-- database/
|   |-- BACKUP_PATITOS_RETIRADOS/  # Backup de BD
|   |-- MSSQL_SERVER_Express/      # Scripts SQL
```

---

## Características del Sistema

### Funcionalidades Principales
- **Autenticación JWT** con roles de usuario
- **CRUD completo** para todas las entidades
- **Sincronización automática** de estados
- **Reportes y estadísticas** en tiempo real
- **Interfaz responsive** con tema claro/oscuro

### Tecnologías Utilizadas
- **Backend**: NestJS + Prisma + SQL Server
- **Frontend**: Next.js + React + TypeScript
- **Base de Datos**: SQL Server Express
- **Autenticación**: JWT + bcrypt

---

## Soporte y Contacto

Si encuentran problemas durante la instalación:

1. **Verificar logs** del backend y frontend
2. **Revisar conexión** a la base de datos
3. **Validar versiones** de Node.js y SQL Server
4. **Consultar documentación** de Swagger en `/api/docs`

---

## Notas Finales

- El sistema está configurado para desarrollo local
- Para producción, ajustar variables de entorno
- Realizar backup regular de la base de datos
- Mantener actualizadas las dependencias

**¡Listo! Con estos pasos tus compañeros podrán instalar y ejecutar el sistema sin problemas.**
