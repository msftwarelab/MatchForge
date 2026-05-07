interface StatusBannerProps {
  loading: boolean;
  error?: string | null;
  warnings?: string[];
}

export function StatusBanner({ loading, error, warnings }: StatusBannerProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
        Running the LangGraph recruiter matching workflow…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
        {error}
      </div>
    );
  }

  if (warnings?.length) {
    return (
      <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
        {warnings.join(' ')}
      </div>
    );
  }

  return null;
}
