import { useMutation, useQuery } from '@tanstack/react-query';

import { fetchScenarios, runMatch } from '../lib/api';

export function useScenarios() {
  return useQuery({
    queryKey: ['scenarios'],
    queryFn: fetchScenarios,
  });
}

export function useMatchMutation() {
  return useMutation({
    mutationFn: ({ brief, scenarioId }: { brief: string; scenarioId?: string | null }) => runMatch(brief, scenarioId),
  });
}
