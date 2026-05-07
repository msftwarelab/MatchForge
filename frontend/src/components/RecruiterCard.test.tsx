import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { RecruiterCard } from './RecruiterCard';
import type { RecruiterMatch } from '../types';

const match: RecruiterMatch = {
  profile: {
    id: 'r1',
    name: 'Maya Chen',
    firm: 'Northstar Talent',
    tagline: 'Embedded fintech and infra recruiting partner.',
    recruiter_type: 'fractional',
    industries: ['fintech', 'infrastructure'],
    role_focus: ['backend engineer'],
    seniority_focus: ['senior'],
    skills: ['python', 'langgraph'],
    locations: ['new york', 'remote us'],
    remote_friendly: true,
    fee_percentage: 18,
    placements_last_12_months: 24,
    avg_time_to_slate_days: 6,
    fill_rate: 0.82,
    active_search_capacity: 3,
    languages: ['English'],
    notable_clients: ['Mercury', 'Alloy'],
    bio: 'Bio',
  },
  score: 92,
  score_breakdown: {
    domain_expertise: 25,
    function_fit: 20,
    seniority_fit: 15,
    skill_overlap: 18,
    location_fit: 8,
    availability_fit: 6,
  },
  rationale: ['Strong fintech exposure.', 'Fast slate delivery.'],
  outreach: {
    subject: 'LedgerLoop search',
    email: 'Hello recruiter',
    sms: 'Quick ping',
  },
};

describe('RecruiterCard', () => {
  it('switches between email and sms outreach', async () => {
    const user = userEvent.setup();
    render(<RecruiterCard match={match} rank={1} />);

    expect(screen.getByText('Hello recruiter')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'sms' }));
    expect(screen.getByText('Quick ping')).toBeInTheDocument();
  });
});
