from __future__ import annotations

import re
from dataclasses import dataclass

from app.core.mock_data import SCENARIOS
from app.models import ParsedBrief

KNOWN_SKILLS = {
    "langgraph",
    "python",
    "distributed systems",
    "kafka",
    "microservices",
    "healthcare compliance",
    "outbound",
    "growth marketing",
    "ai products",
    "plg",
    "open source",
    "developer relations",
    "content",
    "community",
    "ats",
    "process design",
    "logistics",
    "stakeholder management",
    "llm",
}

ROLE_KEYWORDS = {
    "backend engineer": ["backend", "platform", "infra", "distributed systems"],
    "account executive": ["account executive", "ae", "sales"],
    "growth marketer": ["growth marketer", "growth marketing", "demand gen"],
    "product lead": ["product leader", "product lead", "pm"],
    "developer relations": ["developer relations", "devrel", "community"],
    "operations manager": ["operations manager", "bizops", "analyst", "operator"],
}

INDUSTRY_KEYWORDS = {
    "fintech": ["fintech", "payments", "banking"],
    "healthtech": ["healthtech", "provider", "care", "clinical", "healthcare"],
    "ai": ["ai", "llm", "agent", "prompt"],
    "developer tools": ["developer tools", "open-source", "open source", "infra"],
    "logistics": ["logistics", "supply chain", "freight"],
    "b2b saas": ["saas", "plg", "b2b"],
}

LOCATION_KEYWORDS = {
    "New York": ["nyc", "new york", "est"],
    "San Francisco": ["san francisco", "sf", "bay area"],
    "Chicago": ["chicago"],
    "Remote US": ["remote", "us", "united states"],
    "Europe-friendly": ["europe", "uk", "emea"],
}

SENIORITY_KEYWORDS = {
    "staff": ["staff"],
    "lead": ["lead", "head", "founding"],
    "senior": ["senior", "sr"],
    "mid": ["mid", "mid-level"],
}

WORK_MODEL_KEYWORDS = {
    "hybrid": ["hybrid"],
    "on-site": ["on-site", "onsite"],
    "remote": ["remote"],
}

RECRUITER_TYPE_KEYWORDS = {
    "fractional": ["fractional", "embedded"],
    "embedded": ["operator", "ats", "embedded"],
    "marketplace": ["recruiter", "search", "marketplace"],
}

PROMPT_INJECTION_PATTERNS = [
    r"ignore previous instructions",
    r"system prompt",
    r"reveal hidden prompt",
]


@dataclass
class SanitizedInput:
    cleaned_brief: str
    warnings: list[str]


def sanitize_input(brief: str) -> SanitizedInput:
    warnings: list[str] = []
    cleaned = brief.strip()

    for pattern in PROMPT_INJECTION_PATTERNS:
        if re.search(pattern, cleaned, flags=re.IGNORECASE):
            cleaned = re.sub(pattern, "", cleaned, flags=re.IGNORECASE)
            warnings.append("Removed prompt-injection style instruction from brief.")

    if len(cleaned.split()) < 6:
        warnings.append("Brief is quite short; recruiter matching may be less specific.")

    return SanitizedInput(cleaned_brief=cleaned, warnings=warnings)


def _pick_by_keywords(text: str, keyword_map: dict[str, list[str]], default: str) -> str:
    lowered = text.lower()
    for label, keywords in keyword_map.items():
        if any(keyword in lowered for keyword in keywords):
            return label
    return default


def _extract_skills(text: str) -> tuple[list[str], list[str]]:
    lowered = text.lower()
    matched = [skill for skill in KNOWN_SKILLS if skill in lowered]
    must_have = sorted(matched[:5])
    nice_to_have = [skill for skill in ["llm", "plg", "process design", "community"] if skill in lowered and skill not in must_have]
    return must_have, nice_to_have


def _extract_compensation(text: str) -> str | None:
    match = re.search(r"\$?(\d{2,3})k\s*(?:-|to)?\s*\$?(\d{2,3})k", text.lower())
    if not match:
        return None
    low, high = match.groups()
    return f"${low}k-${high}k"


def _find_scenario(scenario_id: str | None) -> str | None:
    if not scenario_id:
        return None
    for scenario in SCENARIOS:
        if scenario.id == scenario_id:
            return scenario.location
    return None


def parse_brief(brief: str, scenario_id: str | None = None) -> ParsedBrief:
    default_location = _find_scenario(scenario_id) or "Remote US"
    role_title = _pick_by_keywords(brief, ROLE_KEYWORDS, "generalist startup hire")
    seniority = _pick_by_keywords(brief, SENIORITY_KEYWORDS, "senior")
    industry = _pick_by_keywords(brief, INDUSTRY_KEYWORDS, "b2b saas")
    location = _pick_by_keywords(brief, LOCATION_KEYWORDS, default_location)
    work_model = _pick_by_keywords(brief, WORK_MODEL_KEYWORDS, "hybrid" if "preferred" in brief.lower() else "remote")
    recruiter_type = _pick_by_keywords(brief, RECRUITER_TYPE_KEYWORDS, "fractional")
    urgency = "critical" if "this month" in brief.lower() or "urgent" in brief.lower() else "high" if "soon" in brief.lower() or "need" in brief.lower() else "medium"
    must_have_skills, nice_to_have_skills = _extract_skills(brief)

    notes: list[str] = []
    lowered = brief.lower()
    if "remote" in lowered and any(city in lowered for city in ["new york", "san francisco", "chicago"]):
        notes.append("Brief mixes remote and city-specific preferences; treat location as flexible.")
    if "," in brief and brief.lower().count(" and ") > 3:
        notes.append("Brief spans multiple priorities; recruiter rationale should focus on primary role fit.")

    function = role_title
    return ParsedBrief(
        role_title=role_title.title(),
        function=function,
        seniority=seniority,
        industry=industry,
        location=location,
        work_model=work_model,
        recruiter_type=recruiter_type,
        urgency=urgency,
        must_have_skills=must_have_skills,
        nice_to_have_skills=nice_to_have_skills,
        compensation_band=_extract_compensation(brief),
        notes=notes,
    )
