-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema patitos_del_retiro_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema patitos_del_retiro_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `patitos_del_retiro_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `patitos_del_retiro_db` ;

-- -----------------------------------------------------
-- Table `patitos_del_retiro_db`.`catalogo_cuidado_especial`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `patitos_del_retiro_db`.`catalogo_cuidado_especial` ;

CREATE TABLE IF NOT EXISTS `patitos_del_retiro_db`.`catalogo_cuidado_especial` (
  `idCatalogo_Cuidado_Especial` INT NOT NULL AUTO_INCREMENT,
  `Descripcion_Cuidado` VARCHAR(100) NOT NULL,
  `Activo` TINYINT(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`idCatalogo_Cuidado_Especial`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `patitos_del_retiro_db`.`catalogo_departamento`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `patitos_del_retiro_db`.`catalogo_departamento` ;

CREATE TABLE IF NOT EXISTS `patitos_del_retiro_db`.`catalogo_departamento` (
  `idCatalogo_Departamento` INT NOT NULL AUTO_INCREMENT,
  `Nombre_Departamento` VARCHAR(50) NOT NULL,
  `Activo` TINYINT(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`idCatalogo_Departamento`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `patitos_del_retiro_db`.`catalogo_estado_habitacion`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `patitos_del_retiro_db`.`catalogo_estado_habitacion` ;

CREATE TABLE IF NOT EXISTS `patitos_del_retiro_db`.`catalogo_estado_habitacion` (
  `idCatalogo_Estado_Habitacion` INT NOT NULL AUTO_INCREMENT,
  `Descripcion_Estado` VARCHAR(50) NOT NULL,
  `Activo` TINYINT(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`idCatalogo_Estado_Habitacion`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `patitos_del_retiro_db`.`catalogo_estado_reparacion`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `patitos_del_retiro_db`.`catalogo_estado_reparacion` ;

CREATE TABLE IF NOT EXISTS `patitos_del_retiro_db`.`catalogo_estado_reparacion` (
  `idCatalogo_Estado_Reparacion` INT NOT NULL AUTO_INCREMENT,
  `Descripcion_Estado` VARCHAR(50) NOT NULL,
  `Activo` TINYINT(1) NOT NULL DEFAULT '1',
  `catalogo_estado_reparacioncol` VARCHAR(45) NOT NULL,
  `catalogo_estado_reparacioncol1` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idCatalogo_Estado_Reparacion`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `patitos_del_retiro_db`.`catalogo_estado_reservacion`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `patitos_del_retiro_db`.`catalogo_estado_reservacion` ;

CREATE TABLE IF NOT EXISTS `patitos_del_retiro_db`.`catalogo_estado_reservacion` (
  `idCatalogo_Estado_Reservacion` INT NOT NULL AUTO_INCREMENT,
  `Descripcion_Estado` VARCHAR(50) NOT NULL,
  `Activo` TINYINT(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`idCatalogo_Estado_Reservacion`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `patitos_del_retiro_db`.`catalogo_nivel_asistencia`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `patitos_del_retiro_db`.`catalogo_nivel_asistencia` ;

CREATE TABLE IF NOT EXISTS `patitos_del_retiro_db`.`catalogo_nivel_asistencia` (
  `idCatalogo_Nivel_Asistencia` INT NOT NULL AUTO_INCREMENT,
  `Descripcion_Nivel` VARCHAR(100) NOT NULL,
  `Activo` TINYINT(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`idCatalogo_Nivel_Asistencia`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `patitos_del_retiro_db`.`catalogo_paquete_adicional`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `patitos_del_retiro_db`.`catalogo_paquete_adicional` ;

CREATE TABLE IF NOT EXISTS `patitos_del_retiro_db`.`catalogo_paquete_adicional` (
  `idCatalogo_Paquete_Adicional` INT NOT NULL AUTO_INCREMENT,
  `Nombre_Paquete` VARCHAR(100) NOT NULL,
  `Descripcion` VARCHAR(200) NOT NULL,
  `Costo_Adicional` DECIMAL(10,2) NOT NULL DEFAULT '0.00',
  `Activo` TINYINT(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`idCatalogo_Paquete_Adicional`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `patitos_del_retiro_db`.`catalogo_perfil_usuario`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `patitos_del_retiro_db`.`catalogo_perfil_usuario` ;

CREATE TABLE IF NOT EXISTS `patitos_del_retiro_db`.`catalogo_perfil_usuario` (
  `idCatalogo_Perfil_Usuario` INT NOT NULL AUTO_INCREMENT,
  `Nombre_Perfil` VARCHAR(50) NOT NULL,
  `Descripcion` VARCHAR(200) NOT NULL,
  `Activo` TINYINT(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`idCatalogo_Perfil_Usuario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `patitos_del_retiro_db`.`catalogo_tipo_estancia`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `patitos_del_retiro_db`.`catalogo_tipo_estancia` ;

CREATE TABLE IF NOT EXISTS `patitos_del_retiro_db`.`catalogo_tipo_estancia` (
  `idCatalogo_Tipo_Estancia` INT NOT NULL AUTO_INCREMENT,
  `Descripcion_Estancia` VARCHAR(100) NOT NULL,
  `Hora_Inicio` VARCHAR(10) NOT NULL,
  `Hora_Fin` VARCHAR(10) NOT NULL,
  `Activo` TINYINT(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`idCatalogo_Tipo_Estancia`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `patitos_del_retiro_db`.`catalogo_tipo_habitacion`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `patitos_del_retiro_db`.`catalogo_tipo_habitacion` ;

CREATE TABLE IF NOT EXISTS `patitos_del_retiro_db`.`catalogo_tipo_habitacion` (
  `idCatalogo_Tipo_Habitacion` INT NOT NULL AUTO_INCREMENT,
  `Nombre_Tipo` VARCHAR(100) NOT NULL,
  `Descripcion` VARCHAR(200) NOT NULL,
  `Costo_Por_Dia` DECIMAL(10,2) NOT NULL,
  `Activo` TINYINT(1) NOT NULL DEFAULT '1',
  `catalogo_tipo_habitacioncol` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idCatalogo_Tipo_Habitacion`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `patitos_del_retiro_db`.`empleado`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `patitos_del_retiro_db`.`empleado` ;

CREATE TABLE IF NOT EXISTS `patitos_del_retiro_db`.`empleado` (
  `idEmpleado` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(100) NOT NULL,
  `Numero_Cedula` VARCHAR(20) NOT NULL,
  `Fecha_Ingreso` DATE NOT NULL,
  `Telefono` VARCHAR(20) NOT NULL,
  `Email` VARCHAR(255) NOT NULL,
  `Activo` TINYINT(1) NOT NULL DEFAULT '1',
  `Catalogo_Departamento_idDepartamento` INT NOT NULL,
  `Catalogo_Perfil_Usuario_idPerfil` INT NOT NULL,
  PRIMARY KEY (`idEmpleado`),
  UNIQUE INDEX `Numero_Cedula` (`Numero_Cedula` ASC) VISIBLE,
  INDEX `Catalogo_Departamento_idDepartamento` (`Catalogo_Departamento_idDepartamento` ASC) VISIBLE,
  INDEX `Catalogo_Perfil_Usuario_idPerfil` (`Catalogo_Perfil_Usuario_idPerfil` ASC) VISIBLE,
  CONSTRAINT `empleado_ibfk_1`
    FOREIGN KEY (`Catalogo_Departamento_idDepartamento`)
    REFERENCES `patitos_del_retiro_db`.`catalogo_departamento` (`idCatalogo_Departamento`),
  CONSTRAINT `empleado_ibfk_2`
    FOREIGN KEY (`Catalogo_Perfil_Usuario_idPerfil`)
    REFERENCES `patitos_del_retiro_db`.`catalogo_perfil_usuario` (`idCatalogo_Perfil_Usuario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `patitos_del_retiro_db`.`habitacion`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `patitos_del_retiro_db`.`habitacion` ;

CREATE TABLE IF NOT EXISTS `patitos_del_retiro_db`.`habitacion` (
  `idHabitacion` INT NOT NULL AUTO_INCREMENT,
  `Numero_Habitacion` VARCHAR(10) NOT NULL,
  `Piso` INT NOT NULL,
  `Capacidad` INT NOT NULL DEFAULT '1',
  `Observaciones` VARCHAR(300) NOT NULL,
  `Catalogo_Tipo_Habitacion_idTipo` INT NOT NULL,
  `Catalogo_Estado_Habitacion_idEstado` INT NOT NULL,
  `catalogo_estado_reparacion_idCatalogo_Estado_Reparacion` INT NOT NULL,
  PRIMARY KEY (`idHabitacion`),
  UNIQUE INDEX `Numero_Habitacion` (`Numero_Habitacion` ASC) VISIBLE,
  INDEX `Catalogo_Tipo_Habitacion_idTipo` (`Catalogo_Tipo_Habitacion_idTipo` ASC) VISIBLE,
  INDEX `Catalogo_Estado_Habitacion_idEstado` (`Catalogo_Estado_Habitacion_idEstado` ASC) VISIBLE,
  INDEX `fk_habitacion_catalogo_estado_reparacion1_idx` (`catalogo_estado_reparacion_idCatalogo_Estado_Reparacion` ASC) VISIBLE,
  CONSTRAINT `habitacion_ibfk_1`
    FOREIGN KEY (`Catalogo_Tipo_Habitacion_idTipo`)
    REFERENCES `patitos_del_retiro_db`.`catalogo_tipo_habitacion` (`idCatalogo_Tipo_Habitacion`),
  CONSTRAINT `habitacion_ibfk_2`
    FOREIGN KEY (`Catalogo_Estado_Habitacion_idEstado`)
    REFERENCES `patitos_del_retiro_db`.`catalogo_estado_habitacion` (`idCatalogo_Estado_Habitacion`),
  CONSTRAINT `fk_habitacion_catalogo_estado_reparacion1`
    FOREIGN KEY (`catalogo_estado_reparacion_idCatalogo_Estado_Reparacion`)
    REFERENCES `patitos_del_retiro_db`.`catalogo_estado_reparacion` (`idCatalogo_Estado_Reparacion`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `patitos_del_retiro_db`.`paciente`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `patitos_del_retiro_db`.`paciente` ;

CREATE TABLE IF NOT EXISTS `patitos_del_retiro_db`.`paciente` (
  `idPaciente` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(100) NOT NULL,
  `Numero_Cedula` VARCHAR(20) NOT NULL,
  `Fecha_Nacimiento` DATE NOT NULL,
  `Fecha_Ingreso` DATE NOT NULL,
  `Telefono_Contacto_Emergencia` VARCHAR(20) NOT NULL,
  `Nombre_Contacto_Emergencia` VARCHAR(100) NOT NULL,
  `Activo` TINYINT(1) NOT NULL DEFAULT '1',
  `Catalogo_Nivel_Asistencia_idNivel` INT NOT NULL,
  PRIMARY KEY (`idPaciente`),
  UNIQUE INDEX `Numero_Cedula` (`Numero_Cedula` ASC) VISIBLE,
  INDEX `Catalogo_Nivel_Asistencia_idNivel` (`Catalogo_Nivel_Asistencia_idNivel` ASC) VISIBLE,
  CONSTRAINT `paciente_ibfk_1`
    FOREIGN KEY (`Catalogo_Nivel_Asistencia_idNivel`)
    REFERENCES `patitos_del_retiro_db`.`catalogo_nivel_asistencia` (`idCatalogo_Nivel_Asistencia`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `patitos_del_retiro_db`.`paciente_cuidado_especial`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `patitos_del_retiro_db`.`paciente_cuidado_especial` ;

CREATE TABLE IF NOT EXISTS `patitos_del_retiro_db`.`paciente_cuidado_especial` (
  `idPaciente_Cuidado` INT NOT NULL AUTO_INCREMENT,
  `Detalle` VARCHAR(300) NOT NULL,
  `Paciente_idPaciente` INT NOT NULL,
  `Catalogo_Cuidado_Especial_idCuidado` INT NOT NULL,
  PRIMARY KEY (`idPaciente_Cuidado`),
  INDEX `Paciente_idPaciente` (`Paciente_idPaciente` ASC) VISIBLE,
  INDEX `Catalogo_Cuidado_Especial_idCuidado` (`Catalogo_Cuidado_Especial_idCuidado` ASC) VISIBLE,
  CONSTRAINT `paciente_cuidado_especial_ibfk_1`
    FOREIGN KEY (`Paciente_idPaciente`)
    REFERENCES `patitos_del_retiro_db`.`paciente` (`idPaciente`),
  CONSTRAINT `paciente_cuidado_especial_ibfk_2`
    FOREIGN KEY (`Catalogo_Cuidado_Especial_idCuidado`)
    REFERENCES `patitos_del_retiro_db`.`catalogo_cuidado_especial` (`idCatalogo_Cuidado_Especial`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `patitos_del_retiro_db`.`paciente_medicamento`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `patitos_del_retiro_db`.`paciente_medicamento` ;

CREATE TABLE IF NOT EXISTS `patitos_del_retiro_db`.`paciente_medicamento` (
  `idPaciente_Medicamento` INT NOT NULL AUTO_INCREMENT,
  `Nombre_Medicamento` VARCHAR(100) NOT NULL,
  `Dosis` VARCHAR(100) NOT NULL,
  `Frecuencia` VARCHAR(100) NOT NULL,
  `Indicaciones` VARCHAR(300) NOT NULL,
  `Activo` TINYINT(1) NOT NULL DEFAULT '1',
  `Paciente_idPaciente` INT NOT NULL,
  PRIMARY KEY (`idPaciente_Medicamento`),
  INDEX `Paciente_idPaciente` (`Paciente_idPaciente` ASC) VISIBLE,
  CONSTRAINT `paciente_medicamento_ibfk_1`
    FOREIGN KEY (`Paciente_idPaciente`)
    REFERENCES `patitos_del_retiro_db`.`paciente` (`idPaciente`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `patitos_del_retiro_db`.`paciente_paquete`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `patitos_del_retiro_db`.`paciente_paquete` ;

CREATE TABLE IF NOT EXISTS `patitos_del_retiro_db`.`paciente_paquete` (
  `idPaciente_Paquete` INT NOT NULL AUTO_INCREMENT,
  `Fecha_Asignacion` DATETIME NOT NULL,
  `Activo` TINYINT(1) NOT NULL DEFAULT '1',
  `Paciente_idPaciente` INT NOT NULL,
  `Catalogo_Paquete_idPaquete` INT NOT NULL,
  PRIMARY KEY (`idPaciente_Paquete`),
  INDEX `Paciente_idPaciente` (`Paciente_idPaciente` ASC) VISIBLE,
  INDEX `Catalogo_Paquete_idPaquete` (`Catalogo_Paquete_idPaquete` ASC) VISIBLE,
  CONSTRAINT `paciente_paquete_ibfk_1`
    FOREIGN KEY (`Paciente_idPaciente`)
    REFERENCES `patitos_del_retiro_db`.`paciente` (`idPaciente`),
  CONSTRAINT `paciente_paquete_ibfk_2`
    FOREIGN KEY (`Catalogo_Paquete_idPaquete`)
    REFERENCES `patitos_del_retiro_db`.`catalogo_paquete_adicional` (`idCatalogo_Paquete_Adicional`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `patitos_del_retiro_db`.`reservacion`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `patitos_del_retiro_db`.`reservacion` ;

CREATE TABLE IF NOT EXISTS `patitos_del_retiro_db`.`reservacion` (
  `idReservacion` INT NOT NULL AUTO_INCREMENT,
  `Fecha_Inicio` DATE NOT NULL,
  `Fecha_Fin` DATE NOT NULL,
  `Indefinido` TINYINT(1) NOT NULL DEFAULT '0',
  `Observaciones` VARCHAR(300) NOT NULL,
  `Fecha_Registro` DATETIME NOT NULL,
  `Activo` TINYINT(1) NOT NULL DEFAULT '1',
  `Paciente_idPaciente` INT NOT NULL,
  `Habitacion_idHabitacion` INT NOT NULL,
  `Catalogo_Tipo_Estancia_idEstancia` INT NOT NULL,
  `Catalogo_Estado_Reservacion_idEstado` INT NOT NULL,
  `Empleado_idEmpleado_Registra` INT NOT NULL,
  PRIMARY KEY (`idReservacion`),
  INDEX `Paciente_idPaciente` (`Paciente_idPaciente` ASC) VISIBLE,
  INDEX `Habitacion_idHabitacion` (`Habitacion_idHabitacion` ASC) VISIBLE,
  INDEX `Catalogo_Tipo_Estancia_idEstancia` (`Catalogo_Tipo_Estancia_idEstancia` ASC) VISIBLE,
  INDEX `Catalogo_Estado_Reservacion_idEstado` (`Catalogo_Estado_Reservacion_idEstado` ASC) VISIBLE,
  INDEX `Empleado_idEmpleado_Registra` (`Empleado_idEmpleado_Registra` ASC) VISIBLE,
  CONSTRAINT `reservacion_ibfk_1`
    FOREIGN KEY (`Paciente_idPaciente`)
    REFERENCES `patitos_del_retiro_db`.`paciente` (`idPaciente`),
  CONSTRAINT `reservacion_ibfk_2`
    FOREIGN KEY (`Habitacion_idHabitacion`)
    REFERENCES `patitos_del_retiro_db`.`habitacion` (`idHabitacion`),
  CONSTRAINT `reservacion_ibfk_3`
    FOREIGN KEY (`Catalogo_Tipo_Estancia_idEstancia`)
    REFERENCES `patitos_del_retiro_db`.`catalogo_tipo_estancia` (`idCatalogo_Tipo_Estancia`),
  CONSTRAINT `reservacion_ibfk_4`
    FOREIGN KEY (`Catalogo_Estado_Reservacion_idEstado`)
    REFERENCES `patitos_del_retiro_db`.`catalogo_estado_reservacion` (`idCatalogo_Estado_Reservacion`),
  CONSTRAINT `reservacion_ibfk_5`
    FOREIGN KEY (`Empleado_idEmpleado_Registra`)
    REFERENCES `patitos_del_retiro_db`.`empleado` (`idEmpleado`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `patitos_del_retiro_db`.`usuario`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `patitos_del_retiro_db`.`usuario` ;

CREATE TABLE IF NOT EXISTS `patitos_del_retiro_db`.`usuario` (
  `idUsuario` INT NOT NULL AUTO_INCREMENT,
  `Nombre_usuario` VARCHAR(50) NOT NULL,
  `Contrasena` VARCHAR(255) NOT NULL,
  `Email` VARCHAR(255) NOT NULL,
  `Activo` TINYINT(1) NOT NULL DEFAULT '1',
  `Fecha_Creacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Cambio_Contrasena` TINYINT(1) NOT NULL DEFAULT '1',
  `Empleado_idEmpleado` INT NOT NULL,
  PRIMARY KEY (`idUsuario`),
  UNIQUE INDEX `Nombre_usuario` (`Nombre_usuario` ASC) VISIBLE,
  UNIQUE INDEX `Email` (`Email` ASC) VISIBLE,
  INDEX `Empleado_idEmpleado` (`Empleado_idEmpleado` ASC) VISIBLE,
  CONSTRAINT `usuario_ibfk_1`
    FOREIGN KEY (`Empleado_idEmpleado`)
    REFERENCES `patitos_del_retiro_db`.`empleado` (`idEmpleado`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
