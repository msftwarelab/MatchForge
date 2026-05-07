from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class MatchRequest(BaseModel):
    brief: str = Field(min_length=8, max_length=2000)
    scenario_id: str | None = None


class Scenario(BaseModel):
    id: str
    company: str
    title: str
    brief: str
    stage: str
    urgency: Literal["medium", "high", "critical"]
    team_size: str
    location: str


class ParsedBrief(BaseModel):
    role_title: str
    function: str
    seniority: str
    industry: str
    location: str
    work_model: str
    recruiter_type: str
    urgency: str
    must_have_skills: list[str]
    nice_to_have_skills: list[str]
    compensation_band: str | None = None
    notes: list[str] = Field(default_factory=list)


class JobDescription(BaseModel):
    headline: str
    summary: str
    responsibilities: list[str]
    qualifications: list[str]
    interview_process: list[str]
    selling_points: list[str]


class OutreachMessage(BaseModel):
    subject: str
    email: str
    sms: str


class RecruiterProfile(BaseModel):
    id: str
    name: str
    firm: str
    tagline: str
    recruiter_type: str
    industries: list[str]
    role_focus: list[str]
    seniority_focus: list[str]
    skills: list[str]
    locations: list[str]
    remote_friendly: bool
    fee_percentage: int
    placements_last_12_months: int
    avg_time_to_slate_days: int
    fill_rate: float
    active_search_capacity: int
    languages: list[str]
    notable_clients: list[str]
    bio: str


class ScoreBreakdown(BaseModel):
    domain_expertise: int
    function_fit: int
    seniority_fit: int
    skill_overlap: int
    location_fit: int
    availability_fit: int


class RecruiterMatch(BaseModel):
    profile: RecruiterProfile
    score: int
    score_breakdown: ScoreBreakdown
    rationale: list[str]
    outreach: OutreachMessage


class PipelineStage(BaseModel):
    name: str
    count: int
    trend: str
    note: str


class PipelineSnapshot(BaseModel):
    summary: str
    bottleneck: str
    next_action: str
    stages: list[PipelineStage]


class MatchResponse(BaseModel):
    brief: str
    scenario: Scenario | None = None
    parsed_brief: ParsedBrief
    job_description: JobDescription
    matches: list[RecruiterMatch]
    pipeline: PipelineSnapshot
    warnings: list[str] = Field(default_factory=list)
    summary_metrics: dict[str, str]
