// src/App.js
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

const allQuestions = [
  { title: "¿Qué tipo de intercambios preferís realizar?", options: [
      { text: "Intercambios de bienes materiales (ropa, herramientas, alimentos, etc.)", points: 6 },
      { text: "Intercambios de servicios o conocimientos (clases, arreglos, asesorías)", points: 9 },
  ]},
  { title: "¿Alguna vez participaste en un intercambio sin dinero?", options: [
      { text: "Sí, varias veces", points: 9 },
      { text: "Una o dos veces", points: 6 },
      { text: "Nunca, pero me interesa", points: 3 },
      { text: "No, y no me interesa", points: 0 },
  ]},
  { title: "¿Qué significa para vos hacer un intercambio sin usar dinero?", type: "open" },
  { title: "¿Cómo imaginás una comunidad basada principalmente en el intercambio?", type: "open" },
  { title: "¿Qué obstáculos personales creés que te impedirían participar en un trueque?", type: "open" },
  { title: "¿Qué te ayudaría a sentirte más cómodo/a para hacer un trueque?", options: [
      { text: "Saber exactamente cómo funciona", points: 9 },
      { text: "Ver ejemplos o testimonios", points: 6 },
      { text: "Que haya alguien que me acompañe", points: 3 },
      { text: "Nada, ya me siento cómodo/a", points: 9 },
  ]},
  { title: "¿Qué te gustaría poder intercambiar más adelante?", options: [
      { text: "Cosas que ya no uso", points: 6 },
      { text: "Conocimientos o habilidades", points: 9 },
      { text: "Tiempo o acompañamiento", points: 6 },
      { text: "Todavía no lo sé", points: 3 },
  ]},
  { title: "¿Cómo te gustaría que fuera visualmente la app de intercambio?", options: [
      { text: "Con colores vivos y llamativos", points: 6 },
      { text: "Minimalista y clara", points: 9 },
      { text: "No me importa mucho mientras funcione", points: 3 },
      { text: "Otro", points: 0 },
  ]},
  { title: "¿Con qué frecuencia te gustaría participar en intercambios?", options: [
      { text: "Todas las semanas", points: 9 },
      { text: "Una vez al mes", points: 6 },
      { text: "Cada tanto", points: 3 },
      { text: "Muy raramente", points: 0 },
  ]},
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
    setQuestions(shuffle(allQuestions));
  }, []);

  const canContinue = personalInfo.nombre.trim() && personalInfo.barrio.trim() && personalInfo.genero.trim();

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const nextLevel = () => {
    const updated = [...answers];
    updated[level] = { ...questions[level], selected, comment };
    setAnswers(updated);

    if (level + 1 >= questions.length) {
      const data = {
        fecha: new Date().toISOString(),
        nombre: personalInfo.nombre,
        barrio: personalInfo.barrio,
        edad: personalInfo.edad,
        genero: personalInfo.genero === "Otro" ? otroGenero : personalInfo.genero,
        puntaje: updated.reduce((sum, r) => sum + (r.selected?.points || 0), 0),
        respuestas: updated.map((r) => ({
          pregunta: r.title,
          respuesta: r.selected?.text || r.comment || "(sin respuesta)",
          puntos: r.selected?.points || 0,
          comentario: r.comment || "",
        })),
      };
      localStorage.setItem("cuestionario_trueque", JSON.stringify(data));
    }

    setSelected(null);
    setComment("");
    setLevel((prev) => prev + 1);
  };

  const restart = () => {
    setQuestions(shuffle(allQuestions));
    setAnswers([]);
    setLevel(0);
    setSelected(null);
    setComment("");
    setInfoComplete(false);
  };

  const exportCSV = () => {
    const headers = ["Pregunta", "Respuesta", "Puntos", "Comentario"];
    const rows = answers.map((r) => [
      `"${r.title}"`,
      `"${r.selected?.text || r.comment || "(sin respuesta)"}"`,
      r.selected?.points || 0,
      `"${r.comment || ""}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "resultados_trueque.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isLast = level >= questions.length;
  const progress = (level / questions.length) * 100;
  const score = answers.reduce((sum, r) => sum + (r.selected?.points || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 to-gray-200 flex flex-col items-center justify-center text-center p-6 font-sans text-gray-800">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full bg-white rounded-xl shadow-md p-8 space-y-6">
        <h1 className="text-2xl font-bold">Relevamiento Inicial — Servicio de Trueques</h1>
        <p className="text-sm text-gray-600">El trueque es un intercambio directo sin dinero.</p>
        <Progress value={progress} className="h-2 bg-gray-300" />

        {!infoComplete ? (
          <div className="space-y-4 text-left">
            <h2 className="text-xl font-semibold">Antes de empezar...</h2>
            <input type="text" name="nombre" placeholder="Tu nombre" value={personalInfo.nombre} onChange={handlePersonalChange} className="w-full border rounded p-2" />
            <input type="text" name="edad" placeholder="Edad (opcional)" value={personalInfo.edad} onChange={handlePersonalChange} className="w-full border rounded p-2" />
            <input type="text" name="barrio" placeholder="Barrio / Localidad" value={personalInfo.barrio} onChange={handlePersonalChange} className="w-full border rounded p-2" />
            <select name="genero" value={personalInfo.genero} onChange={handlePersonalChange} className="w-full border rounded p-2">
              <option value="">Seleccioná tu género</option>
              <option value="Femenino">Femenino</option>
              <option value="Masculino">Masculino</option>
              <option value="Otro">Otro</option>
            </select>
            {personalInfo.genero === "Otro" && (
              <input type="text" placeholder="Ingresá tu identidad de género" value={otroGenero} onChange={(e) => setOtroGenero(e.target.value)} className="w-full border rounded p-2" />
            )}
            <Button onClick={() => setInfoComplete(true)} disabled={!canContinue}>Empezar cuestionario</Button>
          </div>
        ) : !isLast && questions[level] ? (
          questions[level].type === "open" ? (
            <div className="mt-4">
              <Textarea placeholder="Escribí tu respuesta..." value={comment} onChange={(e) => setComment(e.target.value)} className="w-full" />
              <Button onClick={nextLevel} disabled={!comment.trim()} className="mt-4">Continuar</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {questions[level].options.map((opt) => (
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} key={opt.text} onClick={() => setSelected(opt)} className={`rounded-lg border p-4 text-sm ${selected?.text === opt.text ? "bg-indigo-600 text-white" : "bg-slate-100 hover:bg-slate-200"}`}>{opt.text}</motion.button>
                ))}
              </div>
              {selected && (
                <>
                  <Textarea placeholder="Comentario opcional" value={comment} onChange={(e) => setComment(e.target.value)} className="w-full mt-4" />
                  <Button onClick={nextLevel} className="mt-4">Continuar</Button>
                </>
              )}
            </>
          )
        ) : (
          <div className="space-y-6">
            <p className="text-xl font-semibold">Gracias por participar, {personalInfo.nombre} 💬</p>
            <p className="text-gray-700 italic">Tu puntaje: {score} / {questions.length * 10}</p>
            <Button onClick={exportCSV}>Exportar CSV</Button>
            <Button onClick={restart}>Reiniciar</Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
