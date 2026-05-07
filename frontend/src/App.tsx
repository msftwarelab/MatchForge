import { useEffect, useMemo, useState } from 'react';

import { BriefComposer } from './components/BriefComposer';
import { HeroMetrics } from './components/HeroMetrics';
import { InsightsPanel } from './components/InsightsPanel';
import { PipelineBoard } from './components/PipelineBoard';
import { RecruiterGrid } from './components/RecruiterGrid';
import { ScenarioPanel } from './components/ScenarioPanel';
import { StatusBanner } from './components/StatusBanner';
import { TopBar } from './components/TopBar';
import { fallbackScenarios } from './data/fallbackScenarios';
import { useMatchMutation, useScenarios } from './hooks/useMatchForge';
import type { Scenario } from './types';

function App() {
  const scenariosQuery = useScenarios();
  const matchMutation = useMatchMutation();
  const scenarios = useMemo(() => scenariosQuery.data ?? fallbackScenarios, [scenariosQuery.data]);

  const [selectedScenario, setSelectedScenario] = useState<Scenario>(fallbackScenarios[0]);
  const [brief, setBrief] = useState(fallbackScenarios[0].brief);

  useEffect(() => {
    if (!scenarios.length) {
      return;
    }

    const preferredScenario = scenarios.find((scenario) => scenario.id === selectedScenario.id) ?? scenarios[0];
    setSelectedScenario(preferredScenario);
    setBrief((current) => (current.trim() ? current : preferredScenario.brief));
  }, [scenarios, selectedScenario.id]);

  function handleScenarioSelect(scenario: Scenario) {
    setSelectedScenario(scenario);
    setBrief(scenario.brief);
  }

  function handleSubmit() {
    matchMutation.mutate({
      brief,
      scenarioId: selectedScenario?.id,
    });
  }

  const result = matchMutation.data;
  const errorMessage = matchMutation.error instanceof Error ? matchMutation.error.message : null;

  return (
    <div className="min-h-screen bg-ink bg-grid bg-[size:22px_22px] text-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-6 lg:px-8 xl:px-10">
        <TopBar />
        <HeroMetrics result={result} />
        <StatusBanner loading={matchMutation.isPending} error={errorMessage} warnings={result?.warnings} />
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <ScenarioPanel
              scenarios={scenarios}
              selectedScenarioId={selectedScenario?.id}
              onSelect={handleScenarioSelect}
            />
            <BriefComposer
              brief={brief}
              onBriefChange={setBrief}
              onSubmit={handleSubmit}
              loading={matchMutation.isPending}
            />
          </div>
          <div className="space-y-6">
            <InsightsPanel result={result} />
            <PipelineBoard result={result} />
          </div>
        </div>
        <RecruiterGrid result={result} />
      </div>
    </div>
  );
}

export default App;
