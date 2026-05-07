import type { MatchResponse, Scenario } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function fetchScenarios() {
  return request<Scenario[]>('/scenarios');
}

export function runMatch(brief: string, scenarioId?: string | null) {
  return request<MatchResponse>('/match', {
    method: 'POST',
    body: JSON.stringify({ brief, scenario_id: scenarioId ?? undefined }),
  });
}
