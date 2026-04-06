import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    Nombre_usuario: string;

    @IsString()
    @IsNotEmpty()
    Contrasena: string;
}