-- *****************************************************
-- Patitos_del_Retiro_DB - Datos de prueba v2.0
-- Ejecutar DESPUÉS de 01_schema_patitos_retiro.sql
--LEER EL README DE GITHUB EN LA RAMA DE DATABASE
-- *****************************************************

USE Patitos_del_Retiro_DB;
GO
-- *****************************************************
-- Restricciones levantadas para hacer una mejor ejecucion 
-- *****************************************************
EXEC sp_MSforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL';
GO

-- *****************************************************
-- CATÁLOGOS BASE --LEER EL README DE GITHUB EN LA RAMA DE DATABASE
-- *****************************************************

SET IDENTITY_INSERT [dbo].[Catalogo_Departamento] ON;
INSERT INTO [dbo].[Catalogo_Departamento] (idCatalogo_Departamento, Nombre_Departamento, Activo) VALUES
(1, N'Administrativo', 1),
(2, N'Gerencia',       1),
(3, N'DTI',            1),
(4, N'Financiero',     1);
SET IDENTITY_INSERT [dbo].[Catalogo_Departamento] OFF;
GO

SET IDENTITY_INSERT [dbo].[Catalogo_Perfil_Usuario] ON;
INSERT INTO [dbo].[Catalogo_Perfil_Usuario] (idCatalogo_Perfil_Usuario, Nombre_Perfil, Descripcion, Activo) VALUES
(1, N'Gerencia',             N'Acceso a Empleados, Pacientes, Habitaciones y Reservas', 1),
(2, N'Gestión de Pacientes', N'Acceso a módulo de Pacientes y Habitaciones',            1),
(3, N'Mantenimiento',        N'Acceso únicamente a Habitaciones',                       1),
(4, N'Recepción',            N'Acceso únicamente a Reservas',                           1);
SET IDENTITY_INSERT [dbo].[Catalogo_Perfil_Usuario] OFF;
GO

SET IDENTITY_INSERT [dbo].[Catalogo_Nivel_Asistencia] ON;
INSERT INTO [dbo].[Catalogo_Nivel_Asistencia] (idCatalogo_Nivel_Asistencia, Descripcion_Nivel, Activo) VALUES
(1, N'Asistencia básica',            1),
(2, N'Asistencia para movilidad',    1),
(3, N'Asistencia para alimentación', 1),
(4, N'Asistencia para baño',         1),
(5, N'Asistencia completa',          1);
SET IDENTITY_INSERT [dbo].[Catalogo_Nivel_Asistencia] OFF;
GO

SET IDENTITY_INSERT [dbo].[Catalogo_Cuidado_Especial] ON;
INSERT INTO [dbo].[Catalogo_Cuidado_Especial] (idCatalogo_Cuidado_Especial, Descripcion_Cuidado, Activo) VALUES
(1, N'Alergias',            1),
(2, N'Cambios de vendajes', 1),
(3, N'Dietas especiales',   1);
SET IDENTITY_INSERT [dbo].[Catalogo_Cuidado_Especial] OFF;
GO

SET IDENTITY_INSERT [dbo].[Catalogo_Paquete_Adicional] ON;
INSERT INTO [dbo].[Catalogo_Paquete_Adicional] (idCatalogo_Paquete_Adicional, Nombre_Paquete, Descripcion, Costo_Adicional, Activo) VALUES
(1, N'Disfrute de juegos',                 N'Acceso a sala de juegos y actividades recreativas',          15000.00, 1),
(2, N'Visitas a los familiares',           N'Coordinación y acompañamiento en visitas a familiares',      20000.00, 1),
(3, N'Paseos a sitios con acompañamiento', N'Paseos a sitios de interés con personal de acompañamiento', 35000.00, 1);
SET IDENTITY_INSERT [dbo].[Catalogo_Paquete_Adicional] OFF;
GO

SET IDENTITY_INSERT [dbo].[Catalogo_Tipo_Habitacion] ON;
INSERT INTO [dbo].[Catalogo_Tipo_Habitacion] (idCatalogo_Tipo_Habitacion, Nombre_Tipo, Descripcion, Costo_Por_Dia, Activo) VALUES
(1, N'Habitación compartida',                  N'Habitación con capacidad para 2 o más pacientes',           25000.00, 1),
(2, N'Habitación individual',                  N'Habitación privada con cama individual',                    40000.00, 1),
(3, N'Habitación individual cama matrimonial', N'Habitación privada con cama matrimonial',                   50000.00, 1),
(4, N'Habitación de cuidados especiales',      N'Habitación equipada para pacientes con cuidados especiales',65000.00, 1);
SET IDENTITY_INSERT [dbo].[Catalogo_Tipo_Habitacion] OFF;
GO

SET IDENTITY_INSERT [dbo].[Catalogo_Estado_Habitacion] ON;
INSERT INTO [dbo].[Catalogo_Estado_Habitacion] (idCatalogo_Estado_Habitacion, Descripcion_Estado, Activo) VALUES
(1, N'Disponible',       1),
(2, N'Reservada',        1),
(3, N'En mantenimiento', 1),
(4, N'Cerrada',          1);
SET IDENTITY_INSERT [dbo].[Catalogo_Estado_Habitacion] OFF;
GO

SET IDENTITY_INSERT [dbo].[Catalogo_Tipo_Estancia] ON;
INSERT INTO [dbo].[Catalogo_Tipo_Estancia] (idCatalogo_Tipo_Estancia, Descripcion_Estancia, Hora_Inicio, Hora_Fin, Activo) VALUES
(1, N'Día',           N'08:00', N'17:00', 1),
(2, N'Mañana',        N'08:00', N'14:00', 1),
(3, N'Tarde',         N'14:00', N'18:00', 1),
(4, N'Full Estancia', N'00:00', N'23:59', 1);
SET IDENTITY_INSERT [dbo].[Catalogo_Tipo_Estancia] OFF;
GO


SET IDENTITY_INSERT [dbo].[Catalogo_Estado_Reservacion] ON;
INSERT INTO [dbo].[Catalogo_Estado_Reservacion] (idCatalogo_Estado_Reservacion, Descripcion_Estado, Activo) VALUES
(1, N'Activa',     1),
(2, N'Finalizada', 1),
(3, N'Cancelada',  1),
(4, N'Pendiente',  1);
SET IDENTITY_INSERT [dbo].[Catalogo_Estado_Reservacion] OFF;
GO

SET IDENTITY_INSERT [dbo].[Catalogo_Estado_Reparacion] ON;
INSERT INTO [dbo].[Catalogo_Estado_Reparacion] (idCatalogo_Estado_Reparacion, Descripcion_Estado, Activo) VALUES
(1, N'Pendiente',   1),
(2, N'En proceso',  1),
(3, N'Resuelta',    1),
(4, N'Descartada',  1);
SET IDENTITY_INSERT [dbo].[Catalogo_Estado_Reparacion] OFF;
GO



-- *****************************************************
-- EMPLEADOS --LEER EL README DE GITHUB EN LA RAMA DE DATABASE
-- *****************************************************

SET IDENTITY_INSERT [dbo].[Empleado] ON;
INSERT INTO [dbo].[Empleado] (idEmpleado, Nombre, Numero_Cedula, Fecha_Ingreso, Telefono, Email, Activo,
    Catalogo_Departamento_idDepartamento, Catalogo_Perfil_Usuario_idPerfil) VALUES
(1, N'Carlos Méndez Ulate',   '101230456', '2020-01-15', N'8888-1111', N'carlos.mendez@patitosretiro.cr',  1, 2, 1),
(2, N'Laura Ramírez Solís',   '205670123', '2019-03-10', N'8888-2222', N'laura.ramirez@patitosretiro.cr',  1, 1, 2),
(3, N'Marco Jiménez Vega',    '302340789', '2021-06-01', N'8888-3333', N'marco.jimenez@patitosretiro.cr',  1, 3, 3),
(4, N'Sofía Vargas Mora',     '401230567', '2022-02-20', N'8888-4444', N'sofia.vargas@patitosretiro.cr',   1, 1, 4),
(5, N'Diego Castillo Pérez',  '108900234', '2018-11-05', N'8888-5555', N'diego.castillo@patitosretiro.cr', 1, 3, 3);
SET IDENTITY_INSERT [dbo].[Empleado] OFF;
GO

-- *****************************************************
-- USUARIOS DE EMPLEADOS --LEER EL README DE GITHUB EN LA RAMA DE DATABASE 
-- *****************************************************

SET IDENTITY_INSERT [dbo].[Usuario] ON;
INSERT INTO [dbo].[Usuario] (idUsuario, Nombre_usuario, Contrasena, Email, Activo, Fecha_Creacion, Cambio_Contrasena, Empleado_idEmpleado) VALUES
(1, N'cmendez',   N'$2b$10$hashedpassword1', N'carlos.mendez@patitosretiro.cr',  1, GETDATE(), 0, 1),
(2, N'lramirez',  N'$2b$10$hashedpassword2', N'laura.ramirez@patitosretiro.cr',  1, GETDATE(), 0, 2),
(3, N'mjimenez',  N'$2b$10$hashedpassword3', N'marco.jimenez@patitosretiro.cr',  1, GETDATE(), 1, 3),
(4, N'svargas',   N'$2b$10$hashedpassword4', N'sofia.vargas@patitosretiro.cr',   1, GETDATE(), 1, 4),
(5, N'dcastillo', N'$2b$10$hashedpassword5', N'diego.castillo@patitosretiro.cr', 1, GETDATE(), 1, 5);
SET IDENTITY_INSERT [dbo].[Usuario] OFF;
GO

-- *****************************************************
-- PACIENTES --LEER EL README DE GITHUB EN LA RAMA DE DATABASE
-- *****************************************************

SET IDENTITY_INSERT [dbo].[Paciente] ON;
INSERT INTO [dbo].[Paciente] (idPaciente, Nombre, Numero_Cedula, Fecha_Nacimiento, Fecha_Ingreso,
    Telefono_Contacto_Emergencia, Nombre_Contacto_Emergencia, Activo, Catalogo_Nivel_Asistencia_idNivel) VALUES
(1, N'Rosa María Fernández Chaves', '101234567', '1940-05-12', '2023-01-10', N'8777-1111', N'Pedro Fernández', 1, 1),
(2, N'Alberto Quesada Mora',        '202345678', '1935-08-23', '2022-06-15', N'8777-2222', N'Ana Quesada',     1, 3),
(3, N'Mercedes Solano Jiménez',     '303456789', '1938-11-30', '2023-03-20', N'8777-3333', N'Luis Solano',     1, 5),
(4, N'Ernesto Vargas Blanco',       '104567890', '1942-02-14', '2024-01-05', N'8777-4444', N'María Vargas',    1, 2),
(5, N'Gloria Picado Arce',          '205678901', '1936-07-08', '2023-09-12', N'8777-5555', N'Jorge Picado',    1, 4);
SET IDENTITY_INSERT [dbo].[Paciente] OFF;
GO

-- *****************************************************
-- USUARIOS DE PACIENTES
-- *****************************************************

SET IDENTITY_INSERT [dbo].[Usuario_Paciente] ON;
INSERT INTO [dbo].[Usuario_Paciente] (idUsuario_Paciente, Nombre_usuario, Contrasena, Email, Activo, Fecha_Creacion, Cambio_Contrasena, Paciente_idPaciente) VALUES
(1, N'rosafernandez', N'$2b$10$patienthash1', N'rosa.fernandez@correo.cr',  1, GETDATE(), 1, 1),
(2, N'albertoqmd',    N'$2b$10$patienthash2', N'alberto.quesada@correo.cr', 1, GETDATE(), 1, 2),
(3, N'mercedessolano',N'$2b$10$patienthash3', N'mercedes.solano@correo.cr', 1, GETDATE(), 1, 3),
(4, N'ernestovargas', N'$2b$10$patienthash4', N'ernesto.vargas@correo.cr',  1, GETDATE(), 1, 4),
(5, N'gloriapicado',  N'$2b$10$patienthash5', N'gloria.picado@correo.cr',   1, GETDATE(), 1, 5);
SET IDENTITY_INSERT [dbo].[Usuario_Paciente] OFF;
GO

-- *****************************************************
-- MEDICAMENTOS
-- *****************************************************

SET IDENTITY_INSERT [dbo].[Paciente_Medicamento] ON;
INSERT INTO [dbo].[Paciente_Medicamento] (idPaciente_Medicamento, Nombre_Medicamento, Dosis, Frecuencia, Indicaciones, Activo, Paciente_idPaciente) VALUES
(1, N'Metformina',    N'500mg', N'2 veces al día',    N'Tomar con alimentos para diabetes',          1, 1),
(2, N'Atorvastatina', N'20mg',  N'1 vez por la noche',N'Para control de colesterol',                 1, 1),
(3, N'Losartán',      N'50mg',  N'1 vez al día',      N'Control de presión arterial',                1, 2),
(4, N'Omeprazol',     N'20mg',  N'En ayunas',         N'Protector gástrico',                         1, 2),
(5, N'Warfarina',     N'5mg',   N'1 vez al día',      N'Anticoagulante, controlar INR mensual',      1, 3),
(6, N'Furosemida',    N'40mg',  N'En la mañana',      N'Diurético para retención de líquidos',       1, 3),
(7, N'Amlodipino',    N'10mg',  N'1 vez al día',      N'Antihipertensivo',                           1, 4),
(8, N'Alprazolam',    N'0.25mg',N'Al dormir',         N'Ansiolítico, solo si es necesario',          1, 5);
SET IDENTITY_INSERT [dbo].[Paciente_Medicamento] OFF;
GO

-- *****************************************************
-- CUIDADOS ESPECIALES
-- *****************************************************

SET IDENTITY_INSERT [dbo].[Paciente_Cuidado_Especial] ON;
INSERT INTO [dbo].[Paciente_Cuidado_Especial] (idPaciente_Cuidado, Detalle, Paciente_idPaciente, Catalogo_Cuidado_Especial_idCuidado) VALUES
(1, N'Alergia a la penicilina y derivados',               1, 1),
(2, N'Dieta baja en sodio y azúcar por diabetes',         1, 3),
(3, N'Cambio de vendaje en pie derecho cada 48 horas',    2, 2),
(4, N'Dieta líquida espesada por dificultad para deglutir',3, 3),
(5, N'Alergia al látex - usar guantes de nitrilo',        3, 1),
(6, N'Cambio de vendaje en rodilla izquierda diario',     3, 2),
(7, N'Dieta blanda sin condimentos por úlcera gástrica',  4, 3),
(8, N'Alergia al ibuprofeno y antiinflamatorios',         5, 1);
SET IDENTITY_INSERT [dbo].[Paciente_Cuidado_Especial] OFF;
GO

-- *****************************************************
-- PAQUETES ADICIONALES
-- *****************************************************

SET IDENTITY_INSERT [dbo].[Paciente_Paquete] ON;
INSERT INTO [dbo].[Paciente_Paquete] (idPaciente_Paquete, Fecha_Asignacion, Activo, Paciente_idPaciente, Catalogo_Paquete_idPaquete) VALUES
(1, '2023-01-10', 1, 1, 1),
(2, '2023-01-10', 1, 1, 2),
(3, '2022-06-15', 1, 2, 1),
(4, '2023-03-20', 1, 3, 3),
(5, '2024-01-05', 1, 4, 1),
(6, '2024-01-05', 1, 4, 2),
(7, '2023-09-12', 1, 5, 3);
SET IDENTITY_INSERT [dbo].[Paciente_Paquete] OFF;
GO

-- *****************************************************
-- HABITACIONES
-- *****************************************************

SET IDENTITY_INSERT [dbo].[Habitacion] ON;
INSERT INTO [dbo].[Habitacion] (idHabitacion, Numero_Habitacion, Piso, Capacidad, Observaciones,
    Catalogo_Tipo_Habitacion_idTipo, Catalogo_Estado_Habitacion_idEstado) VALUES
(1,  N'101', 1, 2, N'Vista al jardín',              1, 1),
(2,  N'102', 1, 2, N'Baño compartido',              1, 1),
(3,  N'103', 1, 1, N'Habitación individual norte',  2, 2),
(4,  N'104', 1, 1, N'Habitación individual sur',    2, 1),
(5,  N'105', 1, 1, N'Individual con TV',            2, 1),
(6,  N'201', 2, 1, N'Suite con sala',               3, 2),
(7,  N'202', 2, 1, N'Suite con balcón',             3, 1),
(8,  N'203', 2, 1, N'Cuidados especiales A',        4, 2),
(9,  N'204', 2, 1, N'Cuidados especiales B',        4, 3),
(10, N'205', 2, 2, N'Compartida con terraza',       1, 4);
SET IDENTITY_INSERT [dbo].[Habitacion] OFF;
GO

-- *****************************************************
-- RESERVACIONES (con estado)
-- *****************************************************

SET IDENTITY_INSERT [dbo].[Reservacion] ON;
INSERT INTO [dbo].[Reservacion] (idReservacion, Fecha_Inicio, Fecha_Fin, Indefinido, Observaciones,
    Fecha_Registro, Activo, Paciente_idPaciente, Habitacion_idHabitacion,
    Catalogo_Tipo_Estancia_idEstancia, Catalogo_Estado_Reservacion_idEstado, Empleado_idEmpleado_Registra) VALUES
(1, '2023-01-10', NULL,         1, N'Estancia indefinida - paciente estable',    GETDATE(), 1, 1, 3, 4, 1, 4),
(2, '2022-06-15', NULL,         1, N'Requiere cuidados especiales',              GETDATE(), 1, 2, 8, 4, 1, 4),
(3, '2023-03-20', NULL,         1, N'Cuidados complejos - hab matrimonial',      GETDATE(), 1, 3, 6, 4, 1, 4),
(4, '2024-01-05', '2024-06-30', 0, N'Estancia temporal por recuperación',       GETDATE(), 1, 4, 1, 1, 1, 4),
(5, '2023-09-12', NULL,         1, N'Estancia indefinida acordada con familia',  GETDATE(), 1, 5, 3, 4, 1, 4);
SET IDENTITY_INSERT [dbo].[Reservacion] OFF;
GO

-- *****************************************************
-- LIMPIEZAS
-- *****************************************************

SET IDENTITY_INSERT [dbo].[Limpieza_Habitacion] ON;
INSERT INTO [dbo].[Limpieza_Habitacion] (idLimpieza_Habitacion, Fecha_Limpieza, Observaciones, Habitacion_idHabitacion, Empleado_idEmpleado) VALUES
(1,  '2024-03-01', N'Limpieza general completa',         1, 3),
(2,  '2024-03-01', N'Limpieza general completa',         2, 3),
(3,  '2024-03-01', N'Desinfección profunda',             3, 3),
(4,  '2024-03-02', N'Limpieza diaria rutinaria',         4, 5),
(5,  '2024-03-02', N'Limpieza diaria rutinaria',         5, 5),
(6,  '2024-03-02', N'Cambio de ropa de cama',            6, 3),
(7,  '2024-03-03', N'Limpieza general',                  7, 5),
(8,  '2024-03-03', N'Desinfección post mantenimiento',   8, 3),
(9,  '2024-03-01', N'Limpieza antes del cierre',         10, 5),
(10, '2024-03-04', N'Limpieza rutinaria',                1, 3),
(11, '2024-03-04', N'Limpieza rutinaria',                3, 5),
(12, '2024-03-05', N'Limpieza profunda semanal',         6, 3);
SET IDENTITY_INSERT [dbo].[Limpieza_Habitacion] OFF;
GO

-- *****************************************************
-- MANTENIMIENTOS
-- *****************************************************

SET IDENTITY_INSERT [dbo].[Mantenimiento_Habitacion] ON;
INSERT INTO [dbo].[Mantenimiento_Habitacion] (idMantenimiento_Habitacion, Fecha_Mantenimiento,
    Descripcion_Reparacion, Actualizacion_Mobiliario, Completado, Habitacion_idHabitacion, Empleado_idEmpleado) VALUES
(1, '2024-02-15', N'Reparación de llave del baño con fuga',      N'Cambio de cortina de baño',       1, 9, 3),
(2, '2024-02-20', N'Cambio de foco en zona de lectura',          NULL,                               1, 9, 5),
(3, '2024-03-01', N'Instalación de pasamanos junto a la cama',   N'Nuevo colchón ortopédico',        1, 8, 3),
(4, '2024-03-10', N'Ajuste de puerta que no cerraba bien',       NULL,                               0, 4, 5),
(5, '2024-03-12', N'Revisión eléctrica del tomacorriente',       N'Cambio de espejo del baño',       0, 9, 3);
SET IDENTITY_INSERT [dbo].[Mantenimiento_Habitacion] OFF;
GO

-- *****************************************************
-- REPARACIONES PENDIENTES
-- *****************************************************

SET IDENTITY_INSERT [dbo].[Reparacion_Pendiente] ON;
INSERT INTO [dbo].[Reparacion_Pendiente] (idReparacion_Pendiente, Descripcion, Fecha_Reporte,
    Fecha_Resolucion, Prioridad, Habitacion_idHabitacion, Empleado_idEmpleado_Reporta, Catalogo_Estado_Reparacion_idEstado) VALUES
(1, N'Pintura de paredes deteriorada',              '2024-03-01', NULL,         N'Baja',  9, 3, 1),
(2, N'Cableado eléctrico general requiere revisión','2024-03-12', NULL,         N'Alta',  9, 3, 2),
(3, N'Cambio de bisagras de puerta principal',      '2024-03-10', NULL,         N'Media', 4, 5, 1),
(4, N'Tubería principal del piso con presión baja', '2024-02-15', '2024-03-05', N'Alta',  9, 3, 3),
(5, N'Ventana con dificultad para abrir',           '2024-03-08', NULL,         N'Baja',  7, 5, 1);
SET IDENTITY_INSERT [dbo].[Reparacion_Pendiente] OFF;
GO
-- *****************************************************
-- ACTIVACION DE RESTRICCIONES DE FK
-- *****************************************************
EXEC sp_MSforeachtable 'ALTER TABLE ? WITH CHECK CHECK CONSTRAINT ALL';
GO

PRINT 'Datos v2.0 insertados exitosamente en Patitos_del_Retiro_DB.';
GO
