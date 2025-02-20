'use client'

import { useState, useEffect } from "react";
import { Button } from "@/app/components/button";
import axios from 'axios';

const questions = [
  {
    word: "Bicicleta",
    description: "Es un vehículo de dos ruedas que pedaleas para moverte.",
    options: ["Bicicleta", "Bicicreta", "Bizicleta"],
    answer: "Bicicleta",
  },
  {
    word: "Error",
    description: "Es cuando haces algo mal o te equivocas.",
    options: ["Error", "Herror", "Errór"],
    answer: "Error",
  },
  {
    word: "Haber",
    description: "Es una palabra que se usa para hablar de cosas que existen.",
    options: ["Haber", "Aber", "Aver"],
    answer: "Haber",
  },
  {
    word: "Váyanse",
    description: "Es cuando le dices a alguien que se vaya.",
    options: ["Vallanse", "Ballanse", "Váyanse"],
    answer: "Váyanse",
  },
  {
    word: "Decidió",
    description: "Es cuando alguien elige hacer algo.",
    options: ["Decidió", "Desidió", "Decidio"],
    answer: "Decidió",
  },
  {
    word: "Invito",
    description: "Es cuando le pides a alguien que venga a jugar.",
    options: ["Invito", "Imbito", "Envito"],
    answer: "Invito",
  },
  {
    word: "Cacería",
    description: "Es cuando las personas buscan y atrapan animales.",
    options: ["Cacería", "Cazería", "Casería"],
    answer: "Cacería",
  },
  {
    word: "Excepción",
    description: "Es algo que no sigue la regla.",
    options: ["Excepción", "Exepción", "Exección"],
    answer: "Excepción",
  },
  {
    word: "Expresarse",
    description: "Es cuando dices o muestras lo que sientes.",
    options: ["Expresarse", "Espresarse", "Esprersarse"],
    answer: "Expresarse",
  },
  {
    word: "Hojear",
    description: "Es pasar las páginas de un libro rápido.",
    options: ["Ojear", "Hojear", "Ojeár"],
    answer: "Hojear",
  },
  {
    word: "Vacuosidad",
    description: "Es cuando algo está vacío y no tiene nada adentro.",
    options: ["Vacuosidad", "Vasosidad", "Vasozidad"],
    answer: "Vacuosidad",
  },
  {
    word: "Hacerte",
    description: "Es cuando te conviertes en algo o alguien.",
    options: ["Acerte", "Hacerte", "Acerté"],
    answer: "Hacerte",
  },
  {
    word: "Hacia",
    description: "Es una palabra que indica dirección, como ir a un lugar.",
    options: ["Asia", "Hacia", "Acia"],
    answer: "Hacia",
  },
  {
    word: "Desarrollo",
    description: "Es cuando algo crece y mejora.",
    options: ["Desarrollo", "Desarroyo", "Desarollo"],
    answer: "Desarrollo",
  },
  {
    word: "Averiguar",
    description: "Es cuando buscas descubrir algo.",
    options: ["Averiguar", "Aberiguar", "Aveeriguar"],
    answer: "Averiguar",
  },
  {
    word: "Vaya",
    description: "Es una forma de decirle a alguien que se mueva.",
    options: ["Vaya", "Baya", "Balla"],
    answer: "Vaya",
  },
  {
    word: "Necesario",
    description: "Es algo que es muy importante y que necesitas.",
    options: ["Necesario", "Nesesario", "Necesaro"],
    answer: "Necesario",
  },
  {
    word: "Hazme",
    description: "Es cuando le pides a alguien que te haga algo.",
    options: ["Hazme", "Hasme", "Asme"],
    answer: "Hazme",
  }
];

export default function ChooseCorrectWordGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [titulo, setTitulo] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [reglas, setReglas] = useState<string>("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [countReload, setCountReload] = useState<number | null >(null);
  const [countQuestions, setCountQuestions] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [usedWords, setUsedWords] = useState<string[]>([]);

  useEffect(() => {
    const obtenerDetallesDelJuego = async () => {
      setCargando(true);
      setError(false);
      try {
        const { data } = await axios.get('/api/home/games', {
          params: { id: 2 } // Parámetros de la URL
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
  }, []);

  const shuffleOptions = (options: string[]) => {
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  };

  const shuffledOptions = shuffleOptions([...questions[currentQuestion].options]);

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
        gameId: 2,
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
  
  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setShowFeedback(true);
    const newUsedWords = [...usedWords, questions[currentQuestion].word];
    setUsedWords(newUsedWords);
    console.log(usedWords)

    if (option === questions[currentQuestion].answer) {
      setScore(score + 20);
      setCountQuestions(countQuestions + 1);
      setMensaje(`✅ ¡Correcto! +20 puntos.`);
      if (score >= 100) {
        setMensaje(`🎉 ¡Felicidades! ¡Has completado el juego!`);
        setScore(0);
        enviarPuntuacion(score);
        setUsedWords([]);
        setScore(0);
      } else if (usedWords.length >= 5) {
        setMensaje(`Game Over.`);
        setScore(0);
        enviarPuntuacion(score);
        setUsedWords([]);
        setScore(0);
      }
    } else {
      setMensaje(`❌ Incorrecto. Fallaste. Te quedan ${5 - usedWords.length} intentos y la palabra era: ${questions[currentQuestion].answer}`);
      setCountQuestions(countQuestions + 1);
      if (usedWords.length >= 5) {
        setMensaje(`Game Over. La palabra era: ${questions[currentQuestion].answer}`);
        enviarPuntuacion(score);
        setUsedWords([]);
        setScore(0);
      }
    }
  };

  const nextQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questions.length); 
    if (!usedWords.includes(questions[randomIndex].word)) {
      setCurrentQuestion(randomIndex);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      nextQuestion();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen gap-4 p-4">
      <h1 className="text-xl font-bold">{titulo}</h1>
      <p className="text-lg">{descripcion}</p>
      <p className="text-md">{reglas}</p>
      <h2 className="text-xl font-bold">Elige la Palabra Correcta</h2>
      <p className="text-lg">Ayuda: <strong>{questions[currentQuestion].description}</strong></p>
      <div className="space-y-2">
        {shuffledOptions.map((option) => (
          <Button
            key={option}
            onClick={() => handleOptionClick(option)}
            className={`w-full ${selectedOption === option ? (option === questions[currentQuestion].answer ? 'bg-green-500' : 'bg-red-500') : 'bg-blue-500'}`}
            disabled={showFeedback}
          >
            {option}
          </Button>
        ))}
      </div>
      {showFeedback && (
        <div className="mt-4 flex flex-col items-center justify-center">
          <Button onClick={nextQuestion} className="mt-2 mb-10 bg-gray-700">Siguiente</Button>
          <p className={mensaje.includes("❌") ? "text-red-500" : "text-green-500"}>{mensaje}</p>
        </div>
      )}

      {/* Barra de progreso */}
      <div className="w-full max-w-md bg-gray-300 rounded-lg h-6 mt-4">
        <div
          className="bg-green-500 h-6 rounded-lg transition-all duration-500"
          style={{ width: `${(score / 100) * 100}%` }}
        ></div>
      </div>

      <p className="mt-4">Puntuación: {score}</p>
      
      {countReload !== null && <p>Reiniciando en {countReload}...</p>}
    </div>
  );
}