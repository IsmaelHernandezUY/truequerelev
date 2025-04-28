import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

const allQuestions = [
  {
    title: "¿Qué tipo de intercambios preferís realizar?",
    options: [
      { text: "Intercambios de bienes materiales (ropa, herramientas, alimentos, etc.)", points: 6 },
      { text: "Intercambios de servicios o conocimientos (clases, arreglos, asesorías)", points: 9 },
    ],
  },
  {
    title: "¿Alguna vez participaste en un intercambio sin dinero?",
    options: [
      { text: "Sí, varias veces", points: 9 },
      { text: "Una o dos veces", points: 6 },
      { text: "Nunca, pero me interesa", points: 3 },
      { text: "No, y no me interesa", points: 0 },
    ],
  },
  {
    title: "¿Qué significa para vos hacer un intercambio sin usar dinero?",
    type: "open",
  },
  {
    title: "¿Cómo imaginás una comunidad basada principalmente en el intercambio?",
    type: "open",
  },
  {
    title: "¿Qué obstáculos personales creés que te impedirían o dificultarían participar en un trueque?",
    type: "open",
  },
  {
    title: "¿Qué te ayudaría a sentirte más cómodo/a para hacer un trueque?",
    options: [
      { text: "Saber exactamente cómo funciona", points: 9 },
      { text: "Ver ejemplos o testimonios de otras personas", points: 6 },
      { text: "Que haya alguien que me acompañe", points: 3 },
      { text: "Nada, ya me siento cómodo/a", points: 9 },
    ],
  },
  {
    title: "¿Qué te gustaría poder intercambiar más adelante?",
    options: [
      { text: "Cosas que ya no uso", points: 6 },
      { text: "Conocimientos o habilidades que tengo", points: 9 },
      { text: "Tiempo o acompañamiento", points: 6 },
      { text: "Todavía no lo sé", points: 3 },
    ],
  },
  {
    title: "¿Cómo te gustaría que fuera visualmente la aplicación o espacio de intercambio?",
    options: [
      { text: "Con colores vivos y diseño llamativo", points: 6 },
      { text: "Minimalista y claro", points: 9 },
      { text: "No me importa mucho mientras funcione", points: 3 },
      { text: "Otro", points: 0 },
    ],
  },
  {
    title: "¿Con qué frecuencia te gustaría participar en intercambios?",
    options: [
      { text: "Todas las semanas", points: 9 },
      { text: "Una vez al mes", points: 6 },
      { text: "Cada tanto, cuando lo necesite", points: 3 },
      { text: "Muy raramente", points: 0 },
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
  const [personalInfo, setPersonalInfo] = useState({ nombre: "", edad: "", barrio: "", genero: "" });
  const [infoComplete, setInfoComplete] = useState(false);
  const [otroGenero, setOtroGenero] = useState("");

  useEffect(() => {
    const randomized = shuffle(allQuestions);
    setQuestions(randomized);
  }, []);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const canContinue = personalInfo.nombre.trim() !== "" && personalInfo.barrio.trim() !== "" && personalInfo.genero.trim() !== "";

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
    setInfoComplete(false);
  };

  const isLast = level >= questions.length;
  const progress = (level / questions.length) * 100;
  const score = answers.reduce((sum, a) => sum + (a?.selected?.points || 0), 0);

  useEffect(() => {
    if (isLast) {
      const data = {
        fecha: new Date().toISOString(),
        nombre: personalInfo.nombre,
        barrio: personalInfo.barrio,
        edad: personalInfo.edad,
        genero: personalInfo.genero === "Otro" ? otroGenero : personalInfo.genero,
        puntaje: score,
        respuestas: answers.map((r) => ({
          pregunta: r.title,
          respuesta: r.selected.text,
          puntos: r.selected.points,
          comentario: r.comment,
        })),
      };
      localStorage.setItem("cuestionario_trueque", JSON.stringify(data));
    }
  }, [isLast]);

  const exportCSV = () => {
    const headers = ["Pregunta", "Respuesta", "Puntos", "Comentario"];
    const rows = answers.map((a) => [
      `"${a.title}"`,
      `"${a.selected.text}"`,
      a.selected.points,
      `"${a.comment || ""}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
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
<p className="text-sm text-gray-600">
  El trueque es un intercambio directo de bienes o servicios entre personas, sin usar dinero. Cada persona puede ofrecer algo, esperando que otra persona le de algo que necesite a cambio.
</p>
<Progress value={progress} className="h-2 bg-gray-300" />


        {!infoComplete ? (
          <div className="space-y-4 text-left">
            <h2 className="text-xl font-semibold">Antes de empezar...</h2>
            <p className="text-sm text-gray-600">Contanos un poquito sobre vos:</p>
            <input
              type="text"
              name="nombre"
              placeholder="Tu nombre"
              value={personalInfo.nombre}
              onChange={handlePersonalChange}
              className="w-full border rounded p-2"
            />
            <input
              type="text"
              name="edad"
              placeholder="Edad (opcional)"
              value={personalInfo.edad}
              onChange={handlePersonalChange}
              className="w-full border rounded p-2"
            />
            <input
              type="text"
              name="barrio"
              placeholder="Barrio / Localidad"
              value={personalInfo.barrio}
              onChange={handlePersonalChange}
              className="w-full border rounded p-2"
            />
            <select
              name="genero"
              value={personalInfo.genero}
              onChange={handlePersonalChange}
              className="w-full border rounded p-2"
            >
              <option value="">Seleccioná tu género</option>
              <option value="Femenino">Femenino</option>
              <option value="Masculino">Masculino</option>
              <option value="Otro">Otro</option>
            </select>
            {personalInfo.genero === "Otro" && (
              <input
                type="text"
                placeholder="Ingresá tu identidad de género"
                value={otroGenero}
                onChange={(e) => setOtroGenero(e.target.value)}
                className="w-full border rounded p-2"
              />
            )}
            <Button onClick={() => setInfoComplete(true)} disabled={!canContinue}>
              Empezar cuestionario
            </Button>
          </div>
        ) : !isLast && questions[level] ? (
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
                  placeholder="¿Querés contarnos por qué elegiste esta opción? (opcional)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            )}
            {selected && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-2">
                <Button onClick={nextLevel}>Continuar</Button>
              </motion.div>
            )}
          </>
        ) : (
          <div className="space-y-6">
            <div className="text-left space-y-1">
              <p className="text-xl font-semibold text-indigo-700">
                Gracias por participar, {personalInfo.nombre} 💬
              </p>
              <p className="text-base text-gray-700 italic">
                Tu puntaje total fue: {score} / {questions.length * 10}
              </p>
            </div>
            <div className="mt-6 border-t pt-4 space-y-4">
              <h3 className="text-lg font-semibold text-left">Tus respuestas:</h3>
              {answers.map((ans, i) => (
                <div key={i} className="text-left border p-4 rounded-lg bg-slate-50">
                  <p className="font-medium">{ans.title}</p>
                  <p className="text-sm text-indigo-700 mt-1">Elegiste: {ans.selected.text}</p>
                  {ans.comment && (
                    <p className="text-sm text-gray-500 mt-2">💬 Comentario: {ans.comment}</p>
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
