# 🛍️ ShopEasy – Frontend

ShopEasy es una aplicación web moderna diseñada para gestionar procesos de compra de manera eficiente, intuitiva y escalable.

---

## 🚀 Tecnologías utilizadas

- Next.js (App Router)
- React
- TypeScript
- TailwindCSS


---

## 🧩 Requisitos previos

Antes de ejecutar el proyecto asegúrate de tener instalado:

- Node.js (v18 o superior)
- npm

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

### 3️⃣ Instalar dependencias

```bash
npm install
```

### 4️⃣ Ejecutar el servidor de desarrollo

```bash
npm run dev
```

### 5️⃣ Abrir en el navegador

Ir a:
```bash
http://localhost:3000
```


# Newtech_DB - Base de Datos

Base de datos para el sistema de ventas Newtech, desarrollada en MySQL.

## Requisitos

- MySQL 8.0 o superior
- MySQL Workbench (opcional)

## Cómo importar la base de datos

### Opción 1: Desde MySQL Workbench

1. Abre MySQL Workbench
2. Ve a **Server → Data Import**
3. Selecciona **"Import from Self-Contained File"**
4. Busca el archivo `database/Newtech_DB.sql`
5. En **"Default Schema to be Imported To"** escribe `Newtech_DB`
6. Haz clic en **"Start Import"**

### Opción 2: Desde la terminal
```bash
mysql -u root -p < database/Newtech_DB.sql
```

Luego ingresa tu contraseña de MySQL cuando la pida.

## Contenido de la base de datos

### Estructura
- 24 tablas en total
- Catálogos, usuarios, clientes, productos, pedidos, facturas, pagos y envíos

### Datos precargados
- 7 provincias, 82 cantones y todos los distritos de Costa Rica
- 2 clientes de prueba (1 Regular, 1 VIP)
- 3 productos de ejemplo
- 2 pedidos con sus respectivas facturas, pagos y envíos

## Credenciales de prueba

| Usuario | Contraseña | Rol |
|---|---|---|
| arodriguez | pass123 | Administrador |
| mgonzalez | pass456 | Cliente |

