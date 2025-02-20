import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email({ message: 'El correo electrónico no es válido' }),
    password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    username: z.string().min(1, { message: 'El nombre de usuario es obligatorio' }),
    });


export const loginSchema = z.object({
        email: z.string().email("El correo electrónico no es válido"), // Validación de correo
        password: z
          .string()
          .min(6, "La contraseña debe tener al menos 6 caracteres") // Validación de contraseña
          .max(20, "La contraseña debe tener como máximo 20 caracteres"),
      });