from __future__ import annotations

from app.core.mock_data import SCENARIOS
from app.models import JobDescription, ParsedBrief, PipelineSnapshot, PipelineStage, RecruiterProfile, Scenario


def get_scenario(scenario_id: str | None) -> Scenario | None:
    if not scenario_id:
        return None
    return next((scenario for scenario in SCENARIOS if scenario.id == scenario_id), None)


def generate_job_description(parsed_brief: ParsedBrief, scenario: Scenario | None) -> JobDescription:
    company_context = scenario.company if scenario else "a high-growth startup"
    headline = f"{parsed_brief.role_title} — {company_context}"
    summary = (
        f"{company_context} is hiring a {parsed_brief.seniority} {parsed_brief.role_title.lower()} in {parsed_brief.industry}. "
        f"This search prioritizes {', '.join(parsed_brief.must_have_skills[:3]) or 'strong startup execution'} and a recruiter partner who can keep calibration tight."
    )
    responsibilities = [
        f"Own core outcomes for the {parsed_brief.function} roadmap with close partnership across product and leadership.",
        f"Translate business context in {parsed_brief.industry} into an execution plan that fits a {parsed_brief.work_model} team.",
        "Create high-signal collaboration loops with hiring managers and keep structured feedback moving quickly.",
    ]
    qualifications = [
        f"Demonstrated success operating at the {parsed_brief.seniority} level.",
        *[f"Hands-on strength with {skill}." for skill in parsed_brief.must_have_skills[:4]],
        f"Comfort working in a {parsed_brief.work_model} environment aligned to {parsed_brief.location}.",
    ]
    interview_process = [
        "Intro call with recruiter marketplace owner",
        "Hiring manager deep dive with scorecard alignment",
        "Practical work sample or calibration interview",
        "Founder or executive close",
    ]
    selling_points = [
        f"Meaningful ownership in a {parsed_brief.industry} category with urgent hiring momentum.",
        "Structured Dover-style recruiting operations with clear recruiter accountability.",
        "High-touch personalized outreach that respects candidate context.",
    ]
    return JobDescription(
        headline=headline,
        summary=summary,
        responsibilities=responsibilities,
        qualifications=qualifications,
        interview_process=interview_process,
        selling_points=selling_points,
    )


def generate_outreach(parsed_brief: ParsedBrief, recruiter: RecruiterProfile, scenario: Scenario | None) -> tuple[str, str, str]:
    company = scenario.company if scenario else "the hiring team"
    subject = f"{company}: {parsed_brief.role_title} search that fits your network"
    skill_line = ", ".join(parsed_brief.must_have_skills[:3]) or "high-signal execution"
    email = (
        f"Hi {recruiter.name.split()[0]},\n\n"
        f"We’re running a {parsed_brief.seniority} {parsed_brief.role_title.lower()} search for {company} and your background in {parsed_brief.industry} stood out. "
        f"The role needs strength in {skill_line}, plus a recruiter partner who can move quickly and keep founders calibrated.\n\n"
        f"Given your work with {', '.join(recruiter.notable_clients[:2])} and your {recruiter.avg_time_to_slate_days}-day average to first slate, you look like a strong fit. "
        f"Would you be open to a quick sync on search scope, candidate narrative, and how we’d run outreach through Dover?\n\n"
        "Best,\nMatchForge AI"
    )
    sms = (
        f"Hi {recruiter.name.split()[0]} — {company} is hiring a {parsed_brief.role_title.lower()} in {parsed_brief.industry}. "
        f"Your background in {skill_line} looks like a great fit. Open to a quick chat this week?"
    )
    return subject, email, sms


def build_pipeline(parsed_brief: ParsedBrief, scenario: Scenario | None) -> PipelineSnapshot:
    urgency_multiplier = {"medium": 0, "high": 1, "critical": 2}[parsed_brief.urgency]
    base_counts = {
        "Applied": 42 - (urgency_multiplier * 4),
        "Screen": 16 + urgency_multiplier,
        "Hiring Manager": 7,
        "Panel": 3,
        "Offer": 1,
    }
    stages = [
        PipelineStage(name="Applied", count=base_counts["Applied"], trend="steady", note="Inbound plus marketplace sourced prospects."),
        PipelineStage(name="Screen", count=base_counts["Screen"], trend="up", note="Recruiter screens are landing, but scorecards need consistency."),
        PipelineStage(name="Hiring Manager", count=base_counts["Hiring Manager"], trend="flat", note="Calibration loops are the main conversion risk."),
        PipelineStage(name="Panel", count=base_counts["Panel"], trend="down", note="On-site capacity is limited and scheduling is slow."),
        PipelineStage(name="Offer", count=base_counts["Offer"], trend="watch", note="Need faster close planning and personalized follow-up."),
    ]
    summary = scenario.stage if scenario else f"Marketplace coverage exists, but {parsed_brief.function} calibration is the pressure point."
    bottleneck = "Hiring Manager" if parsed_brief.function != "operations manager" else "Screen"
    next_action = (
        "Route matched recruiters into a shared scorecard template and automate next-step nudges."
        if bottleneck == "Hiring Manager"
        else "Assign an embedded recruiting operator to clean ATS hygiene and stage ownership."
    )
    return PipelineSnapshot(summary=summary, bottleneck=bottleneck, next_action=next_action, stages=stages)
