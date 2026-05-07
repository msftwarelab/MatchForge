# MatchForge AI — Technical Specification

## Architecture Overview
- Frontend: Vite + React 18 + TypeScript + Tailwind CSS
- Backend: FastAPI + Pydantic + LangGraph
- Data: in-repo mock recruiter profiles and startup scenarios
- Communication: JSON APIs over HTTP between frontend and backend
- Deployment target: split deploy friendly (Vercel/Netlify for frontend, Render/Fly/Railway for backend)

## High-Level System Design
1. React dashboard renders scenarios, brief composer, results, and pipeline panels.
2. Frontend posts `/api/v1/match` requests containing the user brief and optional scenario id.
3. FastAPI validates the payload with Pydantic.
4. LangGraph orchestration runs a deterministic ReAct-style flow:
   - parse brief
   - generate job description
   - retrieve recruiter candidates
   - score recruiters
   - generate outreach
   - assemble final marketplace payload
5. Frontend renders the response into premium cards and charts.

## Frontend Component Structure
- `App.tsx`: page composition
- `components/TopBar.tsx`: product branding and demo status
- `components/HeroMetrics.tsx`: top summary cards
- `components/ScenarioPanel.tsx`: five startup hiring scenarios
- `components/BriefComposer.tsx`: text area, submit button, helper chips
- `components/InsightsPanel.tsx`: parsed brief output and JD summary
- `components/RecruiterGrid.tsx`: ranked marketplace cards
- `components/RecruiterCard.tsx`: recruiter detail card with outreach tabs
- `components/PipelineBoard.tsx`: mock ATS funnel
- `components/StatusBanner.tsx`: loading/error/success feedback

## Frontend State Management
- `@tanstack/react-query` for async request lifecycle and caching
- local React state for selected scenario, editable brief, active recruiter tab state
- derived view state for hero metrics and pipeline summaries

## Backend Modules
- `app/main.py`: FastAPI app factory and middleware
- `app/api/routes.py`: HTTP routes
- `app/core/config.py`: settings
- `app/core/mock_data.py`: recruiter profiles, scenarios, and mapping data
- `app/models.py`: Pydantic schemas
- `app/services/parser.py`: brief parsing heuristics
- `app/services/scoring.py`: recruiter matching and score explanation
- `app/services/generator.py`: job description and outreach generation
- `app/graph/agent.py`: LangGraph orchestration

## LangGraph Nodes and Tools
### State
- Input brief, scenario id, parsed brief, job description, candidate recruiters, ranked matches, pipeline snapshot, warnings

### Nodes
1. `sanitize_input`: trims input, strips suspicious prompt-injection markers, records warnings
2. `parse_brief`: extracts structured role criteria and ATS hints
3. `generate_job_description`: builds a concise JD from parsed data
4. `retrieve_recruiters`: filters mock recruiter set by sector, level, and geography
5. `score_recruiters`: applies weighted scoring and attaches rationale
6. `generate_outreach`: creates email and SMS messages per recruiter
7. `build_pipeline`: selects a mock pipeline snapshot and next action suggestion
8. `finalize`: assembles the response DTO

### Tools
- `parse_brief_tool`
- `match_recruiters_tool`
- `generate_outreach_tool`
- `build_pipeline_tool`

## Data Models
### Core Request/Response
- `MatchRequest`
- `MatchResponse`
- `ParsedBrief`
- `JobDescription`
- `RecruiterProfile`
- `RecruiterMatch`
- `OutreachMessage`
- `PipelineStage`
- `Scenario`

## API Design
- `GET /health`: service status
- `GET /api/v1/scenarios`: list built-in scenarios
- `POST /api/v1/match`: run the LangGraph recruiter matching workflow

### `POST /api/v1/match` request
```json
{
  "brief": "Hiring senior backend engineer in fintech who knows LangGraph",
  "scenario_id": "fintech-backend"
}
```

### `POST /api/v1/match` response
Returns structured parsed brief data, generated JD, ranked recruiter matches, outreach content, pipeline snapshot, and summary metrics.

## Scoring Strategy
Weighted match score out of 100:
- domain expertise: 25
- role function fit: 20
- seniority fit: 15
- skill overlap: 20
- location/work model fit: 10
- availability/urgency fit: 10

## Security Considerations
- Treat brief input as untrusted text and render escaped output only.
- Strip obviously malicious prompt-injection phrases from the deterministic agent path.
- No secrets required for default demo mode.
- CORS limited to configured frontend origin in production.
- No PII persistence; all data remains in memory.

## DevOps Considerations
- Root README includes local run instructions.
- Frontend and backend each have focused test commands.
- Backend health route supports simple uptime checks.
- Logging is structured enough for request tracing in local/demo environments.
- Recommended deployment split keeps services independent and easy to replace.
