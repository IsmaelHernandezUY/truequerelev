// pages/EncuestaTrueque.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

const allQuestions = [
  {
    title: "¿Qué valorás más al participar en un trueque?",
    options: [
      { text: "La oportunidad de conocer nuevas personas", points: 9, tag: "comunitario", consequence: "Priorizás el vínculo social por sobre el objeto." },
      { text: "El hecho de obtener algo útil para mí", points: 6, tag: "utilitario", consequence: "Primás la funcionalidad del intercambio." },
    ],
  },
  {
    title: "¿Aceptarías un trueque donde recibís saberes tradicionales (oficios, recetas, artes)?",
    options: [
      { text: "Sí, ese tipo de conocimientos me interesa mucho", points: 9, tag: "cultural", consequence: "Valorás el capital cultural intangible." },
      { text: "No, prefiero intercambios con cosas materiales", points: 5, tag: "utilitario", consequence: "Priorizás bienes tangibles y funcionales." },
    ],
  },
  {
    title: "Te proponen intercambiar tu tiempo libre por ayuda con trámites digitales. ¿Qué hacés?",
    options: [
      { text: "Acepto, me parece un uso social de mi tiempo", points: 8, tag: "comunitario", consequence: "Tiempo como recurso colectivo de cooperación." },
      { text: "No, prefiero usar mi tiempo en actividades personales", points: 5, tag: "individualista", consequence: "Preservás tu tiempo desde lo individual." },
    ],
  },
  {
    title: "¿Qué harías con objetos con fuerte valor emocional pero que ya no usás?",
    options: [
      { text: "Los trueco si sé que alguien los valorará igual que yo", points: 9, tag: "simbólico", consequence: "Te importa la carga afectiva del objeto." },
      { text: "Prefiero no desprenderme de ellos", points: 6, tag: "conservador", consequence: "Apego personal al objeto, aunque no lo uses." },
    ],
  },
  {
    title: "¿Qué tan importante es para vos que el trueque sea justo en términos simbólicos (esfuerzo, significado, etc)?",
    options: [
      { text: "Muy importante, valoro lo simbólico tanto como lo material", points: 9, tag: "simbólico", consequence: "El valor está en el significado, no solo en la cosa." },
      { text: "Prefiero que sea práctico, sin tantas vueltas", points: 6, tag: "funcional", consequence: "Buscás eficiencia por sobre simbolismos." },
    ],
  },
  {
    title: "¿Aceptarías trueques con personas que no conocés previamente?",
    options: [
      { text: "Sí, me gusta conocer nuevas realidades", points: 8, tag: "comunitario", consequence: "Abrís lazos con otras redes sociales." },
      { text: "Preferiría intercambiar solo con conocidos/as", points: 6, tag: "individualista", consequence: "Priorizás confianza y previsibilidad." },
    ],
  },
  {
    title: "¿Por qué te interesa participar de una red de trueques?",
    options: [
      { text: "Porque creo en formas alternativas de economía", points: 9, tag: "sociocrítico", consequence: "Cuestionás el modelo económico tradicional." },
      { text: "Porque puedo conseguir cosas sin gastar dinero", points: 6, tag: "utilitario", consequence: "Motivación pragmática frente al intercambio." },
    ],
  },
  {
    title: "¿Te interesa intercambiar habilidades o conocimientos?",
    options: [
      { text: "Sí, el conocimiento también es un bien", points: 9, tag: "cultural", consequence: "Priorizás la educación como recurso de valor." },
      { text: "No tanto, prefiero objetos concretos", points: 5, tag: "funcional", consequence: "Objetos físicos antes que lo intangible." },
    ],
  },
];

const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [level, setLevel] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const randomized = shuffle(allQuestions);
    setQuestions(randomized);
  }, []);

  const handleSelect = (option) => setSelected(option);

  const nextLevel = () => {
    const updated = [...answers];
    updated[level] = { ...questions[level], selected, comment };
    setAnswers(updated);
    setLevel((prev) => prev + 1);
    setSelected(null);
    setComment("");
  };

  const restart = () => {
    const randomized = shuffle(allQuestions);
    setQuestions(randomized);
    setAnswers([]);
    setLevel(0);
    setSelected(null);
    setComment("");
  };

  const isLast = level >= questions.length;
  const progress = (level / questions.length) * 100;
  const score = answers.reduce((sum, a) => sum + (a?.selected?.points || 0), 0);

  const tags = answers.reduce((acc, a) => {
    const tag = a?.selected?.tag;
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});

  const perfilCliente = Object.entries(tags).sort((a, b) => b[1] - a[1])[0]?.[0];

  const perfiles = {
    comunitario: "🤝 Cliente Comunitarista — valorás los vínculos y la cooperación.",
    utilitario: "🧰 Cliente Funcional — priorizás la utilidad por sobre el simbolismo.",
    simbólico: "🎭 Cliente Simbólico — lo emocional y el significado guían tus decisiones.",
    cultural: "📚 Cliente Culturalista — el conocimiento y la tradición son centrales para vos.",
    individualista: "🧍 Cliente Individualista — protegés tus tiempos y espacios propios.",
    funcional: "🛠 Cliente Pragmático — te mueve la lógica práctica del trueque.",
    sociocrítico: "🌀 Cliente Crítico — cuestionás los modelos de consumo tradicionales.",
    conservador: "🔒 Cliente Conservador — te guiás por estabilidad y pertenencia.",
  };

  useEffect(() => {
    if (isLast) {
      const data = {
        fecha: new Date().toISOString(),
        perfil: perfilCliente,
        puntaje: score,
        respuestas: answers.map((r) => ({
          pregunta: r.title,
          respuesta: r.selected.text,
          tag: r.selected.tag,
          puntos: r.selected.points,
          comentario: r.comment,
        })),
      };
      localStorage.setItem("cuestionario_trueque", JSON.stringify(data));
    }
  }, [isLast]);

  const exportCSV = () => {
    const headers = ["Pregunta", "Respuesta", "Tag", "Puntos", "Comentario"];
    const rows = answers.map((a) => [
      `"${a.title}"`,
      `"${a.selected.text}"`,
      a.selected.tag,
      a.selected.points,
      `"${a.comment || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "resultados_trueque.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 to-gray-200 flex flex-col items-center justify-center text-center p-6 font-sans text-gray-800">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-xl shadow-md p-8 space-y-6"
      >
        <h1 className="text-2xl font-bold">Relevamiento Inicial — Servicio de Trueques</h1>
        <Progress value={progress} className="h-2 bg-gray-300" />

        {!isLast && questions[level] && (
          <>
            <h2 className="text-lg font-medium">{questions[level].title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {questions[level].options.map((opt) => (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  key={opt.text}
                  onClick={() => handleSelect(opt)}
                  className={`rounded-lg border p-4 text-sm transition-colors duration-200 ${
                    selected?.text === opt.text
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-slate-100 hover:bg-slate-200 border-slate-300"
                  }`}
                >
                  {opt.text}
                </motion.button>
              ))}
            </div>
            {selected && (
              <div className="mt-4">
                <Textarea
                  placeholder="¿Por qué elegiste esta opción? (opcional)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            )}
          </>
        )}

        {selected && !isLast && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-2">
            <Button onClick={nextLevel}>Continuar</Button>
          </motion.div>
        )}

        {isLast && (
          <div className="space-y-6">
            <div className="text-left space-y-1">
              <p className="text-xl font-semibold text-indigo-700">
                Puntuación total: {score} / {questions.length * 10}
              </p>
              <p className="text-base text-gray-700 italic">
                {perfiles[perfilCliente] || "🧭 Perfil mixto — combinás varias perspectivas sociales."}
              </p>
            </div>
            <div className="mt-6 border-t pt-4 space-y-4">
              <h3 className="text-lg font-semibold text-left">Impacto de tus decisiones:</h3>
              {answers.map((ans, i) => (
                <div key={i} className="text-left border p-4 rounded-lg bg-slate-50">
                  <p className="font-medium">{ans.title}</p>
                  <p className="text-sm text-indigo-700 mt-1">Elegiste: {ans.selected.text}</p>
                  <p className="text-sm text-gray-600 italic mt-1">➡ {ans.selected.consequence}</p>
                  {ans.comment && (
                    <p className="text-sm text-gray-500 mt-2">💬 Tu razonamiento: {ans.comment}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <Button onClick={restart}>Reiniciar cuestionario</Button>
              <Button onClick={exportCSV}>Exportar CSV</Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
