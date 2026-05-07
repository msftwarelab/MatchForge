# MatchForge AI — Product Specification

## Problem Statement
Dover helps startups hire through a recruiter marketplace plus ATS workflows. This demo should show how a hiring manager can describe a role in natural language and instantly receive recruiter matches, a polished job description, personalized outreach, and a simple pipeline view that feels native to Dover’s product.

## Target User
- Startup founder or hiring manager with limited internal recruiting bandwidth
- Dover sales or product teammate demoing recruiter marketplace value
- Candidate for Dover showing product-minded engineering, UX taste, and execution speed

## Product Goals
1. Turn an unstructured hiring brief into structured recruiting intent in under 10 seconds.
2. Recommend the most relevant recruiters with clear justification and marketplace-style scoring.
3. Generate personalized outreach artifacts that show recruiter enablement and ATS workflow value.
4. Demonstrate Dover’s recruiter marketplace + ATS positioning in a single premium dashboard.
5. Stay reliable offline using mock data so the demo is safe for a job application and live walkthrough.

## Core Features
1. Natural language job brief composer
2. Five realistic startup hiring scenarios
3. AI-generated job description summary and requirements
4. Recruiter marketplace results with match scores, specialties, availability, fee model, and rationale
5. Personalized outreach generation for email and SMS per recruiter
6. Mock ATS pipeline overview with stage counts and highlighted bottlenecks
7. Brief parsing insights: seniority, industry, location, must-have skills, urgency, compensation band
8. Fast iterative exploration with scenario prefill and one-click rerun

## User Stories
- As a founder, I can describe a role in plain English and receive structured recruiting guidance.
- As a hiring manager, I can compare recruiter options by domain expertise, fill rate, and availability.
- As a recruiter marketplace operator, I can show why a recruiter matched and what outcome they drive.
- As a Dover teammate, I can demo end-to-end value without external integrations.
- As a product reviewer, I can inspect recruiter rationales, generated outreach, and ATS implications quickly.

## Primary User Flow
1. User lands on dashboard and sees premium hero metrics, scenarios, and brief composer.
2. User selects a scenario or writes a custom hiring brief.
3. User submits the brief.
4. Backend agent parses the brief, drafts a job description, retrieves recruiter matches, scores them, and generates outreach.
5. Frontend displays recruiter cards, justification, outreach tabs, and pipeline state.
6. User tweaks the brief and reruns to compare outputs.

## Secondary Flows
- Scenario exploration: switch among five scenarios and re-run instantly.
- Recruiter inspection: expand a recruiter card to view rationale and outreach content.
- ATS review: inspect which funnel stage is likely blocked and suggested next action.

## Functional Requirements
- Accept freeform hiring brief text.
- Support scenario prefill with editable text.
- Parse briefs into structured fields: role, level, industry, location, work model, must-have skills, nice-to-have skills, urgency, comp band, recruiter type.
- Generate a realistic job description containing summary, responsibilities, qualifications, interview process, and selling points.
- Match against mock recruiter profiles with deterministic scoring and transparent reasoning.
- Return at least three ranked recruiter matches.
- Generate personalized email and SMS outreach for each matched recruiter.
- Render marketplace cards with score, specialty tags, fee, placement stats, and rationale.
- Render a mock ATS pipeline snapshot tied to the role.
- Show loading and error states.

## Non-Functional Requirements
- Demo-first reliability: no required external LLM or third-party API.
- Fast perceived latency: local response target under 2 seconds on mock data.
- Clean, modern UI with responsive layouts from laptop to tablet.
- Accessible contrast, semantic HTML, and keyboard-usable controls.
- Modular code structure suitable for a 1–3 day product demo.
- Safe defaults for prompt injection and untrusted input display.

## Edge Cases
- Empty or extremely short brief
- Brief with conflicting signals, such as remote + on-site in different cities
- Unknown skill keywords not present in mock recruiter specialties
- Overly broad brief with multiple roles mentioned
- Unusually high urgency requiring recruiter availability penalty/boost
- Very niche requirements where only one recruiter is a close fit
- Briefs containing prompt-injection style instructions

## Success Criteria
- A user can submit a brief and get polished output without setup beyond local install.
- Output clearly reflects Dover use cases: recruiter marketplace selection, personalized outreach, ATS visibility.
- UI feels premium enough for a Loom demo or job application submission.
- Codebase is modular, tested, and understandable for a small engineering team review.
