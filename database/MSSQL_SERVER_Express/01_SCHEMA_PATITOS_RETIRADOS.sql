-- *****************************************************
-- Patitos_del_Retiro_DB 
-- SQL Server Express
-- Caso 3: Asilo de Ancianos "Patitos del Retiro"
--UIA GRUPO 3
-- *****************************************************

USE master;
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'Patitos_del_Retiro_DB')
BEGIN
    CREATE DATABASE Patitos_del_Retiro_DB;
END
GO

USE Patitos_del_Retiro_DB;
GO
-- *****************************************************
-- Restricciones levantadas para hacer una mejor ejecucion 
-- *****************************************************

EXEC sp_MSforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL';
GO

-- *****************************************************
-- DROP TABLES (orden inverso por dependencias)
-- *****************************************************
DROP TABLE IF EXISTS [dbo].[Reporte_Pacientes];
DROP TABLE IF EXISTS [dbo].[Reparacion_Pendiente];
DROP TABLE IF EXISTS [dbo].[Paciente_Paquete];
DROP TABLE IF EXISTS [dbo].[Paciente_Cuidado_Especial];
DROP TABLE IF EXISTS [dbo].[Paciente_Medicamento];
DROP TABLE IF EXISTS [dbo].[Mantenimiento_Habitacion];
DROP TABLE IF EXISTS [dbo].[Limpieza_Habitacion];
DROP TABLE IF EXISTS [dbo].[Reservacion];
DROP TABLE IF EXISTS [dbo].[Habitacion];
DROP TABLE IF EXISTS [dbo].[Usuario_Paciente];
DROP TABLE IF EXISTS [dbo].[Paciente];
DROP TABLE IF EXISTS [dbo].[Usuario];
DROP TABLE IF EXISTS [dbo].[Empleado];
DROP TABLE IF EXISTS [dbo].[Catalogo_Estado_Reservacion];
DROP TABLE IF EXISTS [dbo].[Catalogo_Estado_Reparacion];
DROP TABLE IF EXISTS [dbo].[Catalogo_Paquete_Adicional];
DROP TABLE IF EXISTS [dbo].[Catalogo_Nivel_Asistencia];
DROP TABLE IF EXISTS [dbo].[Catalogo_Cuidado_Especial];
DROP TABLE IF EXISTS [dbo].[Catalogo_Tipo_Habitacion];
DROP TABLE IF EXISTS [dbo].[Catalogo_Estado_Habitacion];
DROP TABLE IF EXISTS [dbo].[Catalogo_Tipo_Estancia];
DROP TABLE IF EXISTS [dbo].[Catalogo_Perfil_Usuario];
DROP TABLE IF EXISTS [dbo].[Catalogo_Departamento];
DROP TABLE IF EXISTS [dbo].[Provincia];
GO

-- *****************************************************
-- CATÁLOGOS BASE
-- *****************************************************

CREATE TABLE [dbo].[Catalogo_Departamento] (
    [idCatalogo_Departamento]   INT IDENTITY(1,1) NOT NULL,
    [Nombre_Departamento]       NVARCHAR(50)      NOT NULL,
    [Activo]                    BIT               NOT NULL DEFAULT 1,
    CONSTRAINT [PK_Catalogo_Departamento] PRIMARY KEY ([idCatalogo_Departamento])
);
GO

CREATE TABLE [dbo].[Catalogo_Perfil_Usuario] (
    [idCatalogo_Perfil_Usuario] INT IDENTITY(1,1) NOT NULL,
    [Nombre_Perfil]             NVARCHAR(50)      NOT NULL,
    [Descripcion]               NVARCHAR(200)     NOT NULL,
    [Activo]                    BIT               NOT NULL DEFAULT 1,
    CONSTRAINT [PK_Catalogo_Perfil_Usuario] PRIMARY KEY ([idCatalogo_Perfil_Usuario])
);
GO

CREATE TABLE [dbo].[Catalogo_Nivel_Asistencia] (
    [idCatalogo_Nivel_Asistencia]   INT IDENTITY(1,1) NOT NULL,
    [Descripcion_Nivel]             NVARCHAR(100)     NOT NULL,
    [Activo]                        BIT               NOT NULL DEFAULT 1,
    CONSTRAINT [PK_Catalogo_Nivel_Asistencia] PRIMARY KEY ([idCatalogo_Nivel_Asistencia])
);
GO

CREATE TABLE [dbo].[Catalogo_Cuidado_Especial] (
    [idCatalogo_Cuidado_Especial]   INT IDENTITY(1,1) NOT NULL,
    [Descripcion_Cuidado]           NVARCHAR(100)     NOT NULL,
    [Activo]                        BIT               NOT NULL DEFAULT 1,
    CONSTRAINT [PK_Catalogo_Cuidado_Especial] PRIMARY KEY ([idCatalogo_Cuidado_Especial])
);
GO

CREATE TABLE [dbo].[Catalogo_Paquete_Adicional] (
    [idCatalogo_Paquete_Adicional]  INT IDENTITY(1,1) NOT NULL,
    [Nombre_Paquete]                NVARCHAR(100)     NOT NULL,
    [Descripcion]                   NVARCHAR(200)     NOT NULL,
    [Costo_Adicional]               DECIMAL(10,2)     NOT NULL DEFAULT 0.00,
    [Activo]                        BIT               NOT NULL DEFAULT 1,
    CONSTRAINT [PK_Catalogo_Paquete_Adicional] PRIMARY KEY ([idCatalogo_Paquete_Adicional])
);
GO

CREATE TABLE [dbo].[Catalogo_Tipo_Habitacion] (
    [idCatalogo_Tipo_Habitacion]    INT IDENTITY(1,1) NOT NULL,
    [Nombre_Tipo]                   NVARCHAR(100)     NOT NULL,
    [Descripcion]                   NVARCHAR(200)     NOT NULL,
    [Costo_Por_Dia]                 DECIMAL(10,2)     NOT NULL,
    [Activo]                        BIT               NOT NULL DEFAULT 1,
    CONSTRAINT [PK_Catalogo_Tipo_Habitacion] PRIMARY KEY ([idCatalogo_Tipo_Habitacion])
);
GO

CREATE TABLE [dbo].[Catalogo_Estado_Habitacion] (
    [idCatalogo_Estado_Habitacion]  INT IDENTITY(1,1) NOT NULL,
    [Descripcion_Estado]            NVARCHAR(50)      NOT NULL,
    [Activo]                        BIT               NOT NULL DEFAULT 1,
    CONSTRAINT [PK_Catalogo_Estado_Habitacion] PRIMARY KEY ([idCatalogo_Estado_Habitacion])
);
GO

CREATE TABLE [dbo].[Catalogo_Tipo_Estancia] (
    [idCatalogo_Tipo_Estancia]  INT IDENTITY(1,1) NOT NULL,
    [Descripcion_Estancia]      NVARCHAR(100)     NOT NULL,
    [Hora_Inicio]               NVARCHAR(10)      NOT NULL,
    [Hora_Fin]                  NVARCHAR(10)      NOT NULL,
    [Activo]                    BIT               NOT NULL DEFAULT 1,
    CONSTRAINT [PK_Catalogo_Tipo_Estancia] PRIMARY KEY ([idCatalogo_Tipo_Estancia])
);
GO


CREATE TABLE [dbo].[Catalogo_Estado_Reservacion] (
    [idCatalogo_Estado_Reservacion] INT IDENTITY(1,1) NOT NULL,
    [Descripcion_Estado]            NVARCHAR(50)      NOT NULL,
    [Activo]                        BIT               NOT NULL DEFAULT 1,
    CONSTRAINT [PK_Catalogo_Estado_Reservacion] PRIMARY KEY ([idCatalogo_Estado_Reservacion])
);
GO


CREATE TABLE [dbo].[Catalogo_Estado_Reparacion] (
    [idCatalogo_Estado_Reparacion]  INT IDENTITY(1,1) NOT NULL,
    [Descripcion_Estado]            NVARCHAR(50)      NOT NULL,
    [Activo]                        BIT               NOT NULL DEFAULT 1,
    CONSTRAINT [PK_Catalogo_Estado_Reparacion] PRIMARY KEY ([idCatalogo_Estado_Reparacion])
);
GO

CREATE TABLE [dbo].[Provincia] (
    [idProvincia]       INT IDENTITY(1,1) NOT NULL,
    [Nombre_Provincia]  NVARCHAR(45)      NOT NULL,
    CONSTRAINT [PK_Provincia] PRIMARY KEY ([idProvincia])
);
GO

-- *****************************************************
-- EMPLEADO
-- *****************************************************

CREATE TABLE [dbo].[Empleado] (
    [idEmpleado]                                INT IDENTITY(1,1) NOT NULL,
    [Nombre]                                    NVARCHAR(100)     NOT NULL,
    [Numero_Cedula]                             NVARCHAR(20)      NOT NULL,
    [Fecha_Ingreso]                             DATE              NOT NULL,
    [Telefono]                                  NVARCHAR(20)      NOT NULL,
    [Email]                                     NVARCHAR(255)     NOT NULL,
    [Activo]                                    BIT               NOT NULL DEFAULT 1,
    [Catalogo_Departamento_idDepartamento]      INT               NOT NULL,
    [Catalogo_Perfil_Usuario_idPerfil]          INT               NOT NULL,
    CONSTRAINT [PK_Empleado] PRIMARY KEY ([idEmpleado]),
    CONSTRAINT [UQ_Empleado_Cedula] UNIQUE ([Numero_Cedula]),
    CONSTRAINT [FK_Empleado_Departamento]
        FOREIGN KEY ([Catalogo_Departamento_idDepartamento])
        REFERENCES [dbo].[Catalogo_Departamento] ([idCatalogo_Departamento]),
    CONSTRAINT [FK_Empleado_Perfil]
        FOREIGN KEY ([Catalogo_Perfil_Usuario_idPerfil])
        REFERENCES [dbo].[Catalogo_Perfil_Usuario] ([idCatalogo_Perfil_Usuario])
);
GO

CREATE INDEX [IX_Empleado_Departamento] ON [dbo].[Empleado] ([Catalogo_Departamento_idDepartamento]);
CREATE INDEX [IX_Empleado_Perfil]       ON [dbo].[Empleado] ([Catalogo_Perfil_Usuario_idPerfil]);
GO

-- *****************************************************
-- USUARIO (login de empleados)
-- *****************************************************

CREATE TABLE [dbo].[Usuario] (
    [idUsuario]             INT IDENTITY(1,1) NOT NULL,
    [Nombre_usuario]        NVARCHAR(50)      NOT NULL,
    [Contrasena]            NVARCHAR(255)     NOT NULL,
    [Email]                 NVARCHAR(255)     NOT NULL,
    [Activo]                BIT               NOT NULL DEFAULT 1,
    [Fecha_Creacion]        DATETIME2         NOT NULL DEFAULT GETDATE(),
    [Cambio_Contrasena]     BIT               NOT NULL DEFAULT 1,
    [Empleado_idEmpleado]   INT               NOT NULL,
    CONSTRAINT [PK_Usuario] PRIMARY KEY ([idUsuario]),
    CONSTRAINT [UQ_Usuario_NombreUsuario]  UNIQUE ([Nombre_usuario]),
    CONSTRAINT [UQ_Usuario_Email]          UNIQUE ([Email]),
    CONSTRAINT [FK_Usuario_Empleado]
        FOREIGN KEY ([Empleado_idEmpleado])
        REFERENCES [dbo].[Empleado] ([idEmpleado])
);
GO

CREATE INDEX [IX_Usuario_Empleado] ON [dbo].[Usuario] ([Empleado_idEmpleado]);
GO

-- *****************************************************
-- PACIENTE
-- *****************************************************

CREATE TABLE [dbo].[Paciente] (
    [idPaciente]                            INT IDENTITY(1,1) NOT NULL,
    [Nombre]                                NVARCHAR(100)     NOT NULL,
    [Numero_Cedula]                         NVARCHAR(20)      NOT NULL,
    [Fecha_Nacimiento]                      DATE              NOT NULL,
    [Fecha_Ingreso]                         DATE              NOT NULL,
    [Telefono_Contacto_Emergencia]          NVARCHAR(20)      NOT NULL,
    [Nombre_Contacto_Emergencia]            NVARCHAR(100)     NOT NULL,
    [Activo]                                BIT               NOT NULL DEFAULT 1,
    [Catalogo_Nivel_Asistencia_idNivel]     INT               NOT NULL,
    CONSTRAINT [PK_Paciente] PRIMARY KEY ([idPaciente]),
    CONSTRAINT [UQ_Paciente_Cedula] UNIQUE ([Numero_Cedula]),
    CONSTRAINT [FK_Paciente_Nivel_Asistencia]
        FOREIGN KEY ([Catalogo_Nivel_Asistencia_idNivel])
        REFERENCES [dbo].[Catalogo_Nivel_Asistencia] ([idCatalogo_Nivel_Asistencia])
);
GO

CREATE INDEX [IX_Paciente_Nivel] ON [dbo].[Paciente] ([Catalogo_Nivel_Asistencia_idNivel]);
GO

-- *****************************************************
-- USUARIO_PACIENTE (login propio para pacientes)
-- *****************************************************

CREATE TABLE [dbo].[Usuario_Paciente] (
    [idUsuario_Paciente]    INT IDENTITY(1,1) NOT NULL,
    [Nombre_usuario]        NVARCHAR(50)      NOT NULL,
    [Contrasena]            NVARCHAR(255)     NOT NULL,
    [Email]                 NVARCHAR(255)     NOT NULL,
    [Activo]                BIT               NOT NULL DEFAULT 1,
    [Fecha_Creacion]        DATETIME2         NOT NULL DEFAULT GETDATE(),
    [Cambio_Contrasena]     BIT               NOT NULL DEFAULT 1,
    [Paciente_idPaciente]   INT               NOT NULL,
    CONSTRAINT [PK_Usuario_Paciente] PRIMARY KEY ([idUsuario_Paciente]),
    CONSTRAINT [UQ_UsuarioPaciente_Nombre] UNIQUE ([Nombre_usuario]),
    CONSTRAINT [UQ_UsuarioPaciente_Email]  UNIQUE ([Email]),
    CONSTRAINT [FK_UsuarioPaciente_Paciente]
        FOREIGN KEY ([Paciente_idPaciente])
        REFERENCES [dbo].[Paciente] ([idPaciente])
);
GO

CREATE INDEX [IX_UsuarioPaciente_Paciente] ON [dbo].[Usuario_Paciente] ([Paciente_idPaciente]);
GO

-- *****************************************************
-- MEDICAMENTOS DEL PACIENTE
-- *****************************************************

CREATE TABLE [dbo].[Paciente_Medicamento] (
    [idPaciente_Medicamento]    INT IDENTITY(1,1) NOT NULL,
    [Nombre_Medicamento]        NVARCHAR(100)     NOT NULL,
    [Dosis]                     NVARCHAR(100)     NOT NULL,
    [Frecuencia]                NVARCHAR(100)     NOT NULL,
    [Indicaciones]              NVARCHAR(300)     NOT NULL,
    [Activo]                    BIT               NOT NULL DEFAULT 1,
    [Paciente_idPaciente]       INT               NOT NULL,
    CONSTRAINT [PK_Paciente_Medicamento] PRIMARY KEY ([idPaciente_Medicamento]),
    CONSTRAINT [FK_Medicamento_Paciente]
        FOREIGN KEY ([Paciente_idPaciente])
        REFERENCES [dbo].[Paciente] ([idPaciente])
);
GO

CREATE INDEX [IX_Medicamento_Paciente] ON [dbo].[Paciente_Medicamento] ([Paciente_idPaciente]);
GO

-- *****************************************************
-- CUIDADOS ESPECIALES DEL PACIENTE
-- *****************************************************

CREATE TABLE [dbo].[Paciente_Cuidado_Especial] (
    [idPaciente_Cuidado]                    INT IDENTITY(1,1) NOT NULL,
    [Detalle]                               NVARCHAR(300)     NOT NULL,
    [Paciente_idPaciente]                   INT               NOT NULL,
    [Catalogo_Cuidado_Especial_idCuidado]   INT               NOT NULL,
    CONSTRAINT [PK_Paciente_Cuidado_Especial] PRIMARY KEY ([idPaciente_Cuidado]),
    CONSTRAINT [FK_Cuidado_Paciente]
        FOREIGN KEY ([Paciente_idPaciente])
        REFERENCES [dbo].[Paciente] ([idPaciente]),
    CONSTRAINT [FK_Cuidado_Catalogo]
        FOREIGN KEY ([Catalogo_Cuidado_Especial_idCuidado])
        REFERENCES [dbo].[Catalogo_Cuidado_Especial] ([idCatalogo_Cuidado_Especial])
);
GO

CREATE INDEX [IX_Cuidado_Paciente]  ON [dbo].[Paciente_Cuidado_Especial] ([Paciente_idPaciente]);
CREATE INDEX [IX_Cuidado_Catalogo]  ON [dbo].[Paciente_Cuidado_Especial] ([Catalogo_Cuidado_Especial_idCuidado]);
GO

-- *****************************************************
-- PAQUETES ADICIONALES DEL PACIENTE
-- *****************************************************

CREATE TABLE [dbo].[Paciente_Paquete] (
    [idPaciente_Paquete]            INT IDENTITY(1,1) NOT NULL,
    [Fecha_Asignacion]              DATE              NOT NULL DEFAULT GETDATE(),
    [Activo]                        BIT               NOT NULL DEFAULT 1,
    [Paciente_idPaciente]           INT               NOT NULL,
    [Catalogo_Paquete_idPaquete]    INT               NOT NULL,
    CONSTRAINT [PK_Paciente_Paquete] PRIMARY KEY ([idPaciente_Paquete]),
    CONSTRAINT [FK_Paquete_Paciente]
        FOREIGN KEY ([Paciente_idPaciente])
        REFERENCES [dbo].[Paciente] ([idPaciente]),
    CONSTRAINT [FK_Paquete_Catalogo]
        FOREIGN KEY ([Catalogo_Paquete_idPaquete])
        REFERENCES [dbo].[Catalogo_Paquete_Adicional] ([idCatalogo_Paquete_Adicional])
);
GO

CREATE INDEX [IX_Paquete_Paciente]  ON [dbo].[Paciente_Paquete] ([Paciente_idPaciente]);
CREATE INDEX [IX_Paquete_Catalogo]  ON [dbo].[Paciente_Paquete] ([Catalogo_Paquete_idPaquete]);
GO

-- *****************************************************
-- HABITACION
-- *****************************************************

CREATE TABLE [dbo].[Habitacion] (
    [idHabitacion]                          INT IDENTITY(1,1) NOT NULL,
    [Numero_Habitacion]                     NVARCHAR(10)      NOT NULL,
    [Piso]                                  INT               NOT NULL,
    [Capacidad]                             INT               NOT NULL DEFAULT 1,
    [Observaciones]                         NVARCHAR(300)     NULL,
    [Catalogo_Tipo_Habitacion_idTipo]       INT               NOT NULL,
    [Catalogo_Estado_Habitacion_idEstado]   INT               NOT NULL,
    CONSTRAINT [PK_Habitacion] PRIMARY KEY ([idHabitacion]),
    CONSTRAINT [UQ_Habitacion_Numero] UNIQUE ([Numero_Habitacion]),
    CONSTRAINT [FK_Habitacion_Tipo]
        FOREIGN KEY ([Catalogo_Tipo_Habitacion_idTipo])
        REFERENCES [dbo].[Catalogo_Tipo_Habitacion] ([idCatalogo_Tipo_Habitacion]),
    CONSTRAINT [FK_Habitacion_Estado]
        FOREIGN KEY ([Catalogo_Estado_Habitacion_idEstado])
        REFERENCES [dbo].[Catalogo_Estado_Habitacion] ([idCatalogo_Estado_Habitacion])
);
GO

CREATE INDEX [IX_Habitacion_Tipo]   ON [dbo].[Habitacion] ([Catalogo_Tipo_Habitacion_idTipo]);
CREATE INDEX [IX_Habitacion_Estado] ON [dbo].[Habitacion] ([Catalogo_Estado_Habitacion_idEstado]);
GO

-- *****************************************************
-- RESERVACION (con estado)
-- *****************************************************

CREATE TABLE [dbo].[Reservacion] (
    [idReservacion]                             INT IDENTITY(1,1) NOT NULL,
    [Fecha_Inicio]                              DATE              NOT NULL,
    [Fecha_Fin]                                 DATE              NULL,
    [Indefinido]                                BIT               NOT NULL DEFAULT 0,
    [Observaciones]                             NVARCHAR(300)     NULL,
    [Fecha_Registro]                            DATETIME2         NOT NULL DEFAULT GETDATE(),
    [Activo]                                    BIT               NOT NULL DEFAULT 1,
    [Paciente_idPaciente]                       INT               NOT NULL,
    [Habitacion_idHabitacion]                   INT               NOT NULL,
    [Catalogo_Tipo_Estancia_idEstancia]         INT               NOT NULL,
    [Catalogo_Estado_Reservacion_idEstado]      INT               NOT NULL,
    [Empleado_idEmpleado_Registra]              INT               NOT NULL,
    CONSTRAINT [PK_Reservacion] PRIMARY KEY ([idReservacion]),
    CONSTRAINT [FK_Reservacion_Paciente]
        FOREIGN KEY ([Paciente_idPaciente])
        REFERENCES [dbo].[Paciente] ([idPaciente]),
    CONSTRAINT [FK_Reservacion_Habitacion]
        FOREIGN KEY ([Habitacion_idHabitacion])
        REFERENCES [dbo].[Habitacion] ([idHabitacion]),
    CONSTRAINT [FK_Reservacion_Tipo_Estancia]
        FOREIGN KEY ([Catalogo_Tipo_Estancia_idEstancia])
        REFERENCES [dbo].[Catalogo_Tipo_Estancia] ([idCatalogo_Tipo_Estancia]),
    CONSTRAINT [FK_Reservacion_Estado]
        FOREIGN KEY ([Catalogo_Estado_Reservacion_idEstado])
        REFERENCES [dbo].[Catalogo_Estado_Reservacion] ([idCatalogo_Estado_Reservacion]),
    CONSTRAINT [FK_Reservacion_Empleado]
        FOREIGN KEY ([Empleado_idEmpleado_Registra])
        REFERENCES [dbo].[Empleado] ([idEmpleado])
);
GO

CREATE INDEX [IX_Reservacion_Paciente]   ON [dbo].[Reservacion] ([Paciente_idPaciente]);
CREATE INDEX [IX_Reservacion_Habitacion] ON [dbo].[Reservacion] ([Habitacion_idHabitacion]);
CREATE INDEX [IX_Reservacion_Estancia]   ON [dbo].[Reservacion] ([Catalogo_Tipo_Estancia_idEstancia]);
CREATE INDEX [IX_Reservacion_Estado]     ON [dbo].[Reservacion] ([Catalogo_Estado_Reservacion_idEstado]);
CREATE INDEX [IX_Reservacion_Empleado]   ON [dbo].[Reservacion] ([Empleado_idEmpleado_Registra]);
GO

-- *****************************************************
-- LIMPIEZA DE HABITACION
-- *****************************************************

CREATE TABLE [dbo].[Limpieza_Habitacion] (
    [idLimpieza_Habitacion]     INT IDENTITY(1,1) NOT NULL,
    [Fecha_Limpieza]            DATE              NOT NULL,
    [Observaciones]             NVARCHAR(300)     NULL,
    [Habitacion_idHabitacion]   INT               NOT NULL,
    [Empleado_idEmpleado]       INT               NOT NULL,
    CONSTRAINT [PK_Limpieza_Habitacion] PRIMARY KEY ([idLimpieza_Habitacion]),
    CONSTRAINT [FK_Limpieza_Habitacion]
        FOREIGN KEY ([Habitacion_idHabitacion])
        REFERENCES [dbo].[Habitacion] ([idHabitacion]),
    CONSTRAINT [FK_Limpieza_Empleado]
        FOREIGN KEY ([Empleado_idEmpleado])
        REFERENCES [dbo].[Empleado] ([idEmpleado])
);
GO

CREATE INDEX [IX_Limpieza_Habitacion]   ON [dbo].[Limpieza_Habitacion] ([Habitacion_idHabitacion]);
CREATE INDEX [IX_Limpieza_Empleado]     ON [dbo].[Limpieza_Habitacion] ([Empleado_idEmpleado]);
GO

-- *****************************************************
-- MANTENIMIENTO DE HABITACION
-- *****************************************************

CREATE TABLE [dbo].[Mantenimiento_Habitacion] (
    [idMantenimiento_Habitacion]    INT IDENTITY(1,1) NOT NULL,
    [Fecha_Mantenimiento]           DATE              NOT NULL,
    [Descripcion_Reparacion]        NVARCHAR(500)     NOT NULL,
    [Actualizacion_Mobiliario]      NVARCHAR(500)     NULL,
    [Completado]                    BIT               NOT NULL DEFAULT 0,
    [Habitacion_idHabitacion]       INT               NOT NULL,
    [Empleado_idEmpleado]           INT               NOT NULL,
    CONSTRAINT [PK_Mantenimiento_Habitacion] PRIMARY KEY ([idMantenimiento_Habitacion]),
    CONSTRAINT [FK_Mantenimiento_Habitacion]
        FOREIGN KEY ([Habitacion_idHabitacion])
        REFERENCES [dbo].[Habitacion] ([idHabitacion]),
    CONSTRAINT [FK_Mantenimiento_Empleado]
        FOREIGN KEY ([Empleado_idEmpleado])
        REFERENCES [dbo].[Empleado] ([idEmpleado])
);
GO

CREATE INDEX [IX_Mantenimiento_Habitacion]  ON [dbo].[Mantenimiento_Habitacion] ([Habitacion_idHabitacion]);
CREATE INDEX [IX_Mantenimiento_Empleado]    ON [dbo].[Mantenimiento_Habitacion] ([Empleado_idEmpleado]);
GO

-- *****************************************************
-- NUEVO: REPARACIONES PENDIENTES
-- *****************************************************

CREATE TABLE [dbo].[Reparacion_Pendiente] (
    [idReparacion_Pendiente]                INT IDENTITY(1,1) NOT NULL,
    [Descripcion]                           NVARCHAR(500)     NOT NULL,
    [Fecha_Reporte]                         DATE              NOT NULL DEFAULT GETDATE(),
    [Fecha_Resolucion]                      DATE              NULL,
    [Prioridad]                             NVARCHAR(10)      NOT NULL DEFAULT N'Media',
    [Habitacion_idHabitacion]               INT               NOT NULL,
    [Empleado_idEmpleado_Reporta]           INT               NOT NULL,
    [Catalogo_Estado_Reparacion_idEstado]   INT               NOT NULL,
    CONSTRAINT [PK_Reparacion_Pendiente] PRIMARY KEY ([idReparacion_Pendiente]),
    CONSTRAINT [CHK_Prioridad] CHECK ([Prioridad] IN (N'Alta', N'Media', N'Baja')),
    CONSTRAINT [FK_Reparacion_Habitacion]
        FOREIGN KEY ([Habitacion_idHabitacion])
        REFERENCES [dbo].[Habitacion] ([idHabitacion]),
    CONSTRAINT [FK_Reparacion_Empleado]
        FOREIGN KEY ([Empleado_idEmpleado_Reporta])
        REFERENCES [dbo].[Empleado] ([idEmpleado]),
    CONSTRAINT [FK_Reparacion_Estado]
        FOREIGN KEY ([Catalogo_Estado_Reparacion_idEstado])
        REFERENCES [dbo].[Catalogo_Estado_Reparacion] ([idCatalogo_Estado_Reparacion])
);
GO

CREATE INDEX [IX_Reparacion_Habitacion] ON [dbo].[Reparacion_Pendiente] ([Habitacion_idHabitacion]);
CREATE INDEX [IX_Reparacion_Empleado]   ON [dbo].[Reparacion_Pendiente] ([Empleado_idEmpleado_Reporta]);
CREATE INDEX [IX_Reparacion_Estado]     ON [dbo].[Reparacion_Pendiente] ([Catalogo_Estado_Reparacion_idEstado]);
GO

-- *****************************************************
-- REPORTE DE PACIENTES
-- *****************************************************

CREATE TABLE [dbo].[Reporte_Pacientes] (
    [idReporte]                 INT IDENTITY(1,1) NOT NULL,
    [Fecha_Reporte]             DATETIME2         NOT NULL DEFAULT GETDATE(),
    [Total_Registrados]         INT               NOT NULL,
    [Total_Alojados]            INT               NOT NULL,
    [Total_Por_Dia]             INT               NOT NULL,
    [Habitaciones_Reservadas]   INT               NOT NULL,
    [Habitaciones_Totales]      INT               NOT NULL,
    [Generado_Por]              INT               NOT NULL,
    CONSTRAINT [PK_Reporte_Pacientes] PRIMARY KEY ([idReporte]),
    CONSTRAINT [FK_Reporte_Empleado]
        FOREIGN KEY ([Generado_Por])
        REFERENCES [dbo].[Empleado] ([idEmpleado])
);
GO
-- *****************************************************
-- ACTIVACION DE RESTRICCIONES DE FK
-- *****************************************************
EXEC sp_MSforeachtable 'ALTER TABLE ? WITH CHECK CHECK CONSTRAINT ALL';
GO

PRINT 'Patitos_del_Retiro_DB v2.0 creada exitosamente.';
GO