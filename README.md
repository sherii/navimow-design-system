# Navimow Design System

**An open-source design system distilled from real DTC (direct-to-consumer) UI/UX work** — design tokens, AI-agent skills, production HTML components, and full landing-page templates for the Navimow robotic-mower brand (Europe & North America).

> **Attribution & fair-use notice** — This is a *learning / portfolio* project. Brand assets (logos, product photography, award marks) and the Navimow wordmark remain the property of Navimow (Segway-Ninebot). The `templates/action5pro` page is a **stylistic study** that re-creates a third-party product page's layout using Navimow content; it reproduces no third-party brand assets and is provided for educational purposes only. Please do not use any of these pages commercially without permission.

---

## What's inside

```
navimow-design-system/
├── skills/          AI-agent skills — reusable *how-to* knowledge (SKILL.md format)
│   ├── navimow-design-tokens/        brand design language + machine-readable tokens
│   ├── navimow-component-build/      component workflow + accumulated design preferences
│   ├── navimow-motion-patterns/      motion/interaction pattern library & "taste" guardrails
│   ├── navimow-figma-replication/    pixel-accurate Figma → HTML replication workflow
│   └── navimow-i18n-qa/              multi-language adaptation checks (fr/nl/de/it/se…)
├── tokens/          machine-readable design tokens (JSON)
├── components/      production HTML components + spec docs
│   ├── trust-bar/            awards & media recognition carousel
│   └── collage-card-wall/    masonry-style media card grid
└── templates/       full landing-page templates (self-contained, previewable)
    ├── h5pro/                 H5 Pro product landing page
    ├── navimow-creators/      Navimow Creators campaign page
    ├── action5pro/            stylistic replication study (Navimow content)
    └── garage-accessories/    garage & accessories page
```

---

## Design tokens at a glance

| Category | Value |
|---|---|
| Primary / accent | `#FF5A00` |
| Ink / text | `#1F1F1F`, `#000000` |
| Surface | `#FFFFFF` (page), `#F7F7F5` (inactive card) |
| Typeface | Inter — weights `400 / 600 / 700` (plus `800 / 900` for campaign headlines) |
| Radius | `16px` (cards) |
| Logo strip height | `96px` desktop / `64px` mobile |

Full machine-readable tokens live in [`tokens/`](tokens/).

---

## AI skills

Each skill is a self-contained `SKILL.md` that follows the **generic Agent Skills convention** (`name` + `description` frontmatter), so it loads in Claude Code, Hermes, and most agentic coding tools — no tool-specific fields required. Content is written in Chinese (the working language of the original design process).

| Skill | What it encodes |
|---|---|
| `navimow-design-tokens` | The authoritative brand language: colors, type scale, radius, spacing, and the 3D-icon color system. |
| `navimow-component-build` | How a new component gets built: data-driven structure, file layout, browser-verification recipe, and a long list of *accumulated design preferences* (no shadows, no modals, seamless loops, motion taste). |
| `navimow-motion-patterns` | Scroll-pinned / enter-exit / 3D-tilt / count-up patterns (Apple·DJI detail-page style), plus the hard-won rule that *text fade-in reads as "flickering" and gets rejected*, while layout-level transitions are welcome. |
| `navimow-figma-replication` | The 100%-faithful Figma → HTML workflow: keep placeholder copy verbatim, batch-export with rate-limit backoff, handle embedded-bitmap SVGs, verify in a browser. |
| `navimow-i18n-qa` | Checks for the multi-language builds that DTC sites ship: narrow-state truncation, 3-line title caps, per-locale verification (BE-fr / BE-nl / IT / SE / DE tested). |

---

## Components

- **TrustBar** (`components/trust-bar/`) — awards / media-recognition carousel. Data-driven, seamless infinite loop, header copy that follows the active award, optional programmatic laurel SVG. Includes a full dev spec (`trust-bar-dev-spec.md`).
- **Collage Card Wall** (`components/collage-card-wall/`) — masonry media grid with hover 3D-tilt, video rotate-play, and alignment variants.

Each component ships a previewable single-file HTML plus a spec doc, and is self-contained.

---

## Templates

Every template is self-contained (inline CSS/JS, local `assets/`), so it opens directly in a browser or via `python3 -m http.server`.

```bash
# preview any template
cd templates/<name>
python3 -m http.server 8742
# open http://localhost:8742/
```

| Template | Notes |
|---|---|
| `h5pro/` | H5 Pro product page; 21 sections, restored from Figma. |
| `navimow-creators/` | Creators campaign page — 864px full-bleed KV, horizontal eligibility accordion, matte-clay 3D benefit icons. |
| `action5pro/` | Stylistic replication study (Navimow content, third-party layout). |
| `garage-accessories/` | Garage & accessories page with spec/compare/purchase sections. |

---

## License

- Code, tokens, and skill files: [MIT](LICENSE).
- Brand assets and photography: © Navimow (Segway-Ninebot), used here for portfolio/educational purposes.
