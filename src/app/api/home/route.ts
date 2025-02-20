import prisma from '@/lib/prismaClient';
import { NextResponse } from 'next/server';
import { GamesArraySchema } from '@/app/models/GamesScheme';

export async function GET() {
  try {
    const games = await prisma.game.findMany();

    // Validar con Zod
    const result = GamesArraySchema.safeParse(games);
    if (!result.success) {
      return NextResponse.json(
        { message: 'Error de validación', errors: result.error.format() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Lista de juegos obtenida con éxito', games: result.data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al obtener los juegos:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', error },
      { status: 500 }
    );
  }
}