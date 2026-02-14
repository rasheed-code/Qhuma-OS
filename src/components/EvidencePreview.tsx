import { TaskEvidence as TaskEvidenceType } from "@/types";

export function SpreadsheetPreview({ data }: { data: Record<string, unknown> }) {
  const headers = data.headers as string[];
  const rows = data.rows as string[][];
  return (
    <div className="w-full rounded-lg overflow-hidden border border-card-border text-[8px]">
      <div className="grid bg-sidebar text-white font-semibold" style={{ gridTemplateColumns: `repeat(${headers.length}, 1fr)` }}>
        {headers.map((h, i) => (
          <div key={i} className="px-1.5 py-1 truncate">{h}</div>
        ))}
      </div>
      {rows.slice(0, 3).map((row, ri) => (
        <div key={ri} className="grid border-t border-card-border" style={{ gridTemplateColumns: `repeat(${headers.length}, 1fr)` }}>
          {row.map((cell, ci) => (
            <div key={ci} className="px-1.5 py-0.5 truncate text-text-secondary">{cell}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function InfographicPreview({ data }: { data: Record<string, unknown> }) {
  const stats = data.stats as { label: string; value: number }[];
  const headline = data.headline as string;
  const maxVal = Math.max(...stats.map((s) => s.value));
  return (
    <div className="w-full rounded-lg border border-card-border p-2">
      <div className="text-[9px] font-bold text-text-primary mb-1">{headline}</div>
      <div className="flex items-end gap-1 h-10">
        {stats.map((s, i) => (
          <div key={i} className="flex flex-col items-center flex-1 gap-0.5">
            <div
              className="w-full rounded-sm bg-accent-dark"
              style={{ height: `${(s.value / maxVal) * 28}px` }}
            />
            <span className="text-[7px] text-text-muted">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DocumentPreview({ data }: { data: Record<string, unknown> }) {
  const docTitle = data.docTitle as string;
  const lines = data.lines as string[];
  return (
    <div className="w-full rounded-lg border border-card-border p-2.5 bg-white">
      <div className="text-[9px] font-bold text-text-primary mb-1.5 border-b border-card-border pb-1">{docTitle}</div>
      <div className="flex flex-col gap-1">
        {lines.slice(0, 3).map((_, i) => (
          <div key={i} className="h-1.5 rounded-full bg-background" style={{ width: `${85 - i * 12}%` }} />
        ))}
      </div>
    </div>
  );
}

export function FloorPlanPreview({ data }: { data: Record<string, unknown> }) {
  const rooms = data.rooms as { name: string; x: number; y: number; w: number; h: number; color: string }[];
  return (
    <div className="w-full rounded-lg border-2 border-text-muted p-1 relative" style={{ aspectRatio: "100/70" }}>
      {rooms.map((room, i) => (
        <div
          key={i}
          className="absolute rounded-sm flex items-center justify-center border border-white/60"
          style={{
            left: `${room.x}%`,
            top: `${room.y}%`,
            width: `${room.w}%`,
            height: `${room.h}%`,
            backgroundColor: room.color,
          }}
        >
          <span className="text-[7px] font-semibold text-text-secondary">{room.name}</span>
        </div>
      ))}
    </div>
  );
}

export function BrandBoardPreview({ data }: { data: Record<string, unknown> }) {
  const brandName = data.brandName as string;
  const colors = data.colors as string[];
  const tagline = data.tagline as string;
  return (
    <div className="w-full rounded-lg border border-card-border p-2.5 bg-white text-center">
      <div className="w-8 h-8 rounded-full mx-auto mb-1.5 flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: colors[0] }}>
        {brandName.charAt(0)}
      </div>
      <div className="text-[10px] font-bold text-text-primary">{brandName}</div>
      <div className="text-[7px] text-text-muted mb-1.5">{tagline}</div>
      <div className="flex items-center justify-center gap-1.5">
        {colors.map((c, i) => (
          <div key={i} className="w-5 h-5 rounded-full border border-card-border" style={{ backgroundColor: c }} />
        ))}
      </div>
    </div>
  );
}

export function DiagramPreview({ data }: { data: Record<string, unknown> }) {
  const steps = data.steps as { label: string }[];
  return (
    <div className="w-full rounded-lg border border-card-border p-2 flex items-center justify-between gap-0.5">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-0.5">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-accent-light border border-accent flex items-center justify-center">
              <span className="text-[7px] font-bold text-accent-text">{i + 1}</span>
            </div>
            <span className="text-[6px] text-text-muted mt-0.5 leading-none">{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className="w-2 h-px bg-accent-dark mt-[-8px]" />
          )}
        </div>
      ))}
    </div>
  );
}

export function LandingPagePreview({ data }: { data: Record<string, unknown> }) {
  const url = data.url as string;
  const heroGradient = data.heroGradient as string[];
  const sections = data.sections as string[];
  return (
    <div className="w-full rounded-lg border border-card-border overflow-hidden bg-white">
      <div className="flex items-center gap-1 px-2 py-1 bg-background border-b border-card-border">
        <div className="flex gap-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-urgent" />
          <div className="w-1.5 h-1.5 rounded-full bg-warning" />
          <div className="w-1.5 h-1.5 rounded-full bg-success" />
        </div>
        <div className="flex-1 text-center text-[7px] text-text-muted bg-white rounded px-1 py-0.5 mx-1 truncate">{url}</div>
      </div>
      <div
        className="h-6"
        style={{ background: `linear-gradient(135deg, ${heroGradient[0]}, ${heroGradient[1]})` }}
      />
      <div className="p-1.5 flex flex-col gap-1">
        {sections.slice(0, 3).map((_, i) => (
          <div key={i} className="h-1.5 rounded-full bg-background" style={{ width: `${90 - i * 15}%` }} />
        ))}
      </div>
    </div>
  );
}

export default function EvidencePreviewSwitch({ evidence }: { evidence: TaskEvidenceType }) {
  const data = evidence.previewData;
  switch (evidence.type) {
    case "spreadsheet":
      return <SpreadsheetPreview data={data} />;
    case "infographic":
      return <InfographicPreview data={data} />;
    case "document":
      return <DocumentPreview data={data} />;
    case "floor_plan":
      return <FloorPlanPreview data={data} />;
    case "brand_board":
      return <BrandBoardPreview data={data} />;
    case "diagram":
      return <DiagramPreview data={data} />;
    case "landing_page":
      return <LandingPagePreview data={data} />;
  }
}
