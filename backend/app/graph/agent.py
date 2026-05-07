from __future__ import annotations

from typing import Any, TypedDict

from langgraph.graph import END, StateGraph

from app.core.mock_data import RECRUITERS
from app.models import MatchResponse, ParsedBrief, RecruiterProfile, Scenario
from app.services.generator import build_pipeline, generate_job_description, generate_outreach, get_scenario
from app.services.parser import parse_brief, sanitize_input
from app.services.scoring import build_match_objects, retrieve_candidates, score_recruiters


class MatchState(TypedDict, total=False):
    brief: str
    scenario_id: str | None
    warnings: list[str]
    sanitized_brief: str
    parsed_brief: ParsedBrief
    scenario: Scenario | None
    job_description: Any
    candidates: list[RecruiterProfile]
    scored_candidates: list[Any]
    outreach_by_recruiter: dict[str, tuple[str, str, str]]
    pipeline: Any
    response: MatchResponse


class MatchForgeAgent:
    def __init__(self) -> None:
        graph = StateGraph(MatchState)
        graph.add_node("sanitize_input", self.sanitize_input)
        graph.add_node("parse_brief", self.parse_brief)
        graph.add_node("generate_job_description", self.generate_job_description)
        graph.add_node("retrieve_recruiters", self.retrieve_recruiters)
        graph.add_node("score_recruiters", self.score_recruiters)
        graph.add_node("generate_outreach", self.generate_outreach)
        graph.add_node("build_pipeline", self.build_pipeline)
        graph.add_node("finalize", self.finalize)

        graph.set_entry_point("sanitize_input")
        graph.add_edge("sanitize_input", "parse_brief")
        graph.add_edge("parse_brief", "generate_job_description")
        graph.add_edge("generate_job_description", "retrieve_recruiters")
        graph.add_edge("retrieve_recruiters", "score_recruiters")
        graph.add_edge("score_recruiters", "generate_outreach")
        graph.add_edge("generate_outreach", "build_pipeline")
        graph.add_edge("build_pipeline", "finalize")
        graph.add_edge("finalize", END)

        self.graph = graph.compile()

    def sanitize_input(self, state: MatchState) -> MatchState:
        sanitized = sanitize_input(state["brief"])
        return {
            "sanitized_brief": sanitized.cleaned_brief,
            "warnings": sanitized.warnings,
            "scenario": get_scenario(state.get("scenario_id")),
        }

    def parse_brief(self, state: MatchState) -> MatchState:
        parsed = parse_brief(state["sanitized_brief"], state.get("scenario_id"))
        warnings = list(state.get("warnings", []))
        warnings.extend(parsed.notes)
        return {"parsed_brief": parsed, "warnings": warnings}

    def generate_job_description(self, state: MatchState) -> MatchState:
        return {
            "job_description": generate_job_description(state["parsed_brief"], state.get("scenario")),
        }

    def retrieve_recruiters(self, state: MatchState) -> MatchState:
        return {"candidates": retrieve_candidates(state["parsed_brief"], RECRUITERS)}

    def score_recruiters(self, state: MatchState) -> MatchState:
        scored = score_recruiters(state["parsed_brief"], state["candidates"])
        return {"scored_candidates": scored}

    def generate_outreach(self, state: MatchState) -> MatchState:
        outreach_by_recruiter: dict[str, tuple[str, str, str]] = {}
        for recruiter, *_ in state["scored_candidates"]:
            outreach_by_recruiter[recruiter.id] = generate_outreach(state["parsed_brief"], recruiter, state.get("scenario"))
        return {"outreach_by_recruiter": outreach_by_recruiter}

    def build_pipeline(self, state: MatchState) -> MatchState:
        return {"pipeline": build_pipeline(state["parsed_brief"], state.get("scenario"))}

    def finalize(self, state: MatchState) -> MatchState:
        matches = build_match_objects(state["scored_candidates"], state["outreach_by_recruiter"])
        response = MatchResponse(
            brief=state["sanitized_brief"],
            scenario=state.get("scenario"),
            parsed_brief=state["parsed_brief"],
            job_description=state["job_description"],
            matches=matches,
            pipeline=state["pipeline"],
            warnings=state.get("warnings", []),
            summary_metrics={
                "top_score": f"{matches[0].score}%" if matches else "0%",
                "recruiters_reviewed": str(len(state["candidates"])),
                "pipeline_bottleneck": state["pipeline"].bottleneck,
                "recommended_motion": "Fractional marketplace" if state["parsed_brief"].recruiter_type == "fractional" else "Embedded operator",
            },
        )
        return {"response": response}

    def run(self, brief: str, scenario_id: str | None = None) -> MatchResponse:
        final_state = self.graph.invoke({"brief": brief, "scenario_id": scenario_id})
        return final_state["response"]


agent = MatchForgeAgent()
