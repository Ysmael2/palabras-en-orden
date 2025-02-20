'use client'

import { useState, useEffect } from "react";
import { Button } from "@/app/components/btn_p";
import axios from 'axios';

const frasesIncompletas = [
  {
    frase: "El ____ maulla en el tejado",
    correcta: "gato",
    opciones: ["gato", "perro", "pájaro"]
  },
  {
    frase: "Hoy hace mucho ____ en la calle",
    correcta: "frío",
    opciones: ["frío", "agua", "soledad"]
  },
  {
    frase: "Vamos a ____ un libro interesante",
    correcta: "leer",
    opciones: ["leer", "comer", "correr"]
  },
  {
    frase: "La capital de Francia es ____",
    correcta: "París",
    opciones: ["París", "Londres", "Roma"]
  },
  {
    frase: "El agua hierve a 100 ____ Celsius",
    correcta: "grados",
    opciones: ["metros", "grados", "litros"]
  },
  {
    frase: "Las ____ son rojas en verano",
    correcta: "manzanas",
    opciones: ["uvas", "naranjas", "manzanas"]
  },
  {
    frase: "Necesito comprar ____ para el café",
    correcta: "azúcar",
    opciones: ["harina", "sal", "azúcar"]
  },
  {
    frase: "El ____ es el rey de la selva",
    correcta: "león",
    opciones: ["tigre", "león", "elefante"]
  },
  {
    frase: "Voy a ____ en el parque esta tarde",
    correcta: "pasear",
    opciones: ["pasear", "nadar", "estudiar"]
  },
  {
    frase: "La ____ brilla en el cielo nocturno",
    correcta: "luna",
    opciones: ["sol", "estrella", "luna"]
  }
];

export default function CompletaFraseGame() {
  const [puntuacion, setPuntuacion] = useState(0);
  const [intentos, setIntentos] = useState(3);
  const [fraseActual, setFraseActual] = useState<typeof frasesIncompletas[number] | null>(null);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [reglas, setReglas] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [countReload, setCountReolad] = useState<number | null>(null);
  const [frasesUsadas, setFrasesUsadas] = useState<string[]>([]);

  useEffect(() => {
    const obtenerDetallesDelJuego = async () => {
      setCargando(true);
      try {
        const { data } = await axios.get('/api/home/games', { params: { id: 5 } });
        setTitulo(data.game.name);
        setDescripcion(data.game.description);
        setReglas(data.game.rules || "Reglas no disponibles");
        seleccionarNuevaFrase();
      } catch (error) {
        console.error("Error al obtener detalles:", error);
        setError(true);
      } finally {
        setCargando(false);
      }
    };

    obtenerDetallesDelJuego();
  }, []);

  const seleccionarNuevaFrase = () => {
    const disponibles = frasesIncompletas.filter(f => !frasesUsadas.includes(f.frase));

    if (disponibles.length === 0) {
      setMensaje("¡Has completado todas las frases! 🎉");
      reiniciarJuego(3);
      return;
    }

    const nuevaFrase = disponibles[Math.floor(Math.random() * disponibles.length)];
    setFraseActual(nuevaFrase);
    setFrasesUsadas(prev => [...prev, nuevaFrase.frase]);
    setRespuestaSeleccionada(null);
  };

  const manejarSeleccion = (opcion: string) => {
    if (!fraseActual) return;

    if (opcion === fraseActual.correcta) {
      const nuevaPuntuacion = puntuacion + 20;
      setPuntuacion(nuevaPuntuacion);
      setMensaje("¡Correcto! +20 puntos 🎉");

      if (nuevaPuntuacion >= 100) {
        setMensaje("¡Has ganado! 🏆 Puntuación máxima alcanzada");
        enviarPuntuacion(nuevaPuntuacion);
        reiniciarJuego(3);
        return;
      }

      setTimeout(() => {
        seleccionarNuevaFrase();
        setMensaje("");
      }, 1500);
    } else {
      const nuevosIntentos = intentos - 1;
      setIntentos(nuevosIntentos);
      
      if (nuevosIntentos === 0) {
        setMensaje(`❌ Game Over. La respuesta era: ${fraseActual.correcta}`);
        enviarPuntuacion(puntuacion);
        reiniciarJuego(3);
      } else {
        setMensaje(`❌ Incorrecto. La respuesta correcta era: ${fraseActual.correcta}. Intentos restantes: ${nuevosIntentos}`);
        setTimeout(() => {
          seleccionarNuevaFrase();
          setMensaje("");
        }, 2000);
      }
    }
  };

  const enviarPuntuacion = async (puntos: number) => {
    try {
      await axios.post('/api/home/games/points', {
        gameId: 5,
        newScore: puntos,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error("Error al enviar puntuación:", error);
    }
  };

  const reiniciarJuego = (segundos: number) => {
    setCountReolad(segundos);
    const intervalo = setInterval(() => {
      setCountReolad(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    setTimeout(() => {
      clearInterval(intervalo);
      setPuntuacion(0);
      setIntentos(3);
      setFrasesUsadas([]);
      seleccionarNuevaFrase();
      setMensaje("");
      setCountReolad(null);
    }, segundos * 1000);
  };

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center w-screen min-h-screen gap-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  if (error || !fraseActual) {
    return (
      <div className="flex flex-col items-center w-screen justify-center min-h-screen gap-4">
        <p className="text-red-500 text-lg font-bold">Error al cargar el juego</p>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-screen justify-center min-h-screen p-4 gap-6">
      <h1 className="text-3xl font-bold text-blue-600">{titulo}</h1>
      <p className="text-lg text-gray-700 text-center max-w-2xl">{descripcion}</p>
      <p className="text-md">{reglas}</p>

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between mb-4">
          <div className="text-lg font-semibold">Puntuación: {puntuacion}</div>
          <div className="text-lg font-semibold text-red-500">Intentos: {intentos}</div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold mb-4">Completa la frase:</h2>
          
          <div className="mb-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-2xl font-bold">
              {fraseActual.frase.replace('____', '______')}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {fraseActual.opciones.map((opcion, index) => (
              <Button
                key={index}
                onClick={() => manejarSeleccion(opcion)}
                className="text-xl px-4 py-2"
                variant={
                  mensaje.includes("Correcto") && opcion === fraseActual.correcta
                    ? "success"
                    : respuestaSeleccionada === opcion ? "danger" : "default"
                }
                disabled={!!mensaje}
              >
                {opcion}
              </Button>
            ))}
          </div>
        </div>

        {mensaje && (
          <div className={`text-center p-4 rounded-lg ${
            mensaje.includes("Correcto") || mensaje.includes("ganado") 
              ? "bg-green-100 text-green-700" 
              : "bg-red-100 text-red-700"
          }`}>
            <p className="font-semibold">{mensaje}</p>
            {countReload !== null && <p className="mt-2">Reiniciando en {countReload} segundos...</p>}
          </div>
        )}

        <div className="mt-6 w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(puntuacion / 100) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}