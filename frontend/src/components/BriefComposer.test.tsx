import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { BriefComposer } from './BriefComposer';

describe('BriefComposer', () => {
  it('submits valid briefs', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <BriefComposer
        brief="Hiring senior backend engineer in fintech with LangGraph"
        onBriefChange={vi.fn()}
        onSubmit={onSubmit}
        loading={false}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Run MatchForge' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('disables submission for short briefs', () => {
    render(
      <BriefComposer brief="short" onBriefChange={vi.fn()} onSubmit={vi.fn()} loading={false} />
    );

    expect(screen.getByRole('button', { name: 'Run MatchForge' })).toBeDisabled();
  });
});
