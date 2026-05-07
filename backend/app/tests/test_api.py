from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_healthcheck() -> None:
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_scenarios_endpoint_returns_seed_data() -> None:
    response = client.get("/api/v1/scenarios")

    assert response.status_code == 200
    payload = response.json()
    assert len(payload) == 5
    assert payload[0]["company"] == "LedgerLoop"


def test_match_endpoint_returns_recruiter_matches() -> None:
    response = client.post(
        "/api/v1/match",
        json={
            "brief": "Hiring senior backend engineer in fintech who knows LangGraph and distributed systems. NYC hybrid preferred.",
            "scenario_id": "fintech-backend",
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["parsed_brief"]["industry"] == "fintech"
    assert payload["matches"][0]["profile"]["name"] == "Maya Chen"
    assert payload["pipeline"]["bottleneck"] in {"Hiring Manager", "Screen"}
