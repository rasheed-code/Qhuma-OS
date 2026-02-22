# qhumaOS Design System

> Single source of truth for colors, typography, spacing, and component patterns.
> Before touching any dashboard file, verify your work against this document.

---

## 1. Color Tokens

### Raw brand palette
| Variable | Hex | Use |
|----------|-----|-----|
| `--primary` | `#2f574d` | Dark teal — text on light backgrounds |
| `--light-green` | `#c3f499` | Lime — fills, buttons, highlights |
| `--green` | `#376459` | Medium green — gradients, hover states |
| `--green-dark` | `#1f514c` | Deep green — sidebar background |
| `--green-light-bg` | `#edffe3` | Soft green — subtle tinted backgrounds |
| `--light-bg` | `#f4f0e9` | Warm cream — page background |
| `--black` | `#141414` | Near black — headings |
| `--body-color` | `#666666` | Mid grey — body text |
| `--stroke` | `#ededed` | Light grey — borders, dividers |
| `--stroke-warm` | `#d4ccbe` | Warm grey — scrollbars, warm dividers |

### Semantic tokens (use these, not raw)
| Token | Maps to | Tailwind class |
|-------|---------|----------------|
| `--accent` | lime `#c3f499` | `bg-accent`, `border-accent` |
| `--accent-text` | dark teal `#2f574d` | `text-accent-text` |
| `--accent-light` | soft green `#edffe3` | `bg-accent-light` |
| `--accent-dark` | medium green `#376459` | `bg-accent-dark` |
| `--sidebar` | deep green `#1f514c` | `bg-sidebar`, `text-sidebar` |
| `--card` | `#ffffff` | `bg-card` |
| `--card-border` | `#ededed` | `border-card-border` |
| `--background` | warm cream `#f4f0e9` | `bg-background` |
| `--text-primary` | near black `#141414` | `text-text-primary` |
| `--text-secondary` | mid grey `#666666` | `text-text-secondary` |
| `--text-muted` | `#9ca3af` | `text-text-muted` |
| `--border` | `#ededed` | `border-border` |

### Status tokens
| Token | Hex | Light bg token | Use |
|-------|-----|----------------|-----|
| `--success` | `#22c55e` | `--success-light` `#f0fdf4` | Completed, on track |
| `--warning` | `#f59e0b` | `--warning-light` `#fffbeb` | Needs attention |
| `--urgent` | `#ef4444` | `--urgent-light` `#fef2f2` | Overdue, blocked, alerts |

### Critical rules
- **NEVER use `bg-accent` as a text color on white** — lime is unreadable. Always use `text-accent-text` for green text.
- **NEVER introduce new colors** not in this list. If a new shade feels needed, pick the closest existing token.
- Status colors (`#22c55e`, `#f59e0b`, `#ef4444`) are the only exception to the green palette rule.

---

## 2. Typography

Font: **Inter** (loaded via Google Fonts in `layout.tsx`).
All anti-aliased via `globals.css`.

### Scale
| Role | Size | Weight | Token |
|------|------|--------|-------|
| Page hero | `text-[42px]` | `font-bold` | `text-text-primary` |
| Section hero | `text-[28px]` | `font-semibold` | `text-text-primary` |
| Card title | `text-[18px]` | `font-semibold` | `text-text-primary` |
| Label / nav | `text-[13px]` | `font-medium` | varies |
| Body | `text-[13px]` | `font-normal` | `text-text-secondary` |
| Caption | `text-[11px]` | `font-normal` | `text-text-muted` |
| Micro | `text-[10px]` | `font-normal` | `text-text-muted` |

### Rules
- Heading hierarchy must be maintained. If a page already has a 42px hero, don't add a second 42px element.
- Bold within body copy (`<strong>`) is fine for emphasis; limit to 2–3 per paragraph.
- Line height: `leading-tight` for headings, `leading-relaxed` for body paragraphs.

---

## 3. Layout

### Page structure
```
[bg-background, full viewport]
  └── Sidebar (fixed, left-4 top-4 bottom-4, w-[220px], bg-sidebar, rounded-3xl)
  └── Main panel (ml-[228px], min-h-screen, p-4)
        └── Role selector (top, inside main panel)
        └── Dashboard card (bg-card, rounded-3xl, shadow-sm, p-8)
              └── Content + right chat panel (flex gap-5)
```

### Main card
- `bg-card rounded-3xl shadow-sm p-8`
- This is the single white container. Everything lives inside it.
- Never put content outside this card (except the role selector which sits above it).

### Content + chat split
- `flex gap-5`
- Content: `flex-1 min-w-0`
- Chat panel: `w-[300px] flex-shrink-0`

### Inner cards / sections
- Section cards: `bg-card rounded-2xl p-5 border border-card-border` (note: slightly smaller radius than the outer card)
- Tinted section (AI summary, stats): `bg-accent-light rounded-xl p-4` or `bg-background rounded-xl p-3`
- Never nest a `rounded-3xl` inside another `rounded-3xl`.

### Spacing rhythm
- Between major sections: `mb-5` (20px)
- Between elements within a section: `gap-3` or `gap-4`
- Inner padding (section cards): `p-5` or `p-6`
- Inner padding (stat cells, badges): `p-3` or `px-3 py-1.5`

---

## 4. Component Patterns

### Stat cell
```jsx
<div className="text-center p-3 bg-background rounded-xl">
  <span className="text-[20px] font-bold text-text-primary block">42</span>
  <span className="text-[10px] text-text-muted">Label</span>
</div>
// Highlighted variant (accent):
<div className="text-center p-3 bg-accent-light rounded-xl">
  <span className="text-[20px] font-bold text-accent-text block">9</span>
  <span className="text-[10px] text-text-muted">Label</span>
</div>
// Dark variant (sidebar color):
<div className="text-center p-3 bg-sidebar rounded-xl">
  <span className="text-[20px] font-bold text-white block">9</span>
  <span className="text-[10px] text-white/50">Label</span>
</div>
```

### Status badge (pill)
```jsx
// Success
<div className="flex items-center gap-1.5 bg-success-light px-3 py-1.5 rounded-full">
  <Icon size={12} className="text-success" />
  <span className="text-[11px] font-semibold text-success">On Track</span>
</div>
// Warning / Urgent: swap colors
```

### Notification row
```jsx
<div className={`flex gap-3 p-3 rounded-xl border ${config.border} ${config.bg}`}>
  <Icon size={16} className={`${config.color} flex-shrink-0 mt-0.5`} />
  <div>
    <p className="text-[12px] text-text-primary leading-relaxed">{message}</p>
    <span className="text-[10px] text-text-muted mt-1 block">{time}</span>
  </div>
</div>
```

### AI summary block
```jsx
<div className="bg-accent-light rounded-xl p-4 border border-accent-text/10">
  <div className="flex items-center gap-2 mb-2">
    <div className="w-5 h-5 rounded-full bg-sidebar flex items-center justify-center">
      <span className="text-accent text-[9px] font-bold">AI</span>
    </div>
    <span className="text-[11px] font-semibold text-accent-text">Label</span>
  </div>
  <p className="text-[13px] text-text-primary leading-relaxed">…</p>
</div>
```

### Section header (icon + title)
```jsx
<div className="flex items-center gap-2 mb-4">
  <Icon size={15} className="text-text-primary" />
  <h3 className="text-[14px] font-semibold text-text-primary">Title</h3>
</div>
```

### Sidebar nav item
```jsx
// Active
"bg-white/10 text-white" + icon "text-accent"
// Inactive
"text-white/40 hover:text-white/70 hover:bg-white/5"
```

### Tab navigation (for multi-view cards)
```jsx
<div className="flex gap-1 bg-background rounded-xl p-1 mb-5">
  {tabs.map(tab => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`flex-1 py-2 px-3 rounded-lg text-[12px] font-medium transition-all ${
        activeTab === tab
          ? "bg-card text-text-primary shadow-sm"
          : "text-text-muted hover:text-text-secondary"
      }`}
    >
      {tab}
    </button>
  ))}
</div>
```

### Chat bubble — teacher/AI
```jsx
<div className="flex gap-2.5 mb-3">
  <div className="w-6 h-6 rounded-full bg-sidebar flex-shrink-0 …" />
  <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2 max-w-[80%] shadow-sm border border-border">
    <p className="text-[12px] text-text-primary leading-relaxed">{text}</p>
  </div>
</div>
```

### Chat bubble — student
```jsx
<div className="flex justify-end mb-3">
  <div className="px-3 py-2 rounded-2xl rounded-tr-sm max-w-[80%]" style={{ background: "#d9e8fc" }}>
    <p className="text-[12px] text-text-primary leading-relaxed">{text}</p>
  </div>
</div>
```
Note: `#d9e8fc` is intentionally hardcoded — it's the one instance where a non-token value is used. Reason: soft blue avoids the "corporate" feel that any green variant would have for student messages.

---

## 5. Sidebar Promo Card

```jsx
<div className="bg-white/10 rounded-2xl p-4 mt-4 backdrop-blur-sm">
  <div className="flex items-start justify-between mb-2">
    <p className="text-white text-[13px] font-semibold leading-tight">{title}</p>
    <Zap size={20} className="text-accent" />
  </div>
  <p className="text-white/40 text-[11px] leading-relaxed mb-3">{body}</p>
  <button className="bg-accent text-sidebar text-[11px] font-semibold px-4 py-2 rounded-xl hover:brightness-110 transition-all cursor-pointer">
    {cta}
  </button>
</div>
```

---

## 6. Information Architecture — What Goes Where

### Rule: The dashboard is a daily snapshot, not a report.

| Content type | Dashboard (Overview) | Tab / Sub-page |
|---|---|---|
| AI summary of the week | ✅ | — |
| Today's status badge | ✅ | — |
| Quick stats (4 numbers) | ✅ | — |
| Active alerts / notifications | ✅ | — |
| Today's / next deliverables (3–4) | ✅ | — |
| Full trimester timeline | — | Progress tab |
| All 8 LOMLOE competencies | — | Progress tab |
| Full week calendar | — | Calendar tab |
| Student profile / contact | — | Profile tab |
| Settings | — | Settings tab |

**Threshold**: If a section requires scrolling to consume, it belongs in a tab, not the dashboard.

---

## 7. Role Differences

| Element | Student | Parent | Teacher |
|---------|---------|--------|---------|
| Hero greeting | "Let's build your Airbnb" | "Lucas's week" | "Good morning, Ana" |
| Primary action | Task detail / tool choice | Read AI summary | Review alerts |
| Right panel | Inline chat (Prof. Ana) | TeacherChat (parent mode) | TeacherChat (teacher mode) |
| Gamification | Full (XP, level, tribe, missions) | None (parent sees outcomes, not mechanics) | None |
| Chat persona | Student ↔ Prof. Ana | Parent ↔ qhumaOS AI | Teacher ↔ per-student |

---

## 8. Do Not

- Do not add new shadows beyond `shadow-sm`.
- Do not use `shadow-lg`, `shadow-xl` — they break the flat card aesthetic.
- Do not use `rounded-full` on content cards (only on pills/badges/avatars).
- Do not use `font-bold` on body text — only on stat numbers and page heroes.
- Do not create new color variables. Work within the token set.
- Do not add border-radius larger than `rounded-3xl` (the outer card uses this as max).
- Do not use `gap-6` or wider between major sections — `gap-5` is the max in content areas.
