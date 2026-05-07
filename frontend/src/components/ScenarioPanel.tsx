import { MapPin, TimerReset } from 'lucide-react';

import { cn } from '../lib/utils';
import type { Scenario } from '../types';

interface ScenarioPanelProps {
  scenarios: Scenario[];
  selectedScenarioId?: string | null;
  onSelect: (scenario: Scenario) => void;
}

export function ScenarioPanel({ scenarios, selectedScenarioId, onSelect }: ScenarioPanelProps) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Hiring scenarios</h2>
          <p className="text-sm text-slate-300">Five realistic startup searches mapped to Dover-style marketplace workflows.</p>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
          5 presets
        </span>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {scenarios.map((scenario) => {
          const selected = scenario.id === selectedScenarioId;
          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => onSelect(scenario)}
              className={cn(
                'rounded-[24px] border px-5 py-4 text-left transition hover:-translate-y-0.5 hover:border-violet-300/40',
                selected
                  ? 'border-violet-300/50 bg-violet-500/10 shadow-glow'
                  : 'border-white/10 bg-slate-950/35'
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">{scenario.company}</p>
                  <h3 className="mt-1 text-lg text-slate-100">{scenario.title}</h3>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                  {scenario.urgency}
                </span>
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-slate-300">{scenario.stage}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {scenario.location}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1">
                  <TimerReset className="h-3.5 w-3.5" />
                  {scenario.team_size}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
