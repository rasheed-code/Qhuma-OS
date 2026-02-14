# qhumaOS Dashboard — Decision Log

> Living document tracking all architectural, design, and conceptual decisions.
> Updated as the project evolves.

---

## 1. Project Overview

- **Purpose**: Investor-facing MVP demo of qhumaOS, the operating system for QHUMA (Spain's first AI-centric school)
- **Target audience**: Potential investors seeing a live demo
- **Scope**: One interactive week (Week 3 of 12) of 1o ESO, built around the project "How to Manage an Airbnb in Malaga"
- **Character**: Lucas Garcia, 1o ESO student
- **Location**: `/Users/father/Desktop/qhuma-dashboard/`
- **Reference docs**: `/Users/father/Documents/Colegio/` (QHUMA Master Document, Plataforma Educativa)

---

## 2. Tech Stack

| Layer         | Choice                | Reason                                    |
|---------------|----------------------|-------------------------------------------|
| Framework     | Next.js 16 (App Router) | Latest, fast, good DX                  |
| Styling       | Tailwind CSS v4      | `@theme inline` directive for design tokens |
| Language      | TypeScript           | Type safety for data models               |
| Icons         | lucide-react         | Clean, consistent icon set                |
| Font          | Inter (Google Fonts) | Modern, readable                          |
| State         | React `useState`     | Simple enough for demo, no global state needed |

No backend — all data is static/mock for the MVP demo.

---

## 3. Dashboard Views

Three switchable roles accessible via `RoleSelector` at the top of the main panel:

### 3.1 Student Dashboard
- **Philosophy**: "Today only" — quick glance at daily tasks
- **Hero**: Large 42px title ("Let's build your Airbnb")
- **Progress card**: Percentage through today + task count
- **Icon row**: 6 clickable icons representing today's tasks (inspired by fitness app UI)
  - Completed tasks show a green checkmark
  - Current task has accent border
  - Upcoming tasks are dimmed
  - Clicking an icon shows task detail below
- **Task detail panel**: Time, status badge, title, description, XP reward, subject, competency tags, evidence line
- **Summary section**: Daily/Weekly/Monthly toggle (decorative for now)
  - 4 stat cards: Q-Coins, XP Earned, Streak, Evidences
  - Last card (Evidences) uses dark sidebar color for visual contrast
- **Chat widget**: Integrated on the right (300px), chat with Prof. Ana
  - Gradient header pill (sidebar -> accent-dark)
  - Teacher messages: white bubbles
  - Student messages: soft blue (`#d9e8fc`) — NOT corporate dark green

**Key decision**: Competencies, trimester timeline, and kanban view were removed from the student dashboard. They live in sidebar nav pages (My Project, Competencies) or parent/teacher views. The student sees only what they need right now.

### 3.2 Parent Dashboard
- **AI Weekly Summary**: Natural language paragraph explaining Lucas's progress
- **Quick stats**: Tasks done, remaining, evidences, streak
- **Notifications**: Success/warning/urgent alerts about Lucas
- **Upcoming deliverables**: List of what's due and when
- **Trimester timeline**: All 4 trimester projects with progress bars
- **Competency progress**: 8 LOMLOE competencies with bars and delta indicators
- **Chat widget**: Same TeacherChat component, role="parent"

### 3.3 Teacher Dashboard
- **Hero**: "Good morning, Ana" with class stats (student count, avg progress)
- **Class status**: 4 colored cards (Excelling, On Track, Needs Attention, Total Evidences)
- **Intervention alerts**: Urgent/warning/success alerts per student with action buttons
- **Student grid**: 12 students in 3-column grid with status dots, progress bars, current task
- **Quick actions**: Generate LOMLOE Report, Competency Analytics, Assign Activity
- **Competency progress**: Class-wide view
- **Chat widget**: TeacherChat with role="teacher"

---

## 4. Layout Architecture

- **Floating sidebar**: Fixed, `left-4 top-4 bottom-4`, `w-[220px]`, `rounded-3xl`, dark green (`bg-sidebar`)
- **Main panel**: One big white card (`bg-card rounded-3xl shadow-sm`) with `ml-[228px]` offset
- **Inner padding**: `p-8` for main content area
- **Right panels**: 300px fixed-width chat/sidebar widgets

This creates the "app within a window" feel from the fitness app reference design.

---

## 5. Color System (QHUMA Brand)

Extracted from QHUMA's website style board. Dual-token system to handle lime green readability.

### Raw Brand Colors
```
--primary:        rgb(47, 87, 77)    #2f574d  dark teal
--secondary:      rgb(17, 17, 17)    #111111  near black
--light-green:    rgb(195, 244, 153) #c3f499  lime accent
--green:          rgb(55, 100, 89)   #376459  medium green
--green-dark:     rgb(31, 81, 76)    #1f514c  deep green
--green-light-bg: rgb(237, 255, 227) #edffe3  soft green bg
--black:          rgb(20, 20, 20)    #141414
--body-color:     rgb(102, 102, 102) #666666
--stroke:         rgb(237, 237, 237) #ededed
--stroke-warm:    rgb(212, 204, 190) #d4ccbe
--light-bg:       rgb(244, 240, 233) #f4f0e9  warm cream
```

### Semantic Tokens
```
--accent:       lime green (#c3f499) — for backgrounds, fills, buttons
--accent-text:  dark teal (#2f574d)  — for text on light backgrounds
--accent-light: soft green (#edffe3) — for subtle highlight backgrounds
--accent-dark:  medium green (#376459) — for gradients, hover states
--sidebar:      deep green (#1f514c)  — sidebar background
```

**Critical decision**: `--accent` (lime green) is NEVER used as text color on white backgrounds — it's unreadable. Always use `--accent-text` (dark teal) for text. The `--accent` token is only for fills/backgrounds.

### Status Colors
```
--success: #22c55e (green)
--warning: #f59e0b (amber)
--urgent:  #ef4444 (red)
```

### Tailwind v4 Integration
All CSS variables are mapped via `@theme inline {}` block in `globals.css`, making them available as Tailwind utilities (e.g., `bg-sidebar`, `text-accent-text`, `border-card-border`).

---

## 6. Data Architecture

### Week Schedule
- **5 days** (Mon-Fri), **6 tasks per day** = 30 total tasks
- **Mon-Tue** (Phase 1): All `completed` — research, planning, design tasks
- **Wednesday** (Phase 2): `current` day — 2 completed, 1 in_progress, 3 upcoming
- **Thu-Fri**: All `locked` — brand/presentation + Demo Day

### Task Model
Each task has:
- `id`, `time` (time block), `title`, `description`
- `subject` (cross-curricular subject mapping)
- `competencies` (array of LOMLOE CompetencyKeys)
- `status`: completed | in_progress | upcoming | locked
- `evidence` (deliverable description — every task produces a traceable document)
- `xpReward` (gamification points)

### LOMLOE Competencies (8)
Spain's national education framework. Every task maps to 1-3 competencies:
- CLC (Linguistic), CPL (Plurilingual), STEM, CD (Digital)
- CPSAA (Personal/Social), CC (Citizenship), CE (Entrepreneurial), CCEC (Cultural)

### Trimester Projects (4)
1. Launch Your Airbnb (Weeks 1-3) — ACTIVE, 65% progress
2. Design a Food Truck Brand (Weeks 4-6)
3. Run a Pop-Up Store (Weeks 7-9)
4. Pitch to QHUMA Capital (Weeks 10-12) — culminating experience

### Student Data
- `currentStudent`: Lucas Garcia — 340 Q-Coins, 680/2840 XP, 12-day streak, 9/16 evidences
- `classStudents`: 12 students with varied statuses (3 excelling, 7 on track, 2 needs attention)
- `teacherAlerts`: 4 alerts (2 urgent, 1 warning, 1 success)
- `chatMessages`: 5-message conversation between Lucas and Prof. Ana about his landing page

---

## 7. Gamification Concepts (Octalysis Framework)

Based on Yu-kai Chou's Octalysis Gamification Framework, we mapped all 8 Core Drives to qhumaOS. Both "White Hat" (positive motivation) and "Black Hat" (urgency-based motivation) drives are included — in education, even Black Hat drives serve learning purposes.

### Core Drive 1: Epic Meaning & Calling
- **"Tu mision hoy"** framing — tasks feel like missions, not homework
- **Impact Score**: "Tu Airbnb generaria X euros" — connecting academic work to real-world outcomes
- **Implementation idea**: Connect with real pricing APIs for authentic data

### Core Drive 2: Development & Accomplishment
- **Skill tree animations** on level-up
- **Role-based titles**: "Contable Junior" -> "CFO del Airbnb" — progression tied to project context
- **XP system** already in the dashboard (per-task rewards)

### Core Drive 3: Empowerment of Creativity & Feedback
- **Tool choice**: Students pick their tools (Canva, Notion, raw HTML) for deliverables
- **30-minute mentor feedback loops** — rapid iteration, not just "submit and wait"
- Creativity without feedback = frustration. The loop is the key.

### Core Drive 4: Ownership & Possession
- **"El Airbnb de Raul"** — personalized branding, the project is YOURS
- **Q-Coins** as virtual currency (340 in current demo)
- **Portfolio permanence**: "Quieres que este documento quede en tu portafolio oficial?" — students choose what represents them

### Core Drive 5: Social Influence & Relatedness
- **Tribes**: Team-based collaboration within projects
- **"Experto Aprendiz"** badge: Students who master a skill become resources for others
- **Demo Day**: Peer presentations with class voting ("Best Pitch", "Most Creative", "Best Numbers")

### Core Drive 6: Scarcity & Impatience
- **Locked labs/resources** requiring minimum skill levels to access
- **Limited mentor time slots** — creates urgency to book 1:1 sessions
- Thursday/Friday tasks are `locked` until prerequisites are met

### Core Drive 7: Unpredictability & Curiosity
- **Emergency missions**: "+20 XP in 15 minutes" — surprise challenges
- **Random bonus chests** for unexpected rewards
- **Recommendation**: Maximum 2 emergency missions per week to maintain novelty

### Core Drive 8: Loss & Avoidance
- **"Paused" not "failed"** — project status language is never punitive
- **Streak consistency** framing: "12-day streak!" motivates maintenance
- **Countdown timers** for deliverables create healthy urgency

### Design principle
All 8 drives must be present but balanced. Over-indexing on Black Hat drives (6, 7, 8) creates anxiety in students. Over-indexing on White Hat (1, 2, 3) creates engagement without urgency. The mix should feel natural within the daily rhythm, not bolted on.

---

## 8. UX Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Student chat bubbles | Soft blue `#d9e8fc` | Dark green was "too corporate" per user feedback |
| Student view scope | Today only | Keep it simple — competencies/timeline live elsewhere |
| Icon row navigation | 6 icons for 6 daily tasks | Inspired by fitness app reference |
| Summary section toggle | Daily/Weekly/Monthly | Decorative in MVP, functional in v2 |
| Dark stat card | Evidences card uses `bg-sidebar` | Visual contrast, highlights most important metric |
| Role selector | Top of main panel, not sidebar | Easy switching for demo, visible to investors |
| Chat position | Right side, 300px, integrated | Always accessible, part of the daily flow |
| Sidebar promo card | Context-aware per role | Different CTA per user type |
| Main panel | Single white card | Modern "app" feel vs. scattered card layout |

---

## 9. Component Inventory

```
src/
  app/
    globals.css          — Color system + Tailwind v4 theme
    layout.tsx           — Root layout (Inter font, metadata)
    page.tsx             — Main page with role state + layout
  components/
    Sidebar.tsx          — Floating nav sidebar (role-aware)
    RoleSelector.tsx     — Role switcher pills
    StudentDashboard.tsx — Student "today" view (hero + icons + detail + summary + chat)
    ParentDashboard.tsx  — Parent weekly overview
    TeacherDashboard.tsx — Teacher class management
    TeacherChat.tsx      — Reusable chat widget (parent/teacher views)
    CompetencyProgress.tsx — LOMLOE competency bars
    TrimesterTimeline.tsx  — Trimester project list with progress
    TaskCard.tsx         — Reusable task card (legacy, unused in current student view)
    QCoins.tsx           — Q-Coins detail component
    DailyView.tsx        — Daily task list (legacy, available for other views)
    KanbanView.tsx       — Kanban board (legacy, available for other views)
  data/
    tasks.ts             — 30 tasks across 5 days + 4 trimester projects
    competencies.ts      — 8 LOMLOE competencies with progress
    students.ts          — Student profiles, class roster, alerts, chat messages
  types/
    index.ts             — All TypeScript interfaces
```

---

## 10. Gamification Implementation (Octalysis in UI)

Session 3 implementation — all 8 Core Drives mapped to actual UI elements in the Student Dashboard:

| Core Drive | UI Element | Details |
|------------|-----------|---------|
| CD1: Epic Meaning | Hero reframing | "Today's Mission" title + "Lucas's Airbnb" + projected revenue (€847/month) |
| CD2: Accomplishment | Level progression bar | Thin gradient bar (sidebar→accent-dark), `Lvl 4 Digital Architect`, Next: Airbnb CFO — 340/1000 XP |
| CD3: Creativity | Tool choice selector | 4 buttons (Canva, Notion, Sheets, HTML/CSS) in task detail for `in_progress` tasks only |
| CD4: Ownership | Q-Coins subtitle | "Your currency, your choices" + personalized "Lucas's Airbnb" |
| CD5: Social Influence | Tribe section | 4-column grid: Lucas (highlighted), Sofía (Expert Learner badge), Hugo, Alba. Team name pill "The Hosts" |
| CD6: Scarcity | Lock indicators | Lock icon overlay on upcoming task icons + "Unlocks after current task" in task detail |
| CD7: Unpredictability | Flash Mission card | Dark gradient card with Swords icon, 15-min timer, +35 XP, Accept Mission button → active state with pulsing dot |
| CD8: Loss Avoidance | Streak enhancement | "Keep it alive!" warning-color text under streak count |

### New files
- `src/data/gamification.ts` — Mock data: playerLevel, flashMission, currentTribe, toolOptions, projectImpact

### New types
- `PlayerLevel`, `EmergencyMission`, `TribeMember`, `Tribe`, `ToolOption`, `ProjectImpact`

### New state variables
- `missionAccepted: boolean` — Flash Mission accept toggle
- `selectedTool: string | null` — Tool choice in task detail

### New icons (lucide-react)
Trophy, Star, Users, Swords, Timer, Lock, Palette, Table, Code, Sparkles, TrendingUp

### Dashboard layout order (top to bottom)
1. Hero (mission framing + level badge + impact score)
2. Level progression bar (thin gradient XP bar)
3. Progress card (% through today)
4. Flash Mission card (dark gradient, accept interaction)
5. Task icon row (+ tiny lock icons on upcoming)
6. Task detail panel (+ tool selector + scarcity msg)
7. Summary header + toggle
8. Summary stat grid (enhanced Q-Coins + Streak text)
9. Tribe section (4-column member grid)

Chat widget (right side, 300px) unchanged.

### Tribe collaboration model (hybrid)
- **Wed–Thu**: Team phase — students work together, Tribe section visible, shared deliverables
- **Friday**: Individual phase — each student presents THEIR contribution + personal reflection
- **Demo Day**: Group pitch, but each member answers questions about THEIR part
- This means the Tribe section should only appear on team-phase days (Mon–Thu), not on Friday

---

## 11. What's NOT Built Yet

- [x] ~~Gamification elements in the UI (skill tree, emergency missions, titles)~~ — Implemented Session 3
- [ ] Parent/Teacher dashboards not yet updated to match the modern one-card layout
- [ ] Sidebar navigation is decorative (no routing)
- [ ] Summary section Daily/Weekly/Monthly toggle is non-functional
- [ ] Chat input is non-functional (demo only)
- [ ] No backend, auth, or real data
- [ ] Mobile responsiveness not addressed
- [ ] Dark mode not planned for MVP

---

## 12. Changelog

| Date | Change |
|------|--------|
| Session 1 | Initial project scaffold — Next.js 16, Tailwind v4, TypeScript |
| Session 1 | Built all 3 dashboard views (student, parent, teacher) |
| Session 1 | User feedback: simplified student view to "today only" |
| Session 1 | Applied QHUMA brand colors from website style board |
| Session 1 | Redesigned student dashboard to match fitness app reference |
| Session 1 | Changed student chat bubbles to soft blue per user feedback |
| Session 1 | Octalysis gamification framework brainstorm |
| Session 1 | User shared detailed Raul concept (all 8 drives applied to school day) |
| Session 2 | Created this DECISIONS.md document |
| Session 3 | Implemented Octalysis gamification (all 8 Core Drives) in Student Dashboard |
| Session 3 | Added gamification types, mock data, level bar, flash mission, tool selector, tribe section, scarcity locks, streak/qcoins enhancements |
