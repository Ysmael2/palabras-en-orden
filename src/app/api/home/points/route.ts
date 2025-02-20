import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Extraer el email del usuario desde las cookies
    const cookieStore = await cookies();
    const emailCookie = cookieStore.get('session_token');

    if (!emailCookie || typeof emailCookie.value !== 'string') {
      return NextResponse.json(
        { error: 'Email no encontrado en las cookies' },
        { status: 400 }
      );
    }

    const email = emailCookie.value.trim();

    // Consultar todas las puntuaciones del usuario e incluir el nombre del juego
    const scores = await prisma.score.findMany({
      where: { emailUser: email },
      include: {
        Game: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: 'Puntuaciones y nombre de juegos obtenidos correctamente', scores },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al obtener las puntuaciones:', error);
    return NextResponse.json(
      { error: 'Hubo un error al obtener las puntuaciones' },
      { status: 500 }
    );
  }
}
