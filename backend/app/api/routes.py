from fastapi import APIRouter

from app.core.config import get_settings
from app.core.mock_data import SCENARIOS
from app.graph.agent import agent
from app.models import MatchRequest, MatchResponse, Scenario

router = APIRouter()


@router.get("/health")
def health() -> dict[str, str]:
    settings = get_settings()
    return {"status": "ok", "service": settings.app_name}


@router.get("/scenarios", response_model=list[Scenario])
def list_scenarios() -> list[Scenario]:
    return SCENARIOS


@router.post("/match", response_model=MatchResponse)
def match_recruiters(payload: MatchRequest) -> MatchResponse:
    return agent.run(payload.brief, payload.scenario_id)
