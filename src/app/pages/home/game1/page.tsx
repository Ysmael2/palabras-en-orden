'use client'

import { useState, useEffect } from "react";
import axios from 'axios';

const palabras = [
  { palabra: "gato", pista: "Es un animal que dice 'miau'.", ayuda: "G _ T _" },
  { palabra: "casa", pista: "Donde vives con tu familia.", ayuda: "C _ S _" },
  { palabra: "sol", pista: "Es la estrella que brilla durante el día.", ayuda: "S _ L" },
  { palabra: "luna", pista: "Es lo que brilla en el cielo de noche.", ayuda: "L _ N _" },
  { palabra: "perro", pista: "Es un animal que dice 'guau'.", ayuda: "P _ R _" },
  { palabra: "flor", pista: "Es una planta bonita que tiene colores.", ayuda: "F _ R" },
  { palabra: "manzana", pista: "Es una fruta roja o verde que puedes comer.", ayuda: "M _ N _ _ _ A" },
  { palabra: "agua", pista: "Es lo que bebes cuando tienes sed.", ayuda: "A _ _ A" },
  { palabra: "pelota", pista: "Es un objeto redondo que se usa para jugar.", ayuda: "P _ L _ _ A" },
  { palabra: "libro", pista: "Es algo que tiene historias y dibujos.", ayuda: "L _ B _ O" },
  { palabra: "carro", pista: "Es un vehículo que se mueve por la calle.", ayuda: "C _ R _ O" },
  { palabra: "fruta", pista: "Es algo que comes y es dulce, como una manzana.", ayuda: "F _ _ T _" },
  { palabra: "luz", pista: "Lo que ilumina cuando está oscuro.", ayuda: "L _ Z" },
  { palabra: "lago", pista: "Es un gran lugar con agua donde puedes nadar.", ayuda: "L _ G _" },
  { palabra: "montaña", pista: "Es un lugar alto donde hay mucha naturaleza.", ayuda: "M _ N _ A _ _" },
  { palabra: "estrella", pista: "Brillan en el cielo por la noche.", ayuda: "E _ R _ _ _ A" },
  { palabra: "guitarra", pista: "Es un instrumento que se toca con las manos.", ayuda: "G _ I _ _ R _" },
  { palabra: "piano", pista: "Es un instrumento con teclas blancas y negras.", ayuda: "P _ A _ O" },
  { palabra: "plaza", pista: "Es un lugar donde juegan los niños.", ayuda: "P _ A _ A" },
  { palabra: "avión", pista: "Es un medio de transporte que vuela en el cielo.", ayuda: "A _ I _ N" },
  { palabra: "tren", pista: "Es un vehículo que va sobre rieles.", ayuda: "T _ _ N" },
  { palabra: "reina", pista: "Es una mujer muy importante en un cuento de hadas.", ayuda: "R _ _ N _" },
  { palabra: "rey", pista: "Es un hombre muy importante en un cuento de hadas.", ayuda: "R _ Y" },
  { palabra: "ciudad", pista: "Es un lugar con muchas casas y personas.", ayuda: "C _ _ D _ D" },
  { palabra: "piscina", pista: "Es un lugar con agua donde puedes nadar.", ayuda: "P _ _ C _ N _" },
  { palabra: "pluma", pista: "Es lo que tienen los pájaros en su cuerpo.", ayuda: "P _ _ A" },
  { palabra: "dientes", pista: "Son las partes que usamos para masticar la comida.", ayuda: "D _ _ N _ S" },
  { palabra: "nariz", pista: "Es lo que usas para oler flores.", ayuda: "N _ R _ Z" },
  { palabra: "ojos", pista: "Son lo que usamos para ver.", ayuda: "O _ _ S" },
  { palabra: "viento", pista: "Es el aire que sopla y mueve las hojas.", ayuda: "V _ _ N _ O" },
  { palabra: "ratón", pista: "Es un pequeño animal que vive en casas.", ayuda: "R _ T _ N" },
  { palabra: "cielo", pista: "Es lo que hay arriba y es azul durante el día.", ayuda: "C _ _ L O" },
  { palabra: "rojo", pista: "Es un color como el de una fresa.", ayuda: "R _ J _" },
  { palabra: "verde", pista: "Es el color de la hierba y los árboles.", ayuda: "V _ _ D E" },
  { palabra: "azul", pista: "Es el color del cielo y el mar.", ayuda: "A _ _ L" },
  { palabra: "rosa", pista: "Es un color que se parece a las flores.", ayuda: "R _ _ A" },
  { palabra: "madera", pista: "Es lo que se usa para hacer muebles.", ayuda: "M _ _ D _ A" },
  { palabra: "huevo", pista: "Es lo que pone una gallina.", ayuda: "H _ _ V _" },
  { palabra: "piedra", pista: "Es algo duro que encuentras en la naturaleza.", ayuda: "P _ _ D _ A" },
  { palabra: "arena", pista: "Es lo que hay en la playa y es suave.", ayuda: "A _ _ N _" },
  { palabra: "aire", pista: "Es lo que respiras y está en todas partes.", ayuda: "A _ _ E" },
  { palabra: "puerta", pista: "Es lo que abrimos para entrar a un lugar.", ayuda: "P _ _ R _ A" },
  { palabra: "ventana", pista: "Es un lugar en la pared que puedes abrir para ver afuera.", ayuda: "V _ N _ _ N _" },
  { palabra: "nieve", pista: "Es el agua congelada que cae en invierno.", ayuda: "N _ _ E" },
  { palabra: "chocolate", pista: "Es un dulce que a muchos niños les encanta.", ayuda: "C _ _ O _ _ _ E" },
  { palabra: "zapato", pista: "Es lo que usas en los pies.", ayuda: "Z _ _ A _ O" },
  { palabra: "ropa", pista: "Es lo que llevas puesto para vestirte.", ayuda: "R _ _ A" },
];

export default function CompletacionGame() {
  const [entrada, setEntrada] = useState("");
  const [intentos, setIntentos] = useState(3);
  const [puntuacion, setPuntuacion] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [indice, setIndice] = useState<number | null>(null);
  const [mostrarPalabra, setMostrarPalabra] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [reglas, setReglas] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [countReload, setcountReolad] = useState<number | null >(null);

  useEffect(() => {
    setIndice(Math.floor(Math.random() * palabras.length));
  }, []);

  useEffect(() => {
    const obtenerDetallesDelJuego = async () => {
      setCargando(true);
      setError(false);
      
      try {
        const { data } = await axios.get('/api/home/games', {
          params: { id: 1 } // Parámetros de la URL
        });
    
        console.log(data);
        setTitulo(data.game.name || "Título no disponible");
        setDescripcion(data.game.description || "Descripción no disponible");
        setReglas(data.game.rules || "Reglas no disponibles");
    
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error al obtener detalles:", error.message);
        } else {
          console.error("Error inesperado:", error);
        }
        setError(true);
    
      } finally {
        setCargando(false);
      }
    };

    obtenerDetallesDelJuego();
    setIndice(Math.floor(Math.random() * palabras.length));
  }, []);

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-screen gap-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-screen gap-4">
        <p className="text-red-500 text-lg font-bold">Error al cargar el juego</p>
        <button
          onClick={() => location.reload()}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const enviarPuntuacion = async (puntos: number): Promise<void> => {
    try {
      await axios.post('/api/home/games/points', {
        gameId: 1,
        newScore: puntos,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });
  
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error al enviar puntuación:", error.message);
      } else {
        console.error("Error inesperado:", error);
      }
    }
  };

  if (indice === null) return <div>Cargando...</div>;

  const palabraActual = palabras[indice].palabra;
  const pista = palabras[indice].pista;
  const ayuda = palabras[indice].ayuda;
  const palabraOculta = palabraActual.replace(/[a-zA-Z]/g, " _ ");

  const verificarRespuesta = () => {
    if (entrada.toLowerCase() === palabraActual.toLowerCase()) {
      const nuevaPuntuacion = puntuacion + 20;
      setPuntuacion(nuevaPuntuacion);
      if (nuevaPuntuacion >= 100) {
        setMensaje(`🎉 ¡Felicidades! ¡Has completado el juego!`);
        setIntentos(0);
        return enviarPuntuacion(nuevaPuntuacion); 
      }  
      setMensaje(`✅ ¡Correcto! +20 puntos.`);
      setTimeout(() => {
        setIndice(Math.floor(Math.random() * palabras.length));
        setIntentos(3);
        setEntrada("");
        setMensaje("");
      }, 1000);
    } else {
      const intentosRestantes = intentos - 1;
      setIntentos(intentosRestantes);
      setMensaje(`❌ Incorrecto. Intentos restantes: ${intentosRestantes}`);
  
      if (intentosRestantes === 0) {
        setMostrarPalabra(true);
        setMensaje(`❌ Game Over. La palabra era: ${palabraActual}`);
        enviarPuntuacion(puntuacion);
        // Iniciar cuenta regresiva de 3 segundos antes de reiniciar el juego
        setcountReolad(3);
        const countdown = setInterval(() => {
          setcountReolad((prev) => (prev !== null && prev > 0 ? prev - 1 : null));
        }, 1000);
  
        setTimeout(() => {
          clearInterval(countdown); // Detener el intervalo
          setIndice(Math.floor(Math.random() * palabras.length));
          setIntentos(3);
          setEntrada("");
          setMensaje("");
          setMostrarPalabra(false);
          setPuntuacion(0);
          setcountReolad(null);
        }, 3000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen gap-4 p-4">
      <h1 className="text-xl font-bold">{titulo}</h1>
      <p className="text-lg">{descripcion}</p>
      <p className="text-md">{reglas}</p>
      <h2 className="text-xl font-bold">Pista</h2>
      <p className="text-lg">{pista}</p>
      <p className="text-lg">Ayuda: {ayuda}</p>
      <p className="text-2xl tracking-wider">
        {mostrarPalabra ? palabraActual : palabraOculta}
      </p>

      <input
        type="text"
        value={entrada}
        onChange={(e) => setEntrada(e.target.value)}
        className="border p-2 rounded-md text-center"
      />

      <button
        onClick={verificarRespuesta}
        disabled={intentos === 0 || puntuacion >= 100}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Verificar
      </button>

      <p className={mensaje.includes("❌") ? "text-red-500" : "text-green-500"}>{mensaje}</p>

      {/* Barra de progreso */}
      <div className="w-full max-w-md bg-gray-300 rounded-lg h-6 mt-4">
        <div
          className="bg-green-500 h-6 rounded-lg transition-all duration-500"
          style={{ width: `${(puntuacion / 100) * 100}%` }}
        ></div>
      </div>

      <p>Puntuación: {puntuacion} / 100</p>
      <p>Intentos restantes: {intentos}</p>
      {countReload !== null && <p>Reiniciando en {countReload}...</p>}
    </div>
  );
}