import prisma from '@/lib/prismaClient';
import { NextResponse, NextRequest } from 'next/server';
import { loginSchema } from '../../../models/AuthScheme';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar el cuerpo de la solicitud con Zod
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      // Extraer los errores y devolverlos
      const errors = result.error.errors.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));
      return NextResponse.json(
        { message: 'Error de validación', errors },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // Verificar si el usuario existe en la base de datos
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si la contraseña coincide (aquí deberías usar algún método de hash para la verificación)
    // Aquí, como ejemplo, comparo la contraseña directamente, pero esto no es seguro
    if (user.password !== password) {
      return NextResponse.json(
        { message: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

    // Crear el token de sesión (puedes usar JWT o cualquier otra solución de autenticación)
    const sessionToken = email;  // Generar el token (puedes usar una librería como jsonwebtoken)

    // Crear la respuesta para el login
    const response = NextResponse.json(
      { message: 'Login exitoso', user: { email: user.email, username: user.username } },
      { status: 200 }
    );

    // Establecer la cookie de sesión
    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,       // Evitar acceso desde JavaScript (más seguro)
      secure: process.env.NODE_ENV === 'production',  // Solo en HTTPS
      sameSite: 'strict',   // Política de SameSite
      path: '/',            // Disponible en toda la app
      maxAge: 60 * 60 * 24, // Establecer la expiración de la cookie (ejemplo: 1 día)
    });

    return response;
  } catch (error) {
    console.error('Error en el login:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', error },
      { status: 500 }
    );
  }
}
