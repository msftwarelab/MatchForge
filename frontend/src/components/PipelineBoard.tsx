import { ArrowRightCircle } from 'lucide-react';

import { cn } from '../lib/utils';
import type { MatchResponse } from '../types';

export function PipelineBoard({ result }: { result?: MatchResponse | null }) {
  if (!result) {
    return (
      <section className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-400">
        ATS pipeline insights will surface once MatchForge processes a brief.
      </section>
    );
  }

  return (
    <section className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Pipeline view</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-300">{result.pipeline.summary}</p>
        </div>
        <div className="rounded-2xl border border-amber-300/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Bottleneck: {result.pipeline.bottleneck}
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-5">
        {result.pipeline.stages.map((stage) => (
          <article
            key={stage.name}
            className={cn(
              'rounded-[24px] border bg-slate-950/40 p-4',
              stage.name === result.pipeline.bottleneck ? 'border-amber-300/40' : 'border-white/10'
            )}
          >
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{stage.name}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{stage.count}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">Trend: {stage.trend}</p>
            <p className="mt-4 text-sm text-slate-300">{stage.note}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-[24px] border border-sky-300/20 bg-sky-500/10 p-4 text-sky-50">
        <ArrowRightCircle className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-sky-100/80">Recommended next action</p>
          <p className="mt-1 text-sm">{result.pipeline.next_action}</p>
        </div>
      </div>
    </section>
  );
}
