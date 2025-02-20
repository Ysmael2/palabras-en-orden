import prisma from '@/lib/prismaClient';
import { NextResponse, NextRequest } from 'next/server';
import {registerSchema} from '../../../models/AuthScheme';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar el cuerpo de la solicitud con Zod
    const result = registerSchema.safeParse(body);
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

    const { email, password, username } = result.data;

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'El usuario ya existe con ese correo electrónico' },
        { status: 400 }
      );
    }

    // Crear nuevo usuario
    const user = await prisma.user.create({
      data: { email, password, username },
    });

    return NextResponse.json(
      { message: 'Usuario registrado exitosamente', user },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en el registro:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', error },
      { status: 500 }
    );
  }
}
