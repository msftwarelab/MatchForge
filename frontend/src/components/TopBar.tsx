import { BriefcaseBusiness, Sparkles } from 'lucide-react';

export function TopBar() {
  return (
    <header className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur xl:flex-row xl:items-center xl:justify-between">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-violet-200">
          <Sparkles className="h-3.5 w-3.5" />
          Dover marketplace + ATS demo
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-violet-500/15 p-3 text-violet-200">
            <BriefcaseBusiness className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">MatchForge AI</h1>
            <p className="text-sm text-slate-300">
              Natural-language recruiter matching for startup hiring teams.
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Mode</p>
          <p className="mt-1 font-medium text-white">Deterministic LangGraph demo</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Audience</p>
          <p className="mt-1 font-medium text-white">Dover product engineering</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Value</p>
          <p className="mt-1 font-medium text-white">Marketplace speed + ATS clarity</p>
        </div>
      </div>
    </header>
  );
}
