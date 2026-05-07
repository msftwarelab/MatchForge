# MatchForge AI

A full-stack Dover-style recruiting marketplace demo built for a fast, polished product engineering walkthrough.

## Summary
MatchForge AI turns a natural-language hiring brief into:
- structured job requirements
- a marketplace-style recruiter ranking
- personalized recruiter outreach
- a lightweight ATS pipeline view
- five realistic startup hiring scenarios

The implementation is deterministic by default so the demo is safe to run locally without third-party model credentials, while still using LangGraph as the orchestration layer.

## Assumptions
- The demo optimizes for reliability and product storytelling over external LLM dependence.
- Mock recruiter and ATS data are acceptable for an application-quality demo.
- Vite is the fastest frontend path for a 1–3 day build.
- FastAPI is preferred over Django for speed, typed APIs, and lightweight service boundaries.

## Product Spec
See `docs/product-spec.md`.

## Technical Spec
See `docs/technical-spec.md`.

## Implementation Plan
1. Define recruiter marketplace flows, scenarios, and scoring model.
2. Build FastAPI endpoints and LangGraph orchestration over deterministic tools.
3. Build premium React + Tailwind dashboard around brief input and recruiter cards.
4. Add ATS pipeline visualization and outreach generation panels.
5. Add focused backend and frontend tests.
6. Package for local run, deployment, and Loom demo recording.

## File Map
- `frontend/`: React 18 + TypeScript + Tailwind UI
- `backend/`: FastAPI + LangGraph orchestration and mock data
- `docs/`: product and technical specifications

## Local Run
### Backend
```bash
cd /Users/cloud/Documents/05_Coding/startups/Dover/backend
python -m pip install -e '.[dev]'
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd /Users/cloud/Documents/05_Coding/startups/Dover/frontend
npm install
npm run dev
```

The frontend expects the backend at `http://localhost:8000/api/v1` by default.

## Tests
### Backend
```bash
cd /Users/cloud/Documents/05_Coding/startups/Dover/backend
pytest
```

### Frontend
```bash
cd /Users/cloud/Documents/05_Coding/startups/Dover/frontend
npm test
```

## Deployment Notes
- Frontend: deploy to Vercel or Netlify with `VITE_API_BASE_URL` pointed at the backend.
- Backend: deploy to Render, Railway, or Fly.io with `MATCHFORGE_FRONTEND_ORIGIN` set to the frontend URL.
- Add request logging and uptime checks via `GET /api/v1/health`.

## Security Notes
- Brief input is treated as untrusted text.
- Prompt-injection patterns are stripped from the deterministic pipeline.
- No PII persistence or external outbound model calls in default mode.

## Loom Demo Tips
1. Start with the fintech scenario to show strongest recruiter matching signal.
2. Switch to the ops scenario to highlight ATS cleanup and embedded operator value.
3. Open recruiter outreach tabs to demonstrate personalized activation.
4. End on the pipeline board and describe how Dover can turn recruiter selection into execution velocity.

## Suggested README Narrative For Dover
- Emphasize recruiter marketplace matching transparency.
- Show product taste through speed, visual hierarchy, and ATS-aware UX.
- Mention the deterministic LangGraph path as a demo-safety choice, not a product limitation.
