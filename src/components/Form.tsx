import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RenderInput from "./RenderInput";
import type { Step } from "./RenderInput";
import Typewriter from "typewriter-effect";

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    position: "absolute",
  }),
  center: {
    x: 0,
    opacity: 1,
    position: "relative",
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    position: "absolute",
  }),
};

const steps: Step[] = [
  {
    question: "¿Cuál es tu nombre?",
    type: "text",
    name: "nombre",
    placeholder: "Juan Pérez",
  },
  {
    question: "¿Qué edad tienes?",
    type: "number",
    name: "edad",
    placeholder: "30",
  },
  {
    question: "¿Dónde vives?",
    description: "Tu ciudad y país, por favor.",
    type: "text",
    name: "ubicacion",
    placeholder: "Bolivia - Tarija",
  },
  {
    question: "¿A qué te dedicas actualmente?",
    description:
      "Es una de esas preguntas que me ayudan a tener más contexto y entender un poco mejor quién está del otro lado del formulario.",
    type: "text",
    name: "ocupacion",
    placeholder: "Ing. de Sistemas",
  },
  {
    question:
      "¿Hay algo de tu cuerpo o tu salud que hoy te incomode o te gustaría mejorar?",
    description:
      "Puede ser tu cuerpo, tu energía, el sueño o cómo te queda la ropa. No hay respuestas correctas o incorrectas",
    type: "textarea",
    name: "incomodidad_actual",
    placeholder: "Exprésate libremente...",
  },
  {
    question:
      "¿Por qué sientes que ahora sí es el momento de ponerte las pilas?",
    description:
      "Algo cambió hoy. ¿Qué fue lo que finalmente te hizo decir 'basta' y dar este paso?",
    type: "textarea",
    name: "motivo_urgencia",
    placeholder: "Exprésate libremente...",
  },
  {
    question: "¿Qué te gustaría mejorar o conseguir con nuestra ayuda?",
    description:
      "¿Qué es eso de tu cuerpo o salud que ya no puedes seguir ignorando y te gustaría transformar de verdad?.",
    type: "textarea",
    name: "objetivo_con_nosotros",
    placeholder: "Exprésate libremente...",
  },
  {
    question: "¿Por qué piensas que podemos ayudarte a lograr lo que quieres?",
    description:
      "¿Qué viste o escuchaste que te hizo decir: 'esto es para mí'?.",
    type: "textarea",
    name: "confianza_en_nosotros",
    placeholder: "Exprésate libremente...",
  },
  {
    question: "¿Tuviste alguna vez un entrenador o nutricionista?",
    type: "select",
    name: "experiencia_prev_entrenador",
    options: [
      { label: "Sí", value: "si" },
      { label: "No", value: "no" },
    ],
  },
  {
    question: "¿Cómo fue tu experiencia con ese entrenador o especialista?",
    description:
      "Aquí no hay filtros. Si fue super malo puedes decirlo. Si fue buenísimo, nos alegrará leerlo (y si puedes pasarnos su contacto para felicitarlo, mejor).",
    type: "textarea",
    name: "detalle_experiencia_entrenador",
    placeholder: "Exprésate libremente...",
  },
  {
    question: "Escribe tu número telefónico",
    description:
      "Para poder contactarte y agendar una sesión de diagnóstico, necesitamos tu número de WhatsApp.",
    type: "tel",
    name: "telefono",
  },
  {
    question: "Y por si las moscas, tu e-mail",
    description:
      "Nada de spam. Solo lo usamos si no te encontramos por WhatsApp.",
    type: "email",
    name: "email",
    placeholder: "juanito@gmail.com",
  },
];

export default function Form() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState(() =>
    steps.reduce(
      (acc, step) => {
        acc[step.name] = "";
        return acc;
      },
      {} as Record<string, string>,
    ),
  );

  const progress = Math.round((currentStep / (steps.length - 1)) * 100);

  const handleCloseForm = () => {
    if (currentStep === 0) {
      const $dialog = document.querySelector(
        "#main-dialog",
      ) as HTMLDialogElement | null;
      $dialog?.close();
      document.body.style.overflow = "auto";
      return;
    }

    // Si venimos de la pregunta que sigue al salto
    if (
      currentStep === 10 &&
      formData["experiencia_prev_entrenador"] === "no"
    ) {
      setDirection(-1);
      setCurrentStep(currentStep - 2); // saltamos hacia atrás
      return;
    }

    setDirection(-1);
    setCurrentStep((prev) => prev - 1);
  };

  const nextStep = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const current = steps[currentStep];
    const nextIndex = currentStep + 1;

    // Saltar la pregunta de detalle si dijo "no" antes
    if (current.name === "experiencia_prev_entrenador") {
      const inputEl = document.querySelector<HTMLSelectElement>(
        `select[name="experiencia_prev_entrenador"]`,
      );

      if (inputEl?.value === "no") {
        setFormData((prev) => ({
          ...prev,
          experiencia_prev_entrenador: "no",
          detalle_experiencia_entrenador: "",
        }));
        setDirection(1);
        setCurrentStep(currentStep + 2);
        return;
      } else {
        // 👇️ importante para guardar "si" explícitamente antes de pasar de paso
        setFormData((prev) => ({
          ...prev,
          experiencia_prev_entrenador: "si",
        }));
      }
    }

    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(nextIndex);
    } else {
      setLoading(true);

      try {
        const res = await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const text = await res.text();
        let data;

        try {
          data = JSON.parse(text);
        } catch {
          data = { message: "Respuesta vacía o malformada del servidor" };
        }

        if (res.ok) {
          console.log("Formulario enviado correctamente.");
        } else {
          console.error("Error al enviar:", data.message);
        }
      } catch (err) {
        console.error("Fallo de red o servidor:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };

      // Si el campo es experiencia_prev_entrenador y es "no", limpiar detalle_experiencia_entrenador
      if (name === "experiencia_prev_entrenador" && value === "no") {
        newFormData["detalle_experiencia_entrenador"] = "";
      }

      return newFormData;
    });
  };

  return (
    <form>
      <div className="mb-6">
        <div className="[&>span]:text-light-text-secondary [&>span]:dark:text-dark-text-secondary mb-2 flex items-center justify-between gap-2 [&>span]:block [&>span]:w-fit [&>span]:text-sm">
          <span>{progress}%</span>
          <span>100%</span>
        </div>
        <span
          className="progress-bar bg-light-bg-surface relative block h-4 w-full rounded-2xl dark:bg-white"
          style={{ "--progress": `${progress}%` } as React.CSSProperties}
        />
      </div>

      <div className="relative min-h-24 overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <span className="text-light-text-primary dark:text-dark-text-primary text-md block font-bold">
              <Typewriter
                key={currentStep}
                onInit={(typewriter) => {
                  typewriter.typeString(steps[currentStep].question).start();
                }}
                options={{
                  cursor: "|",
                  delay: 40,
                }}
              />
            </span>

            {steps[currentStep].description && (
              <p className="text-light-text-secondary dark:text-dark-text-secondary mt-2 block text-sm">
                {steps[currentStep].description}
              </p>
            )}

            <RenderInput
              step={steps[currentStep]}
              value={formData[steps[currentStep].name]}
              onChange={handleChange}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={handleCloseForm}
          type="button"
          className="border-light-primary dark:border-dark-primary text-light-text-primary dark:text-dark-text-primary hover:bg-light-primary/20 hover:dark:bg-dark-primary/20 hover:text-light-primary hover:dark:text-dark-primary w-full cursor-pointer rounded-lg border py-2 text-sm transition-colors outline-none"
        >
          {currentStep === 0 ? "Cerrar" : "Atrás"}
        </button>
        <button
          onClick={nextStep}
          type="submit"
          className="bg-light-primary dark:bg-dark-primary border-light-primary dark:border-dark-primary hover:bg-light-primary/70 hover:dark:bg-dark-primary/70 disabled:bg-light-primary/60 disabled:dark:bg-dark-primary/60 w-full cursor-pointer rounded-lg py-2 text-sm text-white transition-colors outline-none disabled:cursor-not-allowed"
          disabled={loading}
        >
          {currentStep === steps.length - 1
            ? loading
              ? "Enviando..."
              : "Enviar"
            : "Siguiente"}
        </button>
      </div>
    </form>
  );
}
