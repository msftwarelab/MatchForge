import { Gauge, Rocket, Route, Users } from 'lucide-react';

import type { MatchResponse } from '../types';

const metricStyles = [
  { label: 'Top recruiter score', icon: Gauge, key: 'top_score' },
  { label: 'Recruiters reviewed', icon: Users, key: 'recruiters_reviewed' },
  { label: 'Pipeline bottleneck', icon: Route, key: 'pipeline_bottleneck' },
  { label: 'Recommended motion', icon: Rocket, key: 'recommended_motion' },
] as const;

export function HeroMetrics({ result }: { result?: MatchResponse | null }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metricStyles.map(({ label, icon: Icon, key }) => (
        <article key={key} className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-300">{label}</p>
            <Icon className="h-4 w-4 text-violet-200" />
          </div>
          <p className="mt-6 text-2xl font-semibold text-white">
            {result?.summary_metrics[key] ?? (key === 'top_score' ? '—' : 'Waiting for run')}
          </p>
        </article>
      ))}
    </section>
  );
}
