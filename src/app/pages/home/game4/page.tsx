"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/btn_p";
import axios from "axios";

const palabrasDesordenadas = [
  {
    correcta: "COMPUTADORA",
    desordenada: "DACOMPUATOR",
    descripcion: "UNA MÁQUINA QUE NOS AYUDA A JUGAR Y APRENDER.",
  },
  {
    correcta: "ELEFANTE",
    desordenada: "ETNEFAEL",
    descripcion: "UN ANIMAL GRANDE CON UNA TROMPA LARGA.",
  },
  {
    correcta: "UNIVERSIDAD",
    desordenada: "VERSIUDNIDA",
    descripcion: "UN LUGAR DONDE LOS ADULTOS ESTUDIAN PARA APRENDER MÁS.",
  },
  {
    correcta: "PROGRAMACION",
    desordenada: "GARMAPRO CION",
    descripcion: "ESCRIBIR INSTRUCCIONES PARA QUE UNA COMPUTADORA HAGA COSAS.",
  },
  {
    correcta: "MURCIELAGO",
    desordenada: "CIERGUAMLO",
    descripcion: "UN ANIMAL QUE VUELA Y SALE DE NOCHE.",
  },
  {
    correcta: "AUTOMOVIL",
    desordenada: "VOMILAUTO",
    descripcion: "UN CARRO QUE NOS LLEVA A DIFERENTES LUGARES.",
  },
  {
    correcta: "HELICOPTERO",
    desordenada: "COPTELEHORI",
    descripcion: "UN TIPO DE AVIÓN QUE VUELA HACIA ARRIBA Y HACIA ABAJO.",
  },
  {
    correcta: "BIBLIOTECA",
    desordenada: "TEBLICAOBI",
    descripcion: "UN LUGAR LLENO DE LIBROS PARA LEER.",
  },
  {
    correcta: "RESTAURANTE",
    desordenada: "TAURASTERNE",
    descripcion: "UN LUGAR DONDE PODEMOS COMER COMIDA RICA.",
  },
  {
    correcta: "TECLADO",
    desordenada: "CLATODE",
    descripcion: "UN APARATO CON BOTONES QUE USAMOS PARA ESCRIBIR.",
  },
];

export default function OrdenarLetrasGame() {
  const [puntuacion, setPuntuacion] = useState(0);
  const [intentos, setIntentos] = useState(3);
  const [palabraActual, setPalabraActual] = useState<
    (typeof palabrasDesordenadas)[number] | null
  >(null);
  const [letrasSeleccionadas, setLetrasSeleccionadas] = useState<string[]>([]);
  const [letrasOrdenadas, setLetrasOrdenadas] = useState<string[]>([]);
  const [letraSeleccionada, setLetraSeleccionada] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [reglas, setReglas] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [countReload, setCountReolad] = useState<number | null>(null);
  const [palabrasUsadas, setPalabrasUsadas] = useState<string[]>([]);

  useEffect(() => {
    const obtenerDetallesDelJuego = async () => {
      setCargando(true);
      try {
        const { data } = await axios.get("/api/home/games", {
          params: { id: 4 },
        });
        setTitulo(data.game.name);
        setDescripcion(data.game.description);
        setReglas(data.game.rules || "Reglas no disponibles");
        seleccionarNuevaPalabra();
      } catch (error) {
        console.error("Error al obtener detalles:", error);
        setError(true);
      } finally {
        setCargando(false);
      }
    };

    obtenerDetallesDelJuego();
  }, []);

  const seleccionarNuevaPalabra = () => {
    const disponibles = palabrasDesordenadas.filter(
      (p) => !palabrasUsadas.includes(p.correcta)
    );

    if (disponibles.length === 0) {
      setMensaje("¡Has completado todas las palabras! 🎉");
      reiniciarJuego(3);
      return;
    }

    const nuevaPalabra =
      disponibles[Math.floor(Math.random() * disponibles.length)];
    setPalabraActual(nuevaPalabra);
    setPalabrasUsadas((prev) => [...prev, nuevaPalabra.correcta]);
    const letrasMezcladas = shuffleLetters(nuevaPalabra.desordenada);
    setLetrasSeleccionadas(letrasMezcladas);
    setLetrasOrdenadas([]);
  };

  const shuffleLetters = (word: string) => {
    return word.split("").sort(() => Math.random() - 0.5);
  };

  const handleLetterClick = (letra: string, index: number) => {
    if (mensaje) return;

    const nuevasLetras = [...letrasSeleccionadas];
    nuevasLetras.splice(index, 1);
    setLetrasSeleccionadas(nuevasLetras);
    setLetrasOrdenadas([...letrasOrdenadas, letra]);
    setLetraSeleccionada(letra); // Almacena la letra seleccionada
  };

  const borrarLetra = () => {
    if (!letraSeleccionada) return;

    const nuevasOrdenadas = letrasOrdenadas.filter(
      (letra) => letra !== letraSeleccionada
    );
    setLetrasOrdenadas(nuevasOrdenadas);
    setLetraSeleccionada(null); // Resetea la letra seleccionada
  };

  const verificarRespuesta = () => {
    if (!palabraActual) return;

    const intento = letrasOrdenadas.join("");

    if (intento === palabraActual.correcta) {
      const nuevaPuntuacion = puntuacion + 20;
      setPuntuacion(nuevaPuntuacion);

      if (nuevaPuntuacion >= 100) {
        setMensaje("¡Has ganado! 🏆 Puntuación máxima alcanzada");
        enviarPuntuacion(nuevaPuntuacion);
        reiniciarJuego(3);
        return;
      }

      setMensaje("¡Correcto! +20 puntos 🎉");
      setTimeout(() => {
        seleccionarNuevaPalabra();
        setMensaje("");
      }, 1500);
    } else {
      const nuevosIntentos = intentos - 1;
      setIntentos(nuevosIntentos);

      if (nuevosIntentos === 0) {
        setMensaje(`❌ Game Over. La palabra era: ${palabraActual.correcta}`);
        enviarPuntuacion(puntuacion);
        reiniciarJuego(3);
      } else {
        setMensaje(
          `❌ Incorrecto. La palabra era: ${palabraActual.correcta}. Intentos restantes: ${nuevosIntentos}`
        );
        setTimeout(() => {
          seleccionarNuevaPalabra();
          setMensaje("");
        }, 2000);
      }
    }
  };

  const enviarPuntuacion = async (puntos: number) => {
    try {
      await axios.post(
        "/api/home/games/points",
        {
          gameId: 4,
          newScore: puntos,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Error al enviar puntuación:", error);
    }
  };

  const reiniciarJuego = (segundos: number) => {
    setCountReolad(segundos);
    const intervalo = setInterval(() => {
      setCountReolad((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    setTimeout(() => {
      clearInterval(intervalo);
      setPuntuacion(0);
      setIntentos(3);
      setPalabrasUsadas([]);
      seleccionarNuevaPalabra();
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

  if (error || !palabraActual) {
    return (
      <div className="flex flex-col items-center w-screen justify-center min-h-screen gap-4">
        <p className="text-red-500 text-lg font-bold">
          Error al cargar el juego
        </p>
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
          <h2 className="text-xl font-bold mb-4">Ordena las letras:</h2>
          
          {/* Ayuda con la descripción de la palabra */}
          {palabraActual && (
            <div className="mt-2 p-1 bg-gray-200 rounded-lg">
              <h3 className="text-sm font-bold">Ayuda: {palabraActual.descripcion}</h3>
            </div>
          )}

          <div className="mb-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-2xl font-bold">{letrasOrdenadas.join(" ")}</p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {letrasSeleccionadas.map((letra, index) => (
              <Button
                key={index}
                onClick={() => handleLetterClick(letra, index)}
                className="text-xl px-4 py-2"
                variant={mensaje.includes("Correcto") ? "success" : "default"}
              >
                {letra}
              </Button>
            ))}
          </div>

          <Button
            onClick={verificarRespuesta}
            disabled={mensaje.length > 0 || letrasOrdenadas.length === 0}
            className="mt-4 w-full py-3 text-lg"
          >
            Verificar
          </Button>

          {/* Botón para borrar la letra seleccionada */}
          {letraSeleccionada && (
            <Button
              onClick={borrarLetra}
              className="mt-2 w-full py-2 text-lg bg-red-500 text-white"
            >
              Borrar letra
            </Button>
          )}
        </div>

        {mensaje && (
          <div
            className={`text-center p-4 rounded-lg ${
              mensaje.includes("Correcto") || mensaje.includes("ganado")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            <p className="font-semibold">{mensaje}</p>
            {countReload !== null && (
              <p className="mt-2">Reiniciando en {countReload} segundos...</p>
            )}
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