"use client";

import { BookOpen, Cpu, Globe, Lightbulb, Users, Flag, Briefcase, Palette, TrendingUp, ArrowUp } from "lucide-react";
import { currentStudent } from "@/data/students";
import { useLang } from "@/lib/i18n";

interface CompetencyCard {
  key: string;
  labelEs: string;
  labelEn: string;
  icon: typeof BookOpen;
  iconColor: string;
  progress: number;
  previousProgress: number;
  whatItMeansEs: string;
  whatItMeansEn: string;
  thisWeekEs: string;
  thisWeekEn: string;
  teacherNoteEs?: string;
  teacherNoteEn?: string;
  parentTipEs?: string;
  parentTipEn?: string;
}

const excelling: CompetencyCard[] = [
  {
    key: "CE",
    labelEs: "Pensamiento emprendedor",
    labelEn: "Entrepreneurial thinking",
    icon: Briefcase,
    iconColor: "#FB923C",
    progress: 91,
    previousProgress: 83,
    whatItMeansEs: "La capacidad de convertir una idea en algo real — identificar oportunidades, tomar decisiones bajo incertidumbre y asumir la responsabilidad de los resultados.",
    whatItMeansEn: "The ability to turn an idea into something real — identifying opportunities, making decisions under uncertainty, and taking ownership of outcomes.",
    thisWeekEs: "Lucas diseñó un negocio Airbnb completo desde cero: investigación de mercado, estrategia de precios, identidad de marca y una página de aterrizaje. Cada decisión fue suya.",
    thisWeekEn: "Lucas designed a complete Airbnb business from scratch: market research, pricing strategy, brand identity, and a landing page. Every decision was his.",
    teacherNoteEs: 'Prof. Ana: "Su página de aterrizaje fue una de las mejores de la clase — propuesta de valor clara, precios reales y una voz auténtica. No copió una plantilla, construyó algo original."',
    teacherNoteEn: 'Prof. Ana: "His landing page was one of the best in class — clear value proposition, real pricing, and a voice that felt authentic. He didn\'t copy a template, he built something original."',
  },
  {
    key: "STEM",
    labelEs: "Matemáticas y pensamiento científico",
    labelEn: "Math & scientific thinking",
    icon: Cpu,
    iconColor: "#34D399",
    progress: 88,
    previousProgress: 82,
    whatItMeansEs: "Aplicar números, datos y lógica para entender y resolver problemas reales — no solo aprobar exámenes, sino usar las matemáticas para tomar decisiones.",
    whatItMeansEn: "Applying numbers, data, and logic to understand and solve real problems — not just passing exams, but using maths to make decisions.",
    thisWeekEs: "Construyó un modelo de precios funcional para su Airbnb. Calculó tasas de ocupación, precios estacionales y márgenes de beneficio usando datos reales de Airbnb en Málaga.",
    thisWeekEn: "Built a working pricing model for his Airbnb. Calculated occupancy rates, seasonal pricing, and profit margins using real Airbnb data from Málaga.",
    teacherNoteEs: 'Prof. Carlos: "Estructura lógica muy sólida en la hoja de cálculo. Detectó sus propios errores antes de que yo se los señalara — eso es una señal de precisión creciente."',
    teacherNoteEn: 'Prof. Carlos: "Strong logical structure in the spreadsheet. He caught his own formula errors before I pointed them out — that\'s a sign of growing precision."',
  },
];

const developing: CompetencyCard[] = [
  {
    key: "CD",
    labelEs: "Competencia digital",
    labelEn: "Digital competency",
    icon: Lightbulb,
    iconColor: "#60A5FA",
    progress: 85,
    previousProgress: 78,
    whatItMeansEs: "Usar herramientas digitales con confianza, creatividad y responsabilidad — no solo consumir tecnología, sino producir con ella.",
    whatItMeansEn: "Using digital tools confidently, creatively, and responsibly — not just consuming technology, but producing with it.",
    thisWeekEs: "Diseñó la página de aterrizaje en Canva y organizó todo el proyecto en Notion. Eligió las herramientas con propósito en lugar de quedarse con lo que ya conocía.",
    thisWeekEn: "Designed the landing page in Canva and organised the full project in Notion. Chose tools purposefully rather than defaulting to what he knew.",
  },
  {
    key: "CLC",
    labelEs: "Comunicación y lenguaje",
    labelEn: "Communication & language",
    icon: BookOpen,
    iconColor: "#4F8EF7",
    progress: 81,
    previousProgress: 74,
    whatItMeansEs: "Escribir y hablar con claridad a audiencias reales — no solo académicamente correcto, sino realmente persuasivo y comprensible.",
    whatItMeansEn: "Writing and speaking clearly to real audiences — not just academically correct, but actually persuasive and understood.",
    thisWeekEs: "Escribió el texto de la landing page de su Airbnb. Tuvo que describir la propiedad, establecer expectativas y convencer a un posible huésped — en lenguaje real.",
    thisWeekEn: "Wrote the landing page copy for his Airbnb. Had to describe the property, set expectations, and convince a potential guest — in real language.",
  },
  {
    key: "CPSAA",
    labelEs: "Trabajo en equipo y autoconocimiento",
    labelEn: "Teamwork & self-awareness",
    icon: Users,
    iconColor: "#FBBF24",
    progress: 76,
    previousProgress: 72,
    whatItMeansEs: "Entenderse como aprendiz — gestionar el tiempo, trabajar con los demás y aprender tanto del éxito como de los errores.",
    whatItMeansEn: "Understanding yourself as a learner — managing your time, working with others, and learning from both success and mistakes.",
    thisWeekEs: "Participó en una sesión de revisión entre compañeros. Dio feedback específico y constructivo a sus compañeros en lugar de un apoyo vago.",
    thisWeekEn: "Participated in a peer-review session with his tribe. Gave specific, constructive feedback to teammates rather than vague encouragement.",
    teacherNoteEs: 'Prof. Ana: "Está aprendiendo a decir lo que realmente piensa, no solo lo que la gente quiere escuchar. Eso es más difícil de lo que parece a esta edad."',
    teacherNoteEn: 'Prof. Ana: "He\'s learning to say what he actually thinks, not just what people want to hear. That\'s harder than it sounds at this age."',
  },
  {
    key: "CC",
    labelEs: "Comprensión cívica",
    labelEn: "Civic understanding",
    icon: Flag,
    iconColor: "#F87171",
    progress: 72,
    previousProgress: 68,
    whatItMeansEs: "Entender cómo funciona la sociedad — derechos, responsabilidades, impuestos, regulaciones — y verse como parte de ella.",
    whatItMeansEn: "Understanding how society works — rights, responsibilities, taxes, regulations — and seeing yourself as part of it.",
    thisWeekEs: "Estudió las obligaciones de IVA para alojamiento turístico en España. Calculó lo que paga realmente un huésped frente a lo que se queda el anfitrión.",
    thisWeekEn: "Studied IVA obligations for tourist accommodation in Spain. Calculated what a guest actually pays vs. what the host keeps.",
  },
];

const needsTime: CompetencyCard[] = [
  {
    key: "CPL",
    labelEs: "Trabajo en varios idiomas",
    labelEn: "Working across languages",
    icon: Globe,
    iconColor: "#A78BFA",
    progress: 68,
    previousProgress: 65,
    whatItMeansEs: "Usar más de un idioma como herramienta real — leer, investigar y comunicarse en contextos donde el español no es suficiente.",
    whatItMeansEn: "Using more than one language as a real tool — reading, researching, and communicating in contexts where Spanish isn't enough.",
    thisWeekEs: "Investigó anuncios internacionales de Airbnb. Tuvo que leer descripciones en inglés y extraer información útil — le llevó más tiempo del esperado.",
    thisWeekEn: "Researched international Airbnb listings. Had to read English descriptions and extract useful information — it took longer than expected.",
    parentTipEs: "Cuando navegues por internet juntos — una receta, una película, un producto — prueba a cambiar al inglés de vez en cuando. La exposición casual genera confianza más rápido que el estudio.",
    parentTipEn: "When browsing anything online together — a recipe, a film, a product — try switching to English occasionally. Casual exposure builds confidence faster than study.",
  },
  {
    key: "CCEC",
    labelEs: "Expresión cultural y creativa",
    labelEn: "Cultural & creative expression",
    icon: Palette,
    iconColor: "#E879F9",
    progress: 70,
    previousProgress: 66,
    whatItMeansEs: "Apreciar, interpretar y crear obras culturales y artísticas — entender que el diseño, la música y el arte comunican ideas.",
    whatItMeansEn: "Appreciating, interpreting, and creating cultural and artistic work — understanding that design, music, and art communicate ideas.",
    thisWeekEs: "Creó una identidad de marca para el Airbnb — concepto de logotipo, paleta de colores, tipografía. La Prof. Marta señaló que las elecciones de color fueron seguras pero la jerarquía tipográfica necesita refinamiento.",
    thisWeekEn: "Created a brand identity for the Airbnb — logo concept, colour palette, typography. Prof. Marta noted the colour choices were confident but the typography hierarchy needed refinement.",
    parentTipEs: "La próxima vez que visitéis una cafetería, tienda u hotel, pídele a Lucas que observe cómo se presenta. El diseño está en todas partes — notarlo desarrolla el ojo.",
    parentTipEn: "Next time you visit a café, shop, or hotel, ask Lucas what he notices about how it presents itself. Design is everywhere — noticing it builds the eye.",
  },
];

const evidences = [
  { titleEs: "Documento de investigación de competidores", titleEn: "Competitor Research Doc", done: true },
  { titleEs: "Hoja de estrategia de precios", titleEn: "Pricing Strategy Spreadsheet", done: true },
  { titleEs: "Página de aterrizaje (Canva)", titleEn: "Landing Page (Canva)", done: true },
  { titleEs: "Tarjeta de identidad de marca", titleEn: "Brand Identity Card", done: true },
  { titleEs: "Protocolo de higiene PDF", titleEn: "Hygiene Protocol PDF", done: true },
  { titleEs: "Hoja de cálculo de rentabilidad", titleEn: "Profitability Spreadsheet", done: false },
  { titleEs: "Ficha de cálculo de IVA", titleEn: "Tax Calculation Worksheet", done: false },
  { titleEs: "Guía del buen anfitrión", titleEn: "Good Host Guide", done: false },
  { titleEs: "Pitch del Demo Day", titleEn: "Demo Day Pitch", done: false },
  { titleEs: "Subida al portafolio digital", titleEn: "Digital Portfolio Upload", done: false },
];

function CompetencyBlock({ card, showTip }: { card: CompetencyCard; showTip?: boolean }) {
  const { lang } = useLang();
  const Icon = card.icon;
  const delta = card.progress - card.previousProgress;

  return (
    <div className="p-4 rounded-xl border border-card-border bg-card hover:shadow-sm transition-all">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: card.iconColor + "18" }}>
          <Icon size={16} style={{ color: card.iconColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[13px] font-bold text-text-primary">{lang === "es" ? card.labelEs : card.labelEn}</span>
            <div className="flex items-center gap-1 flex-shrink-0">
              <ArrowUp size={11} className="text-success" />
              <span className="text-[11px] font-bold text-success">+{delta}%</span>
            </div>
          </div>

          <p className="text-[12px] text-text-muted leading-relaxed mb-3">
            {lang === "es" ? card.whatItMeansEs : card.whatItMeansEn}
          </p>

          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${card.progress}%`, backgroundColor: card.iconColor }} />
            </div>
            <span className="text-[11px] font-bold flex-shrink-0" style={{ color: card.iconColor }}>{card.progress}%</span>
          </div>

          {/* This week */}
          <div className="bg-background rounded-xl p-3 mb-2">
            <p className="text-[10px] font-bold text-text-primary uppercase tracking-wide mb-1">
              {lang === "es" ? "Esta semana" : "This week"}
            </p>
            <p className="text-[12px] text-text-secondary leading-relaxed">
              {lang === "es" ? card.thisWeekEs : card.thisWeekEn}
            </p>
          </div>

          {/* Teacher note */}
          {(lang === "es" ? card.teacherNoteEs : card.teacherNoteEn) && (
            <div className="bg-accent-light rounded-xl p-3 border border-accent-text/10 mb-2">
              <p className="text-[12px] text-text-primary leading-relaxed italic">
                {lang === "es" ? card.teacherNoteEs : card.teacherNoteEn}
              </p>
            </div>
          )}

          {/* Parent tip — much more visible */}
          {showTip && (lang === "es" ? card.parentTipEs : card.parentTipEn) && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-base">💡</span>
                <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
                  {lang === "es" ? "Cómo puedes ayudar en casa" : "How you can help at home"}
                </p>
              </div>
              <p className="text-[12px] text-amber-900 leading-relaxed">
                {lang === "es" ? card.parentTipEs : card.parentTipEn}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ParentProgress() {
  const { lang } = useLang();
  const doneCount = evidences.filter((e) => e.done).length;

  const trimesterProjects = [
    { nameEs: "Gestiona tu Airbnb", nameEn: "Launch Your Airbnb", active: true, progress: 65 },
    { nameEs: "Food Truck Brand", nameEn: "Food Truck Brand", active: false, progress: 0 },
    { nameEs: "Pop-Up Store", nameEn: "Pop-Up Store", active: false, progress: 0 },
    { nameEs: "Pitch a QHUMA Capital", nameEn: "Pitch to QHUMA Capital", active: false, progress: 0 },
  ];

  return (
    <div className="flex gap-5">
      <div className="flex-1 min-w-0 flex flex-col gap-5">

        {/* AI narrative lead */}
        <div className="bg-accent-light rounded-2xl p-5 border border-accent-text/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-sidebar flex items-center justify-center">
              <TrendingUp size={12} className="text-accent" />
            </div>
            <span className="text-[11px] font-bold text-accent-text uppercase tracking-wide">
              {lang === "es" ? "Resumen de progreso · Semana 3" : "Progress summary · Week 3"}
            </span>
          </div>
          <p className="text-[13px] text-text-primary leading-relaxed">
            {lang === "es"
              ? <>Lucas está rindiendo <strong>por encima de lo esperado</strong> en las áreas que más importan para este proyecto — pensamiento emprendedor y matemáticas aplicadas. Su producción creativa ha sido sólida y muestra una verdadera apropiación de su trabajo. Las dos áreas que necesitan más tiempo son los idiomas y la expresión cultural, ambas normales en esta etapa y que se desarrollan gradualmente. <strong>Nada aquí requiere intervención</strong> — son oportunidades para reforzar en casa con momentos pequeños y naturales.</>
              : <>Lucas is performing <strong>above expectations</strong> in the areas that matter most for this project — entrepreneurial thinking and applied mathematics. His creative output has been strong and he&apos;s showing real ownership of his work. The two areas that need the most time are languages and cultural expression, both of which are normal at this stage and develop gradually. <strong>Nothing here requires intervention</strong> — these are opportunities to reinforce at home with small, natural moments.</>
            }
          </p>
        </div>

        {/* Excelling */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-success" />
            <h2 className="text-[14px] font-bold text-text-primary">
              {lang === "es" ? "Donde Lucas destaca" : "Where Lucas is excelling"}
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {excelling.map((c) => <CompetencyBlock key={c.key} card={c} />)}
          </div>
        </div>

        {/* Developing */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-accent-text" />
            <h2 className="text-[14px] font-bold text-text-primary">
              {lang === "es" ? "Desarrollándose bien" : "Developing steadily"}
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {developing.map((c) => <CompetencyBlock key={c.key} card={c} />)}
          </div>
        </div>

        {/* Needs time */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-warning" />
            <h2 className="text-[14px] font-bold text-text-primary">
              {lang === "es" ? "Necesita más tiempo" : "Needs more time"}
            </h2>
          </div>
          <p className="text-[11px] text-text-muted mb-3 ml-5">
            {lang === "es"
              ? "Está creciendo — no son problemas. Pequeñas cosas en casa marcan la diferencia real."
              : "These are growing — not problems. Small things at home make a real difference."
            }
          </p>
          <div className="flex flex-col gap-3">
            {needsTime.map((c) => <CompetencyBlock key={c.key} card={c} showTip />)}
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="w-[260px] flex-shrink-0 flex flex-col gap-4">

        {/* Trimester position */}
        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <h3 className="text-[13px] font-bold text-text-primary mb-0.5">
            {lang === "es" ? "Dónde estamos" : "Where we are"}
          </h3>
          <p className="text-[11px] text-text-muted mb-4">
            {lang === "es" ? "Trimestre 1 de 4 · Semana 3 de 3" : "Trimester 1 of 4 · Week 3 of 3"}
          </p>
          {trimesterProjects.map((t, i) => (
            <div key={i} className="mb-3 last:mb-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center flex-shrink-0 ${t.active ? "bg-sidebar text-white" : "bg-background text-text-muted"}`}>
                  {i + 1}
                </span>
                <span className={`text-[11px] ${t.active ? "font-bold text-text-primary" : "text-text-muted"}`}>
                  {lang === "es" ? t.nameEs : t.nameEn}
                </span>
              </div>
              <div className="h-1.5 bg-background rounded-full overflow-hidden ml-7">
                <div className="h-full rounded-full bg-sidebar" style={{ width: `${t.progress}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Evidence portfolio */}
        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[13px] font-bold text-text-primary">
              {lang === "es" ? "Portafolio de evidencias" : "Evidence portfolio"}
            </h3>
            <span className="text-[14px] font-black text-sidebar">{doneCount}<span className="text-text-muted font-normal text-[11px]">/{evidences.length}</span></span>
          </div>
          <p className="text-[11px] text-text-muted mb-3">
            {lang === "es" ? "Cada tarea genera un documento real." : "Every task produces a real document."}
          </p>
          <div className="h-2 bg-background rounded-full overflow-hidden mb-3">
            <div className="h-full bg-sidebar rounded-full transition-all" style={{ width: `${(doneCount / evidences.length) * 100}%` }} />
          </div>
          <div className="flex flex-col gap-1.5">
            {evidences.map((e) => (
              <div key={e.titleEn} className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${e.done ? "bg-success" : "bg-border"}`} />
                <span className={`text-[11px] ${e.done ? "text-text-secondary" : "text-text-muted"}`}>
                  {lang === "es" ? e.titleEs : e.titleEn}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
