import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaClient';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    // Obtener las cookies y validar el email
    const cookieStore = await cookies(); // Se usa 'await' aquí
    const emailCookie = cookieStore.get('session_token');

    if (!emailCookie || typeof emailCookie.value !== 'string') {
      return NextResponse.json({ error: 'Email no encontrado en las cookies' }, { status: 400 });
    }

    const email = emailCookie.value.trim();
    const { gameId, newScore } = await request.json();

    if (!email || !gameId || typeof newScore !== 'number') {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    // Consulta la puntuación anterior del usuario para este juego
    const existingScore = await prisma.score.findFirst({
      where: {
        emailUser: email,
        gameId: gameId,
      },
    });

    let score;
    if (existingScore) {
      if (existingScore.score < newScore) {
        score = await prisma.score.update({
          where: { id: existingScore.id },
          data: { score: newScore, updatedAt: new Date() },
        });
      } else {
        return NextResponse.json({ message: 'La puntuación anterior es mayor o igual a la nueva' }, { status: 200 });
      }
    } else {
      score = await prisma.score.create({
        data: {
          emailUser: email,
          gameId: gameId,
          score: newScore,
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json({ message: 'Puntuación registrada correctamente', score });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Hubo un error al registrar la puntuación' }, { status: 500 });
  }
}
