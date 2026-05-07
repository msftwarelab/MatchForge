from __future__ import annotations

from app.models import ParsedBrief, RecruiterMatch, RecruiterProfile, ScoreBreakdown

DOMAIN_WEIGHT = 25
FUNCTION_WEIGHT = 20
SENIORITY_WEIGHT = 15
SKILL_WEIGHT = 20
LOCATION_WEIGHT = 10
AVAILABILITY_WEIGHT = 10


def retrieve_candidates(parsed_brief: ParsedBrief, recruiters: list[RecruiterProfile]) -> list[RecruiterProfile]:
    preferred = [
        recruiter
        for recruiter in recruiters
        if parsed_brief.industry in recruiter.industries or parsed_brief.function.lower() in recruiter.role_focus
    ]
    return preferred or recruiters


def _score_domain(parsed_brief: ParsedBrief, recruiter: RecruiterProfile) -> int:
    return DOMAIN_WEIGHT if parsed_brief.industry in recruiter.industries else DOMAIN_WEIGHT // 2


def _score_function(parsed_brief: ParsedBrief, recruiter: RecruiterProfile) -> int:
    function_key = parsed_brief.function.lower()
    return FUNCTION_WEIGHT if function_key in recruiter.role_focus else 8


def _score_seniority(parsed_brief: ParsedBrief, recruiter: RecruiterProfile) -> int:
    return SENIORITY_WEIGHT if parsed_brief.seniority in recruiter.seniority_focus else 7


def _score_skills(parsed_brief: ParsedBrief, recruiter: RecruiterProfile) -> int:
    if not parsed_brief.must_have_skills:
        return 10
    overlap = len(set(parsed_brief.must_have_skills).intersection(recruiter.skills))
    ratio = overlap / max(len(parsed_brief.must_have_skills), 1)
    return min(SKILL_WEIGHT, round(SKILL_WEIGHT * ratio) + 4)


def _score_location(parsed_brief: ParsedBrief, recruiter: RecruiterProfile) -> int:
    lowered_locations = {location.lower() for location in recruiter.locations}
    if parsed_brief.location.lower() in lowered_locations:
        return LOCATION_WEIGHT
    if recruiter.remote_friendly and "remote" in parsed_brief.work_model:
        return 8
    return 4


def _score_availability(parsed_brief: ParsedBrief, recruiter: RecruiterProfile) -> int:
    if parsed_brief.urgency == "critical":
        return max(4, AVAILABILITY_WEIGHT - recruiter.active_search_capacity)
    return min(AVAILABILITY_WEIGHT, 5 + (6 - min(recruiter.active_search_capacity, 6)))


def score_recruiters(parsed_brief: ParsedBrief, recruiters: list[RecruiterProfile]) -> list[tuple[RecruiterProfile, ScoreBreakdown, int, list[str]]]:
    scored: list[tuple[RecruiterProfile, ScoreBreakdown, int, list[str]]] = []
    for recruiter in recruiters:
        breakdown = ScoreBreakdown(
            domain_expertise=_score_domain(parsed_brief, recruiter),
            function_fit=_score_function(parsed_brief, recruiter),
            seniority_fit=_score_seniority(parsed_brief, recruiter),
            skill_overlap=_score_skills(parsed_brief, recruiter),
            location_fit=_score_location(parsed_brief, recruiter),
            availability_fit=_score_availability(parsed_brief, recruiter),
        )
        total = (
            breakdown.domain_expertise
            + breakdown.function_fit
            + breakdown.seniority_fit
            + breakdown.skill_overlap
            + breakdown.location_fit
            + breakdown.availability_fit
        )
        rationale = [
            f"Strong {parsed_brief.industry} exposure with {recruiter.placements_last_12_months} placements in the last year.",
            f"Typically delivers a slate in {recruiter.avg_time_to_slate_days} days with a {int(recruiter.fill_rate * 100)}% fill rate.",
        ]
        if parsed_brief.must_have_skills:
            overlap = sorted(set(parsed_brief.must_have_skills).intersection(recruiter.skills))
            if overlap:
                rationale.append(f"Skill overlap includes {', '.join(overlap[:3])}.")
        if recruiter.recruiter_type == parsed_brief.recruiter_type:
            rationale.append(f"Delivery model aligns with the requested {parsed_brief.recruiter_type} setup.")
        scored.append((recruiter, breakdown, total, rationale))

    scored.sort(key=lambda item: item[2], reverse=True)
    return scored[:4]


def build_match_objects(
    scored_recruiters: list[tuple[RecruiterProfile, ScoreBreakdown, int, list[str]]],
    outreach_by_recruiter: dict[str, tuple[str, str, str]],
) -> list[RecruiterMatch]:
    matches: list[RecruiterMatch] = []
    for recruiter, breakdown, total, rationale in scored_recruiters:
        subject, email, sms = outreach_by_recruiter[recruiter.id]
        matches.append(
            RecruiterMatch(
                profile=recruiter,
                score=total,
                score_breakdown=breakdown,
                rationale=rationale,
                outreach={
                    "subject": subject,
                    "email": email,
                    "sms": sms,
                },
            )
        )
    return matches
