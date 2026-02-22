"use client";

import { BookOpen, Cpu, Globe, Lightbulb, Users, Flag, Briefcase, Palette } from "lucide-react";
import { currentStudent } from "@/data/students";

interface CompetencyCard {
  key: string;
  label: string;
  icon: typeof BookOpen;
  iconColor: string;
  progress: number;
  previousProgress: number;
  whatItMeans: string;
  thisWeek: string;
  teacherNote?: string;
  parentTip?: string;
}

const excelling: CompetencyCard[] = [
  {
    key: "CE",
    label: "Entrepreneurial thinking",
    icon: Briefcase,
    iconColor: "#FB923C",
    progress: 91,
    previousProgress: 83,
    whatItMeans:
      "The ability to turn an idea into something real — identifying opportunities, making decisions under uncertainty, and taking ownership of outcomes.",
    thisWeek:
      "Lucas designed a complete Airbnb business from scratch: market research, pricing strategy, brand identity, and a landing page. Every decision was his.",
    teacherNote:
      "Prof. Ana: \"His landing page was one of the best in class — clear value proposition, real pricing, and a voice that felt authentic. He didn't copy a template, he built something original.\"",
  },
  {
    key: "STEM",
    label: "Math & scientific thinking",
    icon: Cpu,
    iconColor: "#34D399",
    progress: 88,
    previousProgress: 82,
    whatItMeans:
      "Applying numbers, data, and logic to understand and solve real problems — not just passing exams, but using maths to make decisions.",
    thisWeek:
      "Built a working pricing model for his Airbnb. Calculated occupancy rates, seasonal pricing, and profit margins using real Airbnb data from Málaga.",
    teacherNote:
      "Prof. Carlos: \"Strong logical structure in the spreadsheet. He caught his own formula errors before I pointed them out — that's a sign of growing precision.\"",
  },
];

const developing: CompetencyCard[] = [
  {
    key: "CD",
    label: "Digital competency",
    icon: Lightbulb,
    iconColor: "#60A5FA",
    progress: 85,
    previousProgress: 78,
    whatItMeans:
      "Using digital tools confidently, creatively, and responsibly — not just consuming technology, but producing with it.",
    thisWeek:
      "Designed the landing page in Canva and organised the full project in Notion. Chose tools purposefully rather than defaulting to what he knew.",
  },
  {
    key: "CLC",
    label: "Communication & language",
    icon: BookOpen,
    iconColor: "#4F8EF7",
    progress: 81,
    previousProgress: 74,
    whatItMeans:
      "Writing and speaking clearly to real audiences — not just academically correct, but actually persuasive and understood.",
    thisWeek:
      "Wrote the landing page copy for his Airbnb. Had to describe the property, set expectations, and convince a potential guest — in real language.",
  },
  {
    key: "CPSAA",
    label: "Teamwork & self-awareness",
    icon: Users,
    iconColor: "#FBBF24",
    progress: 76,
    previousProgress: 72,
    whatItMeans:
      "Understanding yourself as a learner — managing your time, working with others, and learning from both success and mistakes.",
    thisWeek:
      "Participated in a peer-review session with his tribe. Gave specific, constructive feedback to teammates rather than vague encouragement.",
    teacherNote:
      "Prof. Ana: \"He's learning to say what he actually thinks, not just what people want to hear. That's harder than it sounds at this age.\"",
  },
  {
    key: "CC",
    label: "Civic understanding",
    icon: Flag,
    iconColor: "#F87171",
    progress: 72,
    previousProgress: 68,
    whatItMeans:
      "Understanding how society works — rights, responsibilities, taxes, regulations — and seeing yourself as part of it.",
    thisWeek:
      "Studied IVA obligations for tourist accommodation in Spain. Calculated what a guest actually pays vs. what the host keeps.",
  },
];

const needsTime: CompetencyCard[] = [
  {
    key: "CPL",
    label: "Working across languages",
    icon: Globe,
    iconColor: "#A78BFA",
    progress: 68,
    previousProgress: 65,
    whatItMeans:
      "Using more than one language as a real tool — reading, researching, and communicating in contexts where Spanish isn't enough.",
    thisWeek:
      "Researched international Airbnb listings. Had to read English descriptions and extract useful information — it took longer than expected.",
    parentTip:
      "When browsing anything online together — a recipe, a film, a product — try switching to English occasionally. Casual exposure builds confidence faster than study.",
  },
  {
    key: "CCEC",
    label: "Cultural & creative expression",
    icon: Palette,
    iconColor: "#E879F9",
    progress: 70,
    previousProgress: 66,
    whatItMeans:
      "Appreciating, interpreting, and creating cultural and artistic work — understanding that design, music, and art communicate ideas.",
    thisWeek:
      "Created a brand identity for the Airbnb — logo concept, colour palette, typography. Prof. Marta noted the colour choices were confident but the typography hierarchy needed refinement.",
    parentTip:
      "Next time you visit a café, shop, or hotel, ask Lucas what he notices about how it presents itself. Design is everywhere — noticing it builds the eye.",
  },
];

const evidences = [
  { title: "Competitor Research Doc", done: true },
  { title: "Pricing Strategy Spreadsheet", done: true },
  { title: "Landing Page (Canva)", done: true },
  { title: "Brand Identity Card", done: true },
  { title: "Hygiene Protocol PDF", done: true },
  { title: "Profitability Spreadsheet", done: false },
  { title: "Tax Calculation Worksheet", done: false },
  { title: "Good Host Guide", done: false },
  { title: "Demo Day Pitch", done: false },
  { title: "Digital Portfolio Upload", done: false },
];

function CompetencyBlock({ card, showTip }: { card: CompetencyCard; showTip?: boolean }) {
  const Icon = card.icon;
  const delta = card.progress - card.previousProgress;

  return (
    <div className="p-4 rounded-xl border border-card-border bg-card hover:border-border transition-colors">
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ backgroundColor: card.iconColor + "18" }}
        >
          <Icon size={14} style={{ color: card.iconColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className="text-[13px] font-semibold text-text-primary">{card.label}</span>
            <span className="text-[11px] font-medium text-success flex-shrink-0">+{delta}% this week</span>
          </div>

          <p className="text-[12px] text-text-muted leading-relaxed mb-3">
            {card.whatItMeans}
          </p>

          {/* Progress bar — supporting, not hero */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${card.progress}%`, backgroundColor: card.iconColor }}
              />
            </div>
            <span className="text-[10px] text-text-muted flex-shrink-0">{card.progress}%</span>
          </div>

          <div className="bg-background rounded-lg p-3 mb-2">
            <p className="text-[11px] font-semibold text-text-primary mb-0.5">This week</p>
            <p className="text-[12px] text-text-secondary leading-relaxed">{card.thisWeek}</p>
          </div>

          {card.teacherNote && (
            <div className="bg-accent-light rounded-lg p-3 border border-accent-text/10 mb-2">
              <p className="text-[12px] text-text-primary leading-relaxed italic">{card.teacherNote}</p>
            </div>
          )}

          {showTip && card.parentTip && (
            <div className="bg-warning-light rounded-lg p-3 border border-warning/20">
              <p className="text-[11px] font-semibold text-warning mb-0.5">How you can help</p>
              <p className="text-[12px] text-text-primary leading-relaxed">{card.parentTip}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ParentProgress() {
  const doneCount = evidences.filter((e) => e.done).length;

  return (
    <div className="flex gap-5">
      <div className="flex-1 min-w-0 flex flex-col gap-6">

        {/* AI narrative lead */}
        <div className="bg-accent-light rounded-2xl p-5 border border-accent-text/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-sidebar flex items-center justify-center">
              <span className="text-accent text-[9px] font-bold">AI</span>
            </div>
            <span className="text-[11px] font-semibold text-accent-text">Progress summary · Week 3</span>
          </div>
          <p className="text-[13px] text-text-primary leading-relaxed">
            Lucas is performing <strong>above expectations</strong> in the areas that matter most for this project — entrepreneurial thinking and applied mathematics. His creative output has been strong and he&apos;s showing real ownership of his work. The two areas that need the most time are languages and cultural expression, both of which are normal at this stage and develop gradually. <strong>Nothing here requires intervention</strong> — these are opportunities to reinforce at home with small, natural moments.
          </p>
        </div>

        {/* Excelling */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-success" />
            <h2 className="text-[14px] font-semibold text-text-primary">Where Lucas is excelling</h2>
          </div>
          <div className="flex flex-col gap-3">
            {excelling.map((c) => <CompetencyBlock key={c.key} card={c} />)}
          </div>
        </div>

        {/* Developing */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-accent-text" />
            <h2 className="text-[14px] font-semibold text-text-primary">Developing steadily</h2>
          </div>
          <div className="flex flex-col gap-3">
            {developing.map((c) => <CompetencyBlock key={c.key} card={c} />)}
          </div>
        </div>

        {/* Needs time */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-warning" />
            <h2 className="text-[14px] font-semibold text-text-primary">Needs more time</h2>
          </div>
          <p className="text-[11px] text-text-muted mb-3 ml-4">
            These are growing — not problems. Small things you can do at home make a real difference here.
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
          <h3 className="text-[13px] font-semibold text-text-primary mb-1">Where we are</h3>
          <p className="text-[11px] text-text-muted mb-4">Trimester 1 of 4 · Week 3 of 3</p>
          {[
            { name: "Launch Your Airbnb", active: true, progress: 65 },
            { name: "Food Truck Brand", active: false, progress: 0 },
            { name: "Pop-Up Store", active: false, progress: 0 },
            { name: "Pitch to QHUMA Capital", active: false, progress: 0 },
          ].map((t, i) => (
            <div key={t.name} className="mb-3 last:mb-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center flex-shrink-0 ${t.active ? "bg-accent-text text-white" : "bg-background text-text-muted"}`}>
                  {i + 1}
                </span>
                <span className={`text-[11px] ${t.active ? "font-semibold text-text-primary" : "text-text-muted"}`}>
                  {t.name}
                </span>
              </div>
              <div className="h-1 bg-background rounded-full overflow-hidden ml-6">
                <div className="h-full rounded-full bg-accent-text" style={{ width: `${t.progress}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Evidence portfolio */}
        <div className="bg-card rounded-2xl p-5 border border-card-border">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[13px] font-semibold text-text-primary">Evidence portfolio</h3>
            <span className="text-[13px] font-bold text-accent-text">{doneCount}<span className="text-text-muted font-normal text-[11px]">/{evidences.length}</span></span>
          </div>
          <p className="text-[11px] text-text-muted mb-3">Every task produces a real document.</p>
          <div className="h-1.5 bg-background rounded-full overflow-hidden mb-3">
            <div className="h-full bg-accent-text rounded-full" style={{ width: `${(doneCount / evidences.length) * 100}%` }} />
          </div>
          <div className="flex flex-col gap-1.5">
            {evidences.map((e) => (
              <div key={e.title} className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${e.done ? "bg-success" : "bg-border"}`} />
                <span className={`text-[11px] ${e.done ? "text-text-secondary" : "text-text-muted"}`}>
                  {e.title}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
