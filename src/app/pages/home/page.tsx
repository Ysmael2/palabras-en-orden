'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/app/stores/authStore';
import { ScoreSchema, ScoresResponseSchema } from '@/app/models/ScoreScheme';
import z from 'zod';
import axios from 'axios';

// Definir el tipo Score a partir del esquema
type Score = z.infer<typeof ScoreSchema>;

export default function Home() {
  // Obtener el usuario y la función para cerrar sesión desde el store
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // Estado para guardar las puntuaciones y manejar el loading
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [renderingComplete, setRenderingComplete] = useState(false);

  // Llamada a la API para obtener las puntuaciones del usuario
  useEffect(() => {
    if (!user) {
      setLoading(false); // Si no hay usuario, se desactiva el loading
      return;
    }

    async function fetchScores() {
      try {
        const res = await axios.get('/api/home/points'); // Sin filtro de gameId para obtener todas las puntuaciones
        const data = res.data;

        const parsedResponse = ScoresResponseSchema.safeParse(data);
        if (!parsedResponse.success) {
          console.error('Error de validación:', parsedResponse.error);
          return;
        }
        setScores(parsedResponse.data.scores);
      } catch (error) {
        console.error('Error fetching scores:', error);
      }
    }

    fetchScores();
  }, [user]);

  
  useEffect(() => {
    if (scores.length > 0) {
      setRenderingComplete(true);
      setLoading(false);
    }
  }, [scores]);

  // Valor mínimo para desbloquear el siguiente juego
  const threshold = 60;

  // Mostrar loader mientras se cargan los datos y se recorren los elementos
  if (loading || !renderingComplete) {
    return (
      <div className="flex flex-col items-center justify-center w-screen min-h-screen gap-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Panel Principal</h1>

      {user ? (
        <div className="space-y-6">
          {/* Información del usuario */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-2">Información personal</h2>
            <p className="text-gray-800">Nombre: {user.username}</p>
            <p className="text-gray-800">Correo Electronico: {user.email}</p>
          </div>

          {/* Mensaje general sobre el desbloqueo del siguiente juego */}
          <div className="bg-blue-100 p-4 rounded-lg border border-blue-300">
            <p className="text-blue-700 font-medium">
              Recuerda: Debes completar el nivel para desbloquear el siguiente juego.
            </p>
          </div>

          {/* Cards con las puntuaciones y el nombre del juego */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {scores.length > 0 ? (
              scores.map((item, index) => {
                const currentScore = item.score;
                const remaining = threshold - currentScore;

                // Verificar si es la última iteración para marcar el rendering como completo
                if (index === scores.length - 1) {
                  setTimeout(() => setRenderingComplete(true), 0);
                }

                return (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-lg shadow-lg border border-gray-200"
                  >
                    <h3 className="text-lg font-semibold mb-2">{item.Game.name}</h3>
                    <p className="text-gray-700">Puntuación: {currentScore}</p>
                    {currentScore < threshold ? (
                      <p className="mt-2 text-red-500">
                        Necesitas {remaining > 0 ? remaining : 0} punto
                        {remaining === 1 ? '' : 's'} más para desbloquear el siguiente juego.
                      </p>
                    ) : (
                      <p className="mt-2 text-green-500">
                        ¡Felicidades! Has desbloqueado el siguiente juego.
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-gray-600 text-center col-span-3">
                No hay puntuaciones registradas.
              </p>
            )}
          </div>

        </div>
      ) : (
        <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-300">
          <p>No has iniciado sesión</p>
          <a 
            href="/pages/auth/login" 
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Ir al login
          </a>
        </div>
      )}
    </div>
  );
}
