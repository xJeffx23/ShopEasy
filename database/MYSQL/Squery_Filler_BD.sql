USE Newtech_DB;

-- CATÁLOGOS BASE
INSERT INTO Catalogo_Genero (Descripcion_Genero) VALUES 
('Masculino'), 
('Femenino'), 
('Otro');

INSERT INTO Catalogo_Telefono_estado (Activo, Descripcion_Catalogo_Telefono) VALUES 
(1, 'Celular'), 
(1, 'Casa');

INSERT INTO Catalogo_estado_stock (Activo, Descripcion_Estado_stock) VALUES 
(1, 'Disponible'), 
(1, 'Agotado');

INSERT INTO Catalogo_Cliente (Descripcion_Catalogo_Cliente, Descuento) VALUES 
('Regular', 0.00), 
('VIP', 10.00);

INSERT INTO Catalogo_metodo_pago (Descripcion_metodo_pago, Activo) VALUES 
('Tarjeta Crédito', 1), 
('Efectivo', 1);

INSERT INTO Catalogo_estado_pago (Descripcion_Catalogo_estado_pago) VALUES 
('Pagado'), 
('Pendiente');

INSERT INTO Catalogo_estado_Pedido (Activo, Descripcion) VALUES 
(1, 'Procesando'), 
(1, 'Enviado'), 
(1, 'Entregado');

INSERT INTO Catalogo_Estado_Envio (Descripcion) VALUES 
('En Bodega'), 
('En Ruta'), 
('Entregado');

INSERT INTO rol_usuario (Nombre_rol, Descripcion) VALUES 
('Administrador', 'Acceso total'), 
('Cliente', 'Acceso limitado');

INSERT INTO Tipo_Direccion (Descripcion_Direccion, Activo) VALUES 
('Casa', 1), 
('Trabajo', 1);

-- PROVINCIAS
INSERT INTO Provincia (Nombre_Provincia) VALUES
('San José'),    -- 1
('Alajuela'),    -- 2
('Cartago'),     -- 3
('Heredia'),     -- 4
('Guanacaste'),  -- 5
('Puntarenas'),  -- 6
('Limón');       -- 7


-- CANTONES
INSERT INTO Canton (Nombre_Canton, Provincia_idProvincia) VALUES
-- San José
('San José', 1),          
('Escazú', 1),            
('Desamparados', 1),      
('Puriscal', 1),          
('Tarrazú', 1),           
('Aserrí', 1),            
('Mora', 1),              
('Goicoechea', 1),        
('Santa Ana', 1),         
('Alajuelita', 1),        
('Vásquez de Coronado', 1), 
('Acosta', 1),            
('Tibás', 1),             
('Moravia', 1),           
('Montes de Oca', 1),     
('Turrubares', 1),        
('Dota', 1),              
('Curridabat', 1),        
('Pérez Zeledón', 1),     
('León Cortés Castro', 1), 
-- Alajuela
('Alajuela', 2),          
('San Ramón', 2),         
('Grecia', 2),            
('San Mateo', 2),         
('Atenas', 2),            
('Naranjo', 2),          
('Palmares', 2),          
('Poás', 2),              
('Orotina', 2),           
('San Carlos', 2),        
('Zarcero', 2),           
('Sarchí', 2),           
('Upala', 2),             
('Los Chiles', 2),        
('Guatuso', 2),           
('Río Cuarto', 2),        
-- Cartago
('Cartago', 3),           
('Paraíso', 3),           
('La Unión', 3),          
('Jiménez', 3),           
('Turrialba', 3),         
('Alvarado', 3),          
('Oreamuno', 3),          
('El Guarco', 3),         
-- Heredia
('Heredia', 4),           
('Barva', 4),             
('Santo Domingo', 4),     
('Santa Bárbara', 4),     
('San Rafael', 4),        
('San Isidro', 4),        
('Belén', 4),             
('Flores', 4),            
('San Pablo', 4),         
('Sarapiquí', 4),         
-- Guanacaste
('Liberia', 5),           
('Nicoya', 5),            
('Santa Cruz', 5),        
('Bagaces', 5),           
('Carrillo', 5),          
('Cañas', 5),             
('Abangares', 5),         
('Tilarán', 5),           
('Nandayure', 5),         
('La Cruz', 5),           
('Hojancha', 5),         
-- Puntarenas
('Puntarenas', 6),       
('Esparza', 6),           
('Buenos Aires', 6),      
('Montes de Oro', 6),     
('Osa', 6),               
('Quepos', 6),            
('Golfito', 6),           
('Coto Brus', 6),         
('Parrita', 6),           
('Corredores', 6),        
('Garabito', 6),          
-- Limón
('Limón', 7),             
('Pococí', 7),            
('Siquirres', 7),         
('Talamanca', 7),         
('Matina', 7),           
('Guácimo', 7);           

-- DISTRITOS - San José
INSERT INTO Distrito (Nombre_Distrito, Codigo_Postal, Canton_id_Canton) VALUES
-- San José
('Carmen', '10101', 1),
('Merced', '10102', 1),
('Hospital', '10103', 1),
('Catedral', '10104', 1),
('Zapote', '10105', 1),
('San Francisco de Dos Ríos', '10106', 1),
('Uruca', '10107', 1),
('Mata Redonda', '10108', 1),
('Pavas', '10109', 1),
('Hatillo', '10110', 1),
('San Sebastián', '10111', 1),
-- Escazú
('Escazú', '10201', 2),
('San Antonio', '10202', 2),
('San Rafael', '10203', 2),
-- Desamparados
('Desamparados', '10301', 3),
('San Miguel', '10302', 3),
('San Juan de Dios', '10303', 3),
('San Rafael Arriba', '10304', 3),
('San Antonio', '10305', 3),
('Frailes', '10306', 3),
('Patarrá', '10307', 3),
('San Cristóbal', '10308', 3),
('Rosario', '10309', 3),
('Damas', '10310', 3),
('San Rafael Abajo', '10311', 3),
('Gravilias', '10312', 3),
('Los Guido', '10313', 3),
-- Puriscal
('Santiago', '10401', 4),
('Mercedes Sur', '10402', 4),
('Barbacoas', '10403', 4),
('Grifo Alto', '10404', 4),
('San Rafael', '10405', 4),
('Candelarita', '10406', 4),
('Desamparaditos', '10407', 4),
('San Antonio', '10408', 4),
('Choi', '10409', 4),
('Zhico', '10410', 4),
-- Tarrazú
('San Marcos', '10501', 5),
('San Lorenzo', '10502', 5),
('San Carlos', '10503', 5),
-- Aserrí
('Aserrí', '10601', 6),
('Tarbaca', '10602', 6),
('Vuelta de Jorco', '10603', 6),
('San Gabriel', '10604', 6),
('La Legua', '10605', 6),
('Monterrey', '10606', 6),
('Salitrillos', '10607', 6),
-- Mora
('Colón', '10701', 7),
('Guayabo', '10702', 7),
('Tabarcia', '10703', 7),
('Piedras Negras', '10704', 7),
('Picagres', '10705', 7),
('Jaris', '10706', 7),
('Quitirrisí', '10707', 7),
-- Goicoechea
('Guadalupe', '10801', 8),
('San Francisco', '10802', 8),
('Calle Blancos', '10803', 8),
('Mata de Plátano', '10804', 8),
('Ipís', '10805', 8),
('Rancho Redondo', '10806', 8),
('Purral', '10807', 8),
-- Santa Ana
('Santa Ana', '10901', 9),
('Salitral', '10902', 9),
('Pozos', '10903', 9),
('Uruca', '10904', 9),
('Piedades', '10905', 9),
('Brasil', '10906', 9),
-- Alajuelita
('Alajuelita', '11001', 10),
('San Josecito', '11002', 10),
('San Antonio', '11003', 10),
('Concepción', '11004', 10),
('San Felipe', '11005', 10),
-- Vásquez de Coronado
('San Isidro', '11101', 11),
('San Rafael', '11102', 11),
('Dulce Nombre de Jesús', '11103', 11),
('Patalillo', '11104', 11),
('Cascajal', '11105', 11),
-- Acosta
('San Ignacio', '11201', 12),
('Guaitil', '11202', 12),
('Palmichal', '11203', 12),
('Cangrejal', '11204', 12),
('Sabanillas', '11205', 12),
-- Tibás
('San Juan', '11301', 13),
('Cinco Esquinas', '11302', 13),
('Anselmo Llorente', '11303', 13),
('León XIII', '11304', 13),
('Colima', '11305', 13),
-- Moravia
('San Vicente', '11401', 14),
('San Jerónimo', '11402', 14),
('La Trinidad', '11403', 14),
-- Montes de Oca
('San Pedro', '11501', 15),
('Sabanilla', '11502', 15),
('Mercedes', '11503', 15),
('San Rafael', '11504', 15),
-- Turrubares
('San Pablo', '11601', 16),
('San Pedro', '11602', 16),
('San Juan de Mata', '11603', 16),
('San Luis', '11604', 16),
('Carara', '11605', 16),
-- Dota
('Santa María', '11701', 17),
('Jardín', '11702', 17),
('Copey', '11703', 17),
-- Curridabat
('Curridabat', '11801', 18),
('Granadilla', '11802', 18),
('Sánchez', '11803', 18),
('Tirrases', '11804', 18),
--  Pérez Zeledón
('San Isidro de El General', '11901', 19),
('El General', '11902', 19),
('Daniel Flores', '11903', 19),
('Rivas', '11904', 19),
('San Pedro', '11905', 19),
('Platanares', '11906', 19),
('Pejibaye', '11907', 19),
('Cajón', '11908', 19),
('Barú', '11909', 19),
('Río Nuevo', '11910', 19),
('Páramo', '11911', 19),
('La Amistad', '11912', 19),
--  León Cortés Castro
('San Pablo', '12001', 20),
('San Andrés', '12002', 20),
('Llano Bonito', '12003', 20),
('San Isidro', '12004', 20),
('Santa Cruz', '12005', 20),
('San Antonio', '12006', 20);

-- DISTRITOS - Alajuela
INSERT INTO Distrito (Nombre_Distrito, Codigo_Postal, Canton_id_Canton) VALUES
-- Alajuela
('Alajuela', '20101', 21),
('San José', '20102', 21),
('Carrizal', '20103', 21),
('San Antonio', '20104', 21),
('Guácimo', '20105', 21),
('San Isidro', '20106', 21),
('Sarapiquí', '20107', 21),
('San Rafael', '20108', 21),
('Río Segundo', '20109', 21),
('Desamparados', '20110', 21),
('Turrúcares', '20111', 21),
('Tambor', '20112', 21),
('Garita', '20113', 21),
('Sabanilla', '20114', 21),
-- San Ramón
('San Ramón', '20201', 22),
('Santiago', '20202', 22),
('San Juan', '20203', 22),
('Piedades Norte', '20204', 22),
('Piedades Sur', '20205', 22),
('San Rafael', '20206', 22),
('San Isidro', '20207', 22),
('Ángeles', '20208', 22),
('Alfaro', '20209', 22),
('Volio', '20210', 22),
('Concepción', '20211', 22),
('Zapotal', '20212', 22),
('Peñas Blancas', '20213', 22),
('San Lorenzo', '20214', 22),
-- Grecia
('Grecia', '20301', 23),
('San Isidro', '20302', 23),
('San José', '20303', 23),
('San Roque', '20304', 23),
('Tacares', '20305', 23),
('Río Cuarto', '20306', 23),
('Puente de Piedra', '20307', 23),
('Bolívar', '20308', 23),
-- San Mateo
('San Mateo', '20401', 24),
('Desmonte', '20402', 24),
('Jesús María', '20403', 24),
('Labrador', '20404', 24),
-- Atenas
('Atenas', '20501', 25),
('Jesús', '20502', 25),
('Mercedes', '20503', 25),
('San Isidro', '20504', 25),
('Concepción', '20505', 25),
('San José', '20506', 25),
('Santa Eulalia', '20507', 25),
('Escobal', '20508', 25),
-- Naranjo
('Naranjo', '20601', 26),
('San Miguel', '20602', 26),
('San José', '20603', 26),
('Cirrí Sur', '20604', 26),
('San Jerónimo', '20605', 26),
('San Juan', '20606', 26),
('El Rosario', '20607', 26),
('Palmitos', '20608', 26),
-- Palmares
('Palmares', '20701', 27),
('Zaragoza', '20702', 27),
('Buenos Aires', '20703', 27),
('Santiago', '20704', 27),
('Candelaria', '20705', 27),
('Esquipulas', '20706', 27),
('La Granja', '20707', 27),
-- Poás
('San Pedro', '20801', 28),
('San Juan', '20802', 28),
('San Rafael', '20803', 28),
('Carrillos', '20804', 28),
('Sabana Redonda', '20805', 28),
-- Orotina
('Orotina', '20901', 29),
('El Mastate', '20902', 29),
('Hacienda Vieja', '20903', 29),
('Coyolar', '20904', 29),
('La Ceiba', '20905', 29),
-- San Carlos
('Ciudad Quesada', '21001', 30),
('Florencia', '21002', 30),
('Buenavista', '21003', 30),
('Aguas Zarcas', '21004', 30),
('Venecia', '21005', 30),
('Pital', '21006', 30),
('La Fortuna', '21007', 30),
('La Tigra', '21008', 30),
('La Palmera', '21009', 30),
('Venado', '21010', 30),
('Cutris', '21011', 30),
('Monterrey', '21012', 30),
('Pocosol', '21013', 30),
-- Zarcero
('Zarcero', '21101', 31),
('Laguna', '21102', 31),
('Tapesco', '21103', 31),
('Guadalupe', '21104', 31),
('Palmira', '21105', 31),
('Zapote', '21106', 31),
('Brisas', '21107', 31),
-- Sarchí
('Sarchí Norte', '21201', 32),
('Sarchí Sur', '21202', 32),
('Toro Amarillo', '21203', 32),
('San Pedro', '21204', 32),
('Rodríguez', '21205', 32),
-- Upala
('Upala', '21301', 33),
('Aguas Claras', '21302', 33),
('San José o Pizote', '21303', 33),
('Bijagua', '21304', 33),
('Delicias', '21305', 33),
('Dos Ríos', '21306', 33),
('Yolillal', '21307', 33),
('Canalete', '21308', 33),
-- Los Chiles
('Los Chiles', '21401', 34),
('Caño Negro', '21402', 34),
('El Amparo', '21403', 34),
('San Jorge', '21404', 34),
-- Guatuso
('San Rafael', '21501', 35),
('Buenavista', '21502', 35),
('Cote', '21503', 35),
('Katira', '21504', 35),
-- Río Cuarto
('Río Cuarto', '21601', 36),
('Santa Rita', '21602', 36),
('Santa Isabel', '21603', 36);

-- DISTRITOS - Cartago
INSERT INTO Distrito (Nombre_Distrito, Codigo_Postal, Canton_id_Canton) VALUES
-- Cartago
('Oriental', '30101', 37),
('Occidental', '30102', 37),
('Carmen', '30103', 37),
('San Nicolás', '30104', 37),
('Aguacaliente', '30105', 37),
('Guadalupe', '30106', 37),
('Corralillo', '30107', 37),
('Tierra Blanca', '30108', 37),
('Dulce Nombre', '30109', 37),
('Llano Grande', '30110', 37),
('Quebradilla', '30111', 37),
-- Paraíso
('Paraíso', '30201', 38),
('Santiago', '30202', 38),
('Orosi', '30203', 38),
('Cachí', '30204', 38),
('Llanos de Santa Lucía', '30205', 38),
-- La Unión
('Tres Ríos', '30301', 39),
('San Diego', '30302', 39),
('San Juan', '30303', 39),
('San Rafael', '30304', 39),
('Concepción', '30305', 39),
('Dulce Nombre', '30306', 39),
('San Ramón', '30307', 39),
('Río Azul', '30308', 39),
-- Jiménez
('Juan Viñas', '30401', 40),
('Tucurrique', '30402', 40),
('Pejibaye', '30403', 40),
-- Turrialba
('Turrialba', '30501', 41),
('La Suiza', '30502', 41),
('Peralta', '30503', 41),
('Santa Cruz', '30504', 41),
('Santa Teresita', '30505', 41),
('Pavones', '30506', 41),
('Tuis', '30507', 41),
('Tayutic', '30508', 41),
('Santa Rosa', '30509', 41),
('Tres Equis', '30510', 41),
('La Isabel', '30511', 41),
('Chirripó', '30512', 41),
-- Alvarado
('Pacayas', '30601', 42),
('Cervantes', '30602', 42),
('Capellades', '30603', 42),
--  Oreamuno
('San Rafael', '30701', 43),
('Cot', '30702', 43),
('Potrero Cerrado', '30703', 43),
('Cipreses', '30704', 43),
('Santa Rosa', '30705', 43),
--  El Guarco
('El Tejar', '30801', 44),
('San Isidro', '30802', 44),
('Tobosi', '30803', 44),
('Patio de Agua', '30804', 44);

-- DISTRITOS - Heredia

INSERT INTO Distrito (Nombre_Distrito, Codigo_Postal, Canton_id_Canton) VALUES
--  Heredia
('Heredia', '40101', 45),
('Mercedes', '40102', 45),
('San Francisco', '40103', 45),
('Ulloa', '40104', 45),
('Varablanca', '40105', 45),
--  Barva
('Barva', '40201', 46),
('San Pedro', '40202', 46),
('San Pablo', '40203', 46),
('San Roque', '40204', 46),
('Santa Lucía', '40205', 46),
('San José de la Montaña', '40206', 46),
--  Santo Domingo
('Santo Domingo', '40301', 47),
('San Vicente', '40302', 47),
('San Miguel', '40303', 47),
('Paracito', '40304', 47),
('Santo Tomás', '40305', 47),
('Santa Rosa', '40306', 47),
('Tures', '40307', 47),
('Para', '40308', 47),
--  Santa Bárbara
('Santa Bárbara', '40401', 48),
('San Pedro', '40402', 48),
('San Juan', '40403', 48),
('Jesús', '40404', 48),
('Santo Domingo', '40405', 48),
('Puraba', '40406', 48),
-- San Rafael
('San Rafael', '40501', 49),
('San Josecito', '40502', 49),
('Santiago', '40503', 49),
('Ángeles', '40504', 49),
('Concepción', '40505', 49),
--  San Isidro
('San Isidro', '40601', 50),
('San José', '40602', 50),
('Concepción', '40603', 50),
('San Francisco', '40604', 50),
--  Belén
('San Antonio', '40701', 51),
('La Ribera', '40702', 51),
('La Asunción', '40703', 51),
--  Flores
('San Joaquín', '40801', 52),
('Barrantes', '40802', 52),
('Llorente', '40803', 52),
--  San Pablo
('San Pablo', '40901', 53),
('Rincón de Sabanilla', '40902', 53),
--  Sarapiquí
('Puerto Viejo', '41001', 54),
('La Virgen', '41002', 54),
('Las Horquetas', '41003', 54),
('Llanuras del Gaspar', '41004', 54),
('Cureña', '41005', 54);

-- DISTRITOS - Guanacaste
INSERT INTO Distrito (Nombre_Distrito, Codigo_Postal, Canton_id_Canton) VALUES
-- Canton 55: Liberia
('Liberia', '50101', 55),
('Cañas Dulces', '50102', 55),
('Mayorga', '50103', 55),
('Nacascolo', '50104', 55),
('Curubandé', '50105', 55),
--  Nicoya
('Nicoya', '50201', 56),
('Mansión', '50202', 56),
('San Antonio', '50203', 56),
('Quebrada Honda', '50204', 56),
('Sámara', '50205', 56),
('Nosara', '50206', 56),
('Belén de Nosarita', '50207', 56),
--  Santa Cruz
('Santa Cruz', '50301', 57),
('Bolsón', '50302', 57),
('Veintisiete de Abril', '50303', 57),
('Tempate', '50304', 57),
('Cartagena', '50305', 57),
('Cuajiniquil', '50306', 57),
('Diriá', '50307', 57),
('Cabo Velas', '50308', 57),
('Tamarindo', '50309', 57),
--  Bagaces
('Bagaces', '50401', 58),
('La Fortuna', '50402', 58),
('Mogote', '50403', 58),
('Río Naranjo', '50404', 58),
--  Carrillo
('Filadelfia', '50501', 59),
('Palmira', '50502', 59),
('Sardinal', '50503', 59),
('Belén', '50504', 59),
--  Cañas
('Cañas', '50601', 60),
('Palmira', '50602', 60),
('San Miguel', '50603', 60),
('Bebedero', '50604', 60),
('Porozal', '50605', 60),
--  Abangares
('Las Juntas', '50701', 61),
('Sierra', '50702', 61),
('San Juan', '50703', 61),
('Colorado', '50704', 61),
--  Tilarán
('Tilarán', '50801', 62),
('Quebrada Grande', '50802', 62),
('Tronadora', '50803', 62),
('Santa Rosa', '50804', 62),
('Líbano', '50805', 62),
('Tierras Morenas', '50806', 62),
('Arenal', '50807', 62),
('Cabeceras', '50808', 62),
--  Nandayure
('Carmona', '50901', 63),
('Santa Rita', '50902', 63),
('Zapotal', '50903', 63),
('San Pablo', '50904', 63),
('Porvenir', '50905', 63),
('Bejuco', '50906', 63),
--  La Cruz
('La Cruz', '51001', 64),
('Santa Cecilia', '51002', 64),
('La Garita', '51003', 64),
('Santa Elena', '51004', 64),
--  Hojancha
('Hojancha', '51101', 65),
('Monte Romo', '51102', 65),
('Puerto Carrillo', '51103', 65),
('Huacas', '51104', 65),
('Matambú', '51105', 65);
-- DISTRITOS - Puntarenas
INSERT INTO Distrito (Nombre_Distrito, Codigo_Postal, Canton_id_Canton) VALUES
-- Puntarenas
('Puntarenas', '60101', 66),
('Pitahaya', '60102', 66),
('Chomes', '60103', 66),
('Lepanto', '60104', 66),
('Paquera', '60105', 66),
('Manzanillo', '60106', 66),
('Guacimal', '60107', 66),
('Barranca', '60108', 66),
('Monte Verde', '60109', 66),
('Isla del Coco', '60110', 66),
('Cóbano', '60111', 66),
('Chacarita', '60112', 66),
('Chira', '60113', 66),
('Acapulco', '60114', 66),
('El Roble', '60115', 66),
('Arancibia', '60116', 66),
-- Esparza
('Espíritu Santo', '60201', 67),
('San Juan Grande', '60202', 67),
('Macacona', '60203', 67),
('San Rafael', '60204', 67),
('San Jerónimo', '60205', 67),
('Caldera', '60206', 67),
-- Buenos Aires
('Buenos Aires', '60301', 68),
('Volcán', '60302', 68),
('Potrero Grande', '60303', 68),
('Boruca', '60304', 68),
('Pilas', '60305', 68),
('Colinas', '60306', 68),
('Chánguena', '60307', 68),
('Biolley', '60308', 68),
('Brunka', '60309', 68),
--  Montes de Oro
('Miramar', '60401', 69),
('La Unión', '60402', 69),
('San Isidro', '60403', 69),
--  Osa
('Puerto Cortés', '60501', 70),
('Palmar', '60502', 70),
('Sierpe', '60503', 70),
('Bahía Ballena', '60504', 70),
('Piedras Blancas', '60505', 70),
('Bahía Drake', '60506', 70),
--  Quepos
('Quepos', '60601', 71),
('Savegre', '60602', 71),
('Naranjito', '60603', 71),
--  Golfito
('Golfito', '60701', 72),
('Puerto Jiménez', '60702', 72),
('Guaycará', '60703', 72),
('Pavón', '60704', 72),
--  Coto Brus
('San Vito', '60801', 73),
('Sabalito', '60802', 73),
('Aguabuena', '60803', 73),
('Limoncito', '60804', 73),
('Pittier', '60805', 73),
('Gutiérrez Braun', '60806', 73),
--  Parrita
('Parrita', '60901', 74),
('Quepos', '60902', 74),
('Savegre', '60903', 74),
--  Corredores
('Corredor', '61001', 75),
('La Cuesta', '61002', 75),
('Canoas', '61003', 75),
('Laurel', '61004', 75),
--  Garabito
('Jacó', '61101', 76),
('Tárcoles', '61102', 76),
('El Roble', '61103', 76);

-- DISTRITOS - Limón
INSERT INTO Distrito (Nombre_Distrito, Codigo_Postal, Canton_id_Canton) VALUES
--  Limón
('Limón', '70101', 77),
('Valle La Estrella', '70102', 77),
('Río Blanco', '70103', 77),
('Matama', '70104', 77),
-- : Pococí
('Guápiles', '70201', 78),
('Jiménez', '70202', 78),
('Rita', '70203', 78),
('Roxana', '70204', 78),
('Cariari', '70205', 78),
('Colorado', '70206', 78),
('La Colonia', '70207', 78),
--  Siquirres
('Siquirres', '70301', 79),
('Pacuarito', '70302', 79),
('Florida', '70303', 79),
('Germania', '70304', 79),
('El Cairo', '70305', 79),
('Alegría', '70306', 79),
('Reventazón', '70307', 79),
--  Talamanca
('Bratsi', '70401', 80),
('Sixaola', '70402', 80),
('Cahuita', '70403', 80),
('Telire', '70404', 80),
--  Matina
('Matina', '70501', 81),
('Batán', '70502', 81),
('Carrandi', '70503', 81),
--  Guácimo
('Guácimo', '70601', 82),
('Mercedes', '70602', 82),
('Pocora', '70603', 82),
('Río Jiménez', '70604', 82),
('Duacarí', '70605', 82);

-- DATOS DE PRUEBA
INSERT INTO Persona (Nombre, Apellido1, Apellido2, Telefono, Activo, 
  Catalogo_Telefono_estado_idCatalogo_Telefono_estado, Catalogo_Genero_idCatalogo_Genero, Email)
VALUES ('Andrés', 'Rodríguez', 'Chaves', '8888-7777', 1, 1, 1, 'andres@ejemplo.com');

INSERT INTO Cliente (Activo, Fecha_Registro, Catalogo_Cliente_idCatalogo_Cliente, Persona_id_Persona1)
VALUES (1, NOW(), 1, 1);

INSERT INTO Usuario (Email, Activo, Fecha_creacion, Contraseña, Nombre_usuario, 
  rol_usuario_idrol_usuario, Persona_id_Persona)
VALUES ('andres@ejemplo.com', 1, NOW(), 'pass123', 'arodriguez', 1, 1);

INSERT INTO Direccion (Otras_señas, Tipo_Direccion_idTipo_Direccion, Persona_id_Persona, Distrito_idDistrito)
VALUES ('100m norte del parque central', 1, 1, 1);

INSERT INTO producto (Nombre_producto, precio, descripcion_producto, Activo, 
  Catalogo_estado_stock_idCatalogo_estado_stock)
VALUES 
('Monitor 24 pulgadas', 150.00, 'FHD 75Hz', 1, 1),
('Teclado Mecánico', 80.00, 'RGB Switch Blue', 1, 1);

INSERT INTO Factura (fecha_factura, Total, anulada) 
VALUES (NOW(), 230.00, 0);

INSERT INTO Pago (Fecha_pago, Monto, Activo, Catalogo_metodo_pago_idCatalogo_metodo_pago, 
  Catalogo_estado_pago_idCatalogo_estado_pago, Factura_idFactura)
VALUES (NOW(), 230.00, 1, 1, 1, 1);

INSERT INTO Pedido (Fecha_Pedido, Total, Cliente_id_Cliente, Factura_idFactura, 
  Catalogo_estado_Pedido_idCatalogo_estado_Pedido)
VALUES (NOW(), 230.00, 1, 1, 1);

INSERT INTO pedido_detalle (Cantidad, Precio_unitario, Subtotal, producto_idproducto, Pedido_idPedido)
VALUES 
(1, 150.00, 150.00, 1, 1),
(1, 80.00, 80.00, 2, 1);

INSERT INTO Factura_Detalle (Cantidad, SubTotal, Precio, Factura_idFactura, producto_idproducto)
VALUES 
(1, 150.00, 150.00, 1, 1),
(1, 80.00, 80.00, 1, 2);

INSERT INTO Envio (Fecha_envio, Fecha_entrega, Direccion_entrega, Pedido_idPedido, 
  Catalogo_Estado_Envio_idCatalogo_Estado_Envio)
VALUES (NOW(), NULL, '100m norte del parque central', 1, 1);

-- **************************************************************************************************************************************************
-- Insersion de datos de varios clientes más
INSERT INTO Persona (Nombre, Apellido1, Apellido2, Telefono, Activo,
  Catalogo_Telefono_estado_idCatalogo_Telefono_estado, Catalogo_Genero_idCatalogo_Genero, Email)
VALUES ('María', 'González', 'López', '7777-1234', 1, 1, 2, 'maria@ejemplo.com');

INSERT INTO Cliente (Activo, Fecha_Registro, Catalogo_Cliente_idCatalogo_Cliente, Persona_id_Persona1)
VALUES (1, NOW(), 2, 2); 

INSERT INTO Usuario (Email, Activo, Fecha_creacion, Contraseña, Nombre_usuario,
  rol_usuario_idrol_usuario, Persona_id_Persona)
VALUES ('maria@ejemplo.com', 1, NOW(), 'pass456', 'mgonzalez', 2, 2);

INSERT INTO Direccion (Otras_señas, Tipo_Direccion_idTipo_Direccion, Persona_id_Persona, Distrito_idDistrito)
VALUES ('200m sur del banco', 2, 2, 5);

-- Producto agotado
INSERT INTO producto (Nombre_producto, precio, descripcion_producto, Activo,
  Catalogo_estado_stock_idCatalogo_estado_stock)
VALUES ('Mouse Gamer', 45.00, 'DPI 1600 RGB', 1, 2); 


INSERT INTO Factura (fecha_factura, Total, anulada)
VALUES (NOW(), 45.00, 0);

INSERT INTO Pago (Fecha_pago, Monto, Activo, Catalogo_metodo_pago_idCatalogo_metodo_pago,
  Catalogo_estado_pago_idCatalogo_estado_pago, Factura_idFactura)
VALUES (NOW(), 45.00, 1, 2, 2, 2); 

INSERT INTO Pedido (Fecha_Pedido, Total, Cliente_id_Cliente, Factura_idFactura,
  Catalogo_estado_Pedido_idCatalogo_estado_Pedido)
VALUES (NOW(), 45.00, 2, 2, 3); 

INSERT INTO pedido_detalle (Cantidad, Precio_unitario, Subtotal, producto_idproducto, Pedido_idPedido)
VALUES (1, 45.00, 45.00, 3, 2);

INSERT INTO Factura_Detalle (Cantidad, SubTotal, Precio, Factura_idFactura, producto_idproducto)
VALUES (1, 45.00, 45.00, 2, 3);


INSERT INTO Envio (Fecha_envio, Fecha_entrega, Direccion_entrega, Pedido_idPedido,
  Catalogo_Estado_Envio_idCatalogo_Estado_Envio)
VALUES (NOW(), NOW(), '200m sur del banco', 2, 3); 