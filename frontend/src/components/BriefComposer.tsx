import { WandSparkles } from 'lucide-react';
import { FormEvent, useMemo } from 'react';

interface BriefComposerProps {
  brief: string;
  onBriefChange: (nextValue: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

const helperPrompts = [
  'Add seniority and startup stage',
  'Mention must-have skills',
  'Describe location and urgency',
  'Call out recruiter model preference',
];

export function BriefComposer({ brief, onBriefChange, onSubmit, loading }: BriefComposerProps) {
  const remaining = useMemo(() => Math.max(0, 2000 - brief.length), [brief.length]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <section className="rounded-[28px] border border-white/10 bg-gradient-to-br from-violet-500/10 via-slate-950/40 to-sky-500/10 p-6 backdrop-blur">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Job brief composer</h2>
          <p className="text-sm text-slate-300">Describe the role naturally — MatchForge handles parsing, matching, outreach, and pipeline framing.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/25 bg-violet-500/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-violet-100">
          <WandSparkles className="h-3.5 w-3.5" />
          ReAct workflow
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="sr-only">Job brief</span>
          <textarea
            value={brief}
            onChange={(event) => onBriefChange(event.target.value)}
            placeholder="Hiring senior backend engineer in fintech who knows LangGraph..."
            className="min-h-[180px] w-full rounded-[24px] border border-white/10 bg-slate-950/60 px-5 py-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-300/40 focus:ring-2 focus:ring-violet-400/20"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {helperPrompts.map((prompt) => (
            <span key={prompt} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              {prompt}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">{remaining} characters remaining</p>
          <button
            type="submit"
            disabled={loading || brief.trim().length < 8}
            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Forging recruiter matches…' : 'Run MatchForge'}
          </button>
        </div>
      </form>
    </section>
  );
}
