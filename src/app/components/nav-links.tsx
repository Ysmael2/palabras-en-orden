'use client'

import { useState, useEffect } from 'react';
import { PlayIcon, HomeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { ScoresResponseSchema } from '@/app/models/ScoreScheme';

const links = [
  { name: 'Inicio', href: '/pages/home', icon: HomeIcon },
  { name: 'Completación', href: '/pages/home/game1', icon: PlayIcon },
  { name: 'Elige la Palabra Correcta', href: '/pages/home/game2', icon: PlayIcon },
  { name: 'Palabra Relacionada', href: '/pages/home/game3', icon: PlayIcon },
  { name: 'Ordena las Letras', href: '/pages/home/game4', icon: PlayIcon },
  { name: 'Completa la Frase', href: '/pages/home/game5', icon: PlayIcon },
];

export default function NavLinks() {
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;

    async function fetchScores() {
      try {
        const res = await axios.get('/api/home/points');
        const data = res.data;

        // Validar la respuesta con Zod
        const parsedResponse = ScoresResponseSchema.safeParse(data);
        if (!parsedResponse.success) {
          console.error('Error de validación:', parsedResponse.error);
          return;
        }

        // Convertir el array de puntuaciones en un objeto clave-valor { "Completación": 80, "Elige la Palabra Correcta": 50, ... }
        const scoreMap: { [key: string]: number } = {};
        parsedResponse.data.scores.forEach((score) => {
          if (score.Game?.name) {
            scoreMap[score.Game.name] = score.score;
          }
        });

        if (isMounted) {
          setScores(scoreMap);
        }
      } catch (error) {
        console.error('Error al obtener las puntuaciones:', error);
      }
    }

    fetchScores(); // Ejecutar la petición inmediatamente

    // Actualizar cada 30 segundos
    const interval = setInterval(fetchScores, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
    };
  }, []);

  return (
    <>
      {links.map((link, index) => {
        const LinkIcon = link.icon;
        const gameScore = scores[link.name] || 0;

        // **Reglas de desbloqueo**:
        // - `home` siempre desbloqueado.
        // - `Completación` (primer juego) siempre desbloqueado.
        // - Los demás juegos solo se desbloquean si el juego anterior tiene más de 60 puntos.
        const isUnlocked =
          link.name === 'Inicio' ||
          index === 1 ||
          (index > 1 && (scores[links[index - 1].name] || 0) > 60);

        return (
          <Link
            key={link.name}
            href={isUnlocked ? link.href : '#'}
            className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium 
              md:flex-none md:justify-start md:p-2 md:px-3
              ${isUnlocked ? 'hover:bg-sky-100 hover:text-blue-600' : 'opacity-50 cursor-not-allowed'}
              ${pathname === link.href ? 'bg-sky-100 text-blue-600' : ''}
            `}
            aria-disabled={!isUnlocked}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
