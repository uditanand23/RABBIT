# RABBIT — NEET Self-Study Companion (V1 MVP)

> A distraction-free, honest, and trustworthy NEET preparation companion built with React, TypeScript, and a premium clean clinical design system.

---

## 🐇 Product Vision & Engines (Master Prompt 2)

Rabbit addresses the real, daily questions of every serious NEET aspirant:
- **What should I study?** — Structured NMC/NCERT syllabus across Class 11 and 12 with topic-level checklists.
- **When should I study?** — Spaced repetition revision dates, daily study timetable blocks, and targeted priority schedules.
- **What have I completed?** — Topic completion tracking with true weighted chapter mastery.
- **What is pending?** — High-priority backlog chapters clearly flagged without fake metrics.
- **What am I weak at?** — Real-time weak area detection based on actual MCQ accuracy (< 60%) and initial self-assessment.
- **What should I revise?** — Automatic spaced revision cycle (Day 1, 3, 7, 14, 30) powered by the Mistake Notebook.
- **How many MCQs have I solved?** — Daily 100 MCQ Mission with 0/100 to 100/100 honest indicator.
- **How accurate am I?** — Lifetime, daily, and subject-level accuracy computed from authentic logs.
- **What mistakes am I repeating?** — Mistake notebook with classifications: Concept, Formula, Calculation, Silly, Memory, Guess, Time pressure.
- **How close am I to my target?** — Live NEET countdown, target score comparisons, and authentic mock test logs.
- **Test Series Engine** — Timed simulations in strict sizes: 50, 100, 150, and 200 questions under NTA NEET marking rules (+4 / -1 / 0).
- **20+ Year PYQ Architecture (2005–2024)** — Transparent, zero-fake data schema awaiting official past paper datasets with topic-level intelligence heatmap.
- **WHAT SHOULD I DO NOW?** — Deterministic real-time action engine suggesting concrete study steps and Quick Study Modes (15m, 30m, Low Energy, Sprints).

---

## 🔒 Non-Negotiable Trust & Privacy Guarantee

- **Zero Fake Data**: The dashboard starts clean with honest 0 counts. No fake activity or simulated mock scores.
- **Privacy First**: All data is saved strictly in your local device browser (`localStorage`). No unnecessary device permissions, no external tracking, and zero ad networks.
- **Complete Data Portability**: Full JSON export and import capabilities to backup and restore your preparation history at any time.

---

## 🛠️ Technology Stack

- **Core**: React 19 + TypeScript
- **Bundler & Server**: Vite 8
- **Icons**: Lucide React
- **Celebration**: Canvas Confetti
- **Design System**: Vanilla CSS with custom tokens, light/dark mode support, responsive sidebar, and mobile-friendly bottom navigation.

---

## 📁 Architecture & File Structure

```
d:/WEBSITE/RABBIT/
├── src/
│   ├── types/
│   │   └── index.ts                 # Core TypeScript models (Profile, Chapter, Plan, Log, Doubt, MCQ)
│   ├── data/
│   │   └── syllabus.ts              # NMC verified NEET syllabus (78 chapters, 300+ conceptual topics)
│   ├── services/
│   │   └── storage.ts               # LocalStorage persistence, streak calculator, backup/restore
│   ├── context/
│   │   └── AppContext.tsx           # Reactive global state management and dispatchers
│   ├── components/
│   │   ├── Navigation.tsx           # Responsive desktop sidebar & mobile bottom bar
│   │   ├── OnboardingModal.tsx      # First-use onboarding & strength evaluation modal
│   │   ├── StudyTimer.tsx           # Focused timer with pause, resume, and note-taking
│   │   └── DailyMcqMission.tsx      # Daily 100 MCQ target, accuracy indicator, and session logger
│   ├── pages/
│   │   ├── HomeDashboard.tsx        # Countdown, study time, streak, today's schedule, revisions due
│   │   ├── StudyPlannerPage.tsx     # Chapter/topic checklist, timetable blocks, study logs, doubts
│   │   ├── McqCenterPage.tsx        # Question analytics, PYQ filtering, and session history
│   │   ├── MasterProgressMapPage.tsx# Holistic preparation map, subject breakdown, mock test log
│   │   └── ProfileSettingsPage.tsx  # Aspirant details, preferences, privacy guarantee, JSON backup
│   ├── App.tsx                      # Root route controller & onboarding check
│   ├── main.tsx                     # Entry point with AppProvider
│   └── index.css                    # Clean, classic, premium CSS design tokens & utilities
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

The app will be accessible at `http://localhost:5173/`.
