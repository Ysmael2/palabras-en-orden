import prisma from '@/lib/prismaClient';
import { NextResponse } from 'next/server';
import { GameSchema } from '@/app/models/GamesScheme';

export async function GET(request: Request) {
  try {
    // Obtener el id del query string
    const url = new URL(request.url);
    const id = Number(url.searchParams.get('id')); // Obtener el id del query y convertir a número

    if (!id) {
      return NextResponse.json(
        { message: 'El parámetro "id" es requerido' },
        { status: 400 }
      );
    }

    const game = await prisma.game.findUnique({
      where: { id }
    });

    if (!game) {
      return NextResponse.json(
        { message: 'Juego no encontrado' },
        { status: 404 }
      );
    }

    // Validar con Zod
    const result = GameSchema.safeParse(game);
    if (!result.success) {
      return NextResponse.json(
        { message: 'Error de validación', errors: result.error.format() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Juego obtenido con éxito', game: result.data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al obtener el juego:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', error },
      { status: 500 }
    );
  }
}
