import { Building2, Clock3, Globe2, MessageSquareText, Sparkles } from 'lucide-react';
import { useState } from 'react';

import { cn, scoreTone, titleCase } from '../lib/utils';
import type { RecruiterMatch } from '../types';

export function RecruiterCard({ match, rank }: { match: RecruiterMatch; rank: number }) {
  const [activeTab, setActiveTab] = useState<'email' | 'sms'>('email');

  return (
    <article className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-violet-100">
            <Sparkles className="h-3.5 w-3.5" />
            #{rank} marketplace match
          </div>
          <h3 className="text-xl font-semibold text-white">{match.profile.name}</h3>
          <p className="mt-1 inline-flex items-center gap-2 text-sm text-slate-300">
            <Building2 className="h-4 w-4" />
            {match.profile.firm}
          </p>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">{match.profile.tagline}</p>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-slate-950/40 px-5 py-4 text-right">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Match score</p>
          <p className={cn('mt-2 text-4xl font-semibold', scoreTone(match.score))}>{match.score}</p>
          <p className="mt-1 text-xs text-slate-400">Fee {match.profile.fee_percentage}% · Fill rate {Math.round(match.profile.fill_rate * 100)}%</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {match.profile.industries.map((industry) => (
              <span key={industry} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                {titleCase(industry)}
              </span>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Slate speed</p>
              <p className="mt-2 inline-flex items-center gap-2 text-sm text-white">
                <Clock3 className="h-4 w-4 text-sky-200" />
                {match.profile.avg_time_to_slate_days} days
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Coverage</p>
              <p className="mt-2 text-sm text-white">{match.profile.placements_last_12_months} placements / 12 mo</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Locations</p>
              <p className="mt-2 inline-flex items-center gap-2 text-sm text-white">
                <Globe2 className="h-4 w-4 text-emerald-200" />
                {match.profile.locations.slice(0, 2).join(', ')}
              </p>
            </div>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-slate-950/35 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Why this recruiter</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {match.rationale.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Personalized outreach</p>
              <p className="mt-1 text-sm text-white">Built for recruiter activation inside Dover.</p>
            </div>
            <MessageSquareText className="h-4 w-4 text-violet-200" />
          </div>
          <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/5 p-1 text-xs text-slate-300">
            {(['email', 'sms'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'rounded-full px-3 py-1.5 capitalize transition',
                  activeTab === tab ? 'bg-white text-slate-950' : 'text-slate-300'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          {activeTab === 'email' ? (
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Subject</p>
                <p className="mt-2 text-white">{match.outreach.subject}</p>
              </div>
              <pre className="overflow-x-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-950/60 p-4 font-sans text-sm text-slate-200">
                {match.outreach.email}
              </pre>
            </div>
          ) : (
            <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-950/60 p-4 font-sans text-sm text-slate-200">
              {match.outreach.sms}
            </pre>
          )}
        </div>
      </div>
    </article>
  );
}
