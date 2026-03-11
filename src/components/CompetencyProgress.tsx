"use client";

import { TrendingUp } from "lucide-react";
import { competencies } from "@/data/competencies";
import { useLang } from "@/lib/i18n";

export default function CompetencyProgress() {
  const { lang } = useLang();
  const lbl = (es: string, en: string) => lang === "es" ? es : en;
  return (
    <div className="bg-card rounded-2xl p-5 border border-card-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-semibold text-text-primary">
          {lbl("Competencias LOMLOE", "LOMLOE Competencies")}
        </h3>
        <span className="text-[10px] text-text-muted">{lbl("Este trimestre", "This trimester")}</span>
      </div>

      <div className="flex flex-col gap-3">
        {competencies.map((comp) => {
          const delta = comp.progress - comp.previousProgress;
          return (
            <div key={comp.key} className="flex items-center gap-3">
              {/* Label */}
              <div className="w-[90px] flex-shrink-0">
                <span className="text-[11px] font-medium text-text-secondary">
                  {comp.shortName}
                </span>
              </div>

              {/* Bar */}
              <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${comp.progress}%`,
                    backgroundColor: comp.color,
                  }}
                />
              </div>

              {/* Value */}
              <div className="w-[70px] flex items-center gap-1 justify-end flex-shrink-0">
                <span className="text-[12px] font-semibold text-text-primary">
                  {comp.progress}%
                </span>
                {delta > 0 && (
                  <span className="flex items-center text-[9px] text-success font-semibold">
                    <TrendingUp size={9} />+{delta}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
