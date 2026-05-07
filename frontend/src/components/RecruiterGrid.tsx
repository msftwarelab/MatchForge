import { RecruiterCard } from './RecruiterCard';
import type { MatchResponse } from '../types';

export function RecruiterGrid({ result }: { result?: MatchResponse | null }) {
  if (!result) {
    return (
      <section className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-400">
        Marketplace matches appear here with score breakdowns, recruiter narratives, and personalized outreach.
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {result.matches.map((match, index) => (
        <RecruiterCard key={match.profile.id} match={match} rank={index + 1} />
      ))}
    </section>
  );
}
