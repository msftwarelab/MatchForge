export interface Scenario {
  id: string;
  company: string;
  title: string;
  brief: string;
  stage: string;
  urgency: 'medium' | 'high' | 'critical';
  team_size: string;
  location: string;
}

export interface ParsedBrief {
  role_title: string;
  function: string;
  seniority: string;
  industry: string;
  location: string;
  work_model: string;
  recruiter_type: string;
  urgency: string;
  must_have_skills: string[];
  nice_to_have_skills: string[];
  compensation_band?: string | null;
  notes: string[];
}

export interface JobDescription {
  headline: string;
  summary: string;
  responsibilities: string[];
  qualifications: string[];
  interview_process: string[];
  selling_points: string[];
}

export interface RecruiterProfile {
  id: string;
  name: string;
  firm: string;
  tagline: string;
  recruiter_type: string;
  industries: string[];
  role_focus: string[];
  seniority_focus: string[];
  skills: string[];
  locations: string[];
  remote_friendly: boolean;
  fee_percentage: number;
  placements_last_12_months: number;
  avg_time_to_slate_days: number;
  fill_rate: number;
  active_search_capacity: number;
  languages: string[];
  notable_clients: string[];
  bio: string;
}

export interface ScoreBreakdown {
  domain_expertise: number;
  function_fit: number;
  seniority_fit: number;
  skill_overlap: number;
  location_fit: number;
  availability_fit: number;
}

export interface OutreachMessage {
  subject: string;
  email: string;
  sms: string;
}

export interface RecruiterMatch {
  profile: RecruiterProfile;
  score: number;
  score_breakdown: ScoreBreakdown;
  rationale: string[];
  outreach: OutreachMessage;
}

export interface PipelineStage {
  name: string;
  count: number;
  trend: string;
  note: string;
}

export interface PipelineSnapshot {
  summary: string;
  bottleneck: string;
  next_action: string;
  stages: PipelineStage[];
}

export interface MatchResponse {
  brief: string;
  scenario?: Scenario | null;
  parsed_brief: ParsedBrief;
  job_description: JobDescription;
  matches: RecruiterMatch[];
  pipeline: PipelineSnapshot;
  warnings: string[];
  summary_metrics: Record<string, string>;
}
