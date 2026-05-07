import { FileText, ListChecks } from 'lucide-react';

import { titleCase } from '../lib/utils';
import type { MatchResponse } from '../types';

export function InsightsPanel({ result }: { result?: MatchResponse | null }) {
  if (!result) {
    return (
      <section className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-400">
        Submit a brief to generate a structured job profile, recruiter rationale, and ATS-aware job description.
      </section>
    );
  }

  const { parsed_brief: parsedBrief, job_description: jobDescription } = result;

  return (
    <section className="grid gap-4 xl:grid-cols-[1.1fr_1.4fr]">
      <article className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-100">
            <ListChecks className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Parsed brief</h2>
            <p className="text-sm text-slate-300">Structured recruiting signal extracted from natural language.</p>
          </div>
        </div>
        <dl className="grid gap-4 sm:grid-cols-2">
          {[
            ['Role', parsedBrief.role_title],
            ['Industry', titleCase(parsedBrief.industry)],
            ['Seniority', titleCase(parsedBrief.seniority)],
            ['Work model', titleCase(parsedBrief.work_model)],
            ['Location', parsedBrief.location],
            ['Recruiter type', titleCase(parsedBrief.recruiter_type)],
            ['Urgency', titleCase(parsedBrief.urgency)],
            ['Comp band', parsedBrief.compensation_band ?? 'Not specified'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
              <dt className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</dt>
              <dd className="mt-2 text-sm font-medium text-white">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-5 flex flex-wrap gap-2">
          {parsedBrief.must_have_skills.map((skill) => (
            <span key={skill} className="rounded-full border border-emerald-300/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-100">
              {skill}
            </span>
          ))}
          {parsedBrief.must_have_skills.length === 0 && (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">No explicit skills detected</span>
          )}
        </div>
      </article>

      <article className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-2xl bg-sky-500/10 p-3 text-sky-100">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Generated job description</h2>
            <p className="text-sm text-slate-300">Polished summary, calibration prompts, and selling points for recruiter kickoff.</p>
          </div>
        </div>
        <div className="space-y-5 text-sm text-slate-200">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Headline</p>
            <p className="mt-2 text-lg font-semibold text-white">{jobDescription.headline}</p>
            <p className="mt-2 text-slate-300">{jobDescription.summary}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Responsibilities</p>
              <ul className="mt-2 space-y-2 text-slate-300">
                {jobDescription.responsibilities.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Qualifications</p>
              <ul className="mt-2 space-y-2 text-slate-300">
                {jobDescription.qualifications.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Interview process</p>
              <ul className="mt-2 space-y-2 text-slate-300">
                {jobDescription.interview_process.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Selling points</p>
              <ul className="mt-2 space-y-2 text-slate-300">
                {jobDescription.selling_points.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
