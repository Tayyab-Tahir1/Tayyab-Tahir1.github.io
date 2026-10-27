Build this as an **editorial research dossier**: strong typography, ruled project rows, generous figure plates, and visible qualifications beside every result. Teal identifies links and interaction; research graphics retain their original colours.

**Layout and navigation**

Use a 1,200 px maximum content width. At 1440 px, margins are 120 px. Desktop: 12 columns, 24 px gutters. Tablet: eight columns, 24 px outer padding. Below 768 px: four columns, 16 px gutters, 20 px outer padding; at 375 px, usable width is 335 px.

Use an 8 px spacing rhythm with 4 px refinements. Section spacing: 80 px desktop, 48 px mobile. Thin horizontal rules establish hierarchy. No shadows; corners remain square except 4 px on controls.

Desktop header: 72 px high, name left, Work / Publications / CV / About right, followed by a text-labelled theme toggle. Work links to the home project list. Mobile: two lines, identity/theme first and four navigation links second, approximately 96 px total. Avoid a hamburger. Underline the current destination; provide 44 px touch targets and a skip link.

| Page | Desktop | 375 px collapse |
|---|---|---|
| Home | Hero → six featured rows → research map → short contact footer | Same order; compact hero and stacked rows |
| Project | Full-width title; metadata rail spanning three columns, reading column spanning nine | Metadata becomes a wrapping definition list beneath title |
| Publications | Three-column summary rail; nine-column bibliography | Summary above bibliography; all categories expanded |
| CV | Three-column summary/download rail; nine-column PDF viewer | Summary and download first; explicit “Preview PDF” disclosure |
| About | Four-column introductory rail; eight-column biography and education | Bio → education → certifications → contact |

**Typography**

Pair self-hosted [Newsreader](https://fontsource.org/fonts/newsreader) with [Public Sans](https://fontsource.org/fonts/public-sans/about), a restrained grotesque. Load Latin and Latin Extended WOFF2 subsets. Use Newsreader 400/500 and Public Sans 400/500/600. No third font; metadata uses tabular numerals.

```css
:root {
  --font-display: "Newsreader", Georgia, serif;
  --font-body: "Public Sans", Arial, sans-serif;

  --type-display: clamp(2.5rem, 1.7rem + 3.4vw, 4.75rem);
  --type-title: clamp(2.25rem, 1.8rem + 2vw, 3.5rem);
  --type-section: clamp(1.75rem, 1.45rem + 1.3vw, 2.5rem);
  --type-project: clamp(1.375rem, 1.2rem + .7vw, 1.875rem);
  --type-lead: clamp(1.125rem, 1rem + .55vw, 1.5rem);
  --type-body: clamp(1rem, .96rem + .2vw, 1.125rem);
  --type-meta: clamp(.875rem, .85rem + .1vw, .9375rem);
}
```

Newsreader: name, page titles and section headings, line-height 1.08–1.18. Public Sans: project titles at 600/1.25, leads at 400/1.4, body at 400/1.6, metadata at 400/1.45. Body measure: 62 characters; introductory text: 42. Keep headings sentence case. Use no uppercase eyebrows.

**Colour system**

| Token | Light | Dark |
|---|---|---|
| Background | `#F6F5F2` | `#151C1A` |
| Surface | `#FFFFFF` | `#1E2825` |
| Text | `#202B29` | `#EDF1EC` |
| Muted text | `#58635F` | `#B1BEB7` |
| Rule/border | `#CCD3CE` | `#46544D` |
| Accent | `#24695F` | `#87C9B9` |
| Accent text on background | `#24695F` | `#87C9B9` |
| Focus ring | `#24695F` | `#87C9B9` |
| Figure plate | `#FFFFFF` | `#FFFFFF` |
| Figure ink | `#202B29` | `#202B29` |

Calculated WCAG contrast, background / surface respectively:

- Light: text **13.39 / 14.59**, muted **5.72 / 6.24**, accent **5.91 / 6.44**.
- Dark: text **15.17 / 13.28**, muted **9.00 / 7.88**, accent **9.14 / 8.00**.

All specified text combinations exceed AA for normal text. Figure ink on white is **14.59:1**. Filled accent controls use the theme’s background colour as text. Rules are separators, never sole control boundaries. Focus uses a 2 px ring with 3 px offset; controls on white plates retain the light-theme ring.

White diagrams and plots sit within padded white plates in both themes. Never invert, tint or dim scientific graphics. Captions sit outside plates in theme colours. Audit embedded plot labels separately.

**Hero composition**

At 1440 × 900: header occupies y=0–72; hero approximately y=120–540. Left six columns contain:

- “Tayyab Tahir” in display serif.
- Exact positioning: “Reinforcement learning, predictive control and trustworthy AI for energy systems and field robots.”
- Current role, TalTech Centre for Biorobotics, Tallinn, Estonia; Horizon Europe project.
- CV PDF / Publications / Google Scholar / GitHub, with CV as the sole filled button.
- Quiet evidence line: “9 peer-reviewed papers · 168 citations · h-index 6”, dated to the actual Scholar check.

Right six columns: `hero-microgrid-3d.png`, approximately 588 × 368 px, native 8:5 ratio, fully contained, centred, **no crop**. No overlaid text. Preserve its warm background as a deliberate illustration plate in dark mode. Caption: “Energy-system control across electricity, storage and hydrogen.”

Featured work begins around y=600; the first row fits above the fold.

At 375 × 812: header 96 px; name, positioning, role and links occupy approximately y=120–440; metrics follow. Illustration becomes 335 × 209 px beneath them. The featured-work heading appears near the bottom; rows begin below the fold. These are layout targets, not fixed heights; zoom and wrapping must expand naturally.

Place `research-map.png` after all six projects, full width within a white plate. Its conceptual labels need space, not hero-thumbnail treatment.

**Featured work**

Six ruled editorial rows, without numeric indexes. Desktop row: 240 × 150 px thumbnail, flexible text column, 120 px status column; 24 px gaps and vertical padding. Mobile: 160 × 100 px thumbnail, then full-width title, status and result. No nested boxes.

Use microgrid, rover, Lumen screenshot, VPP diagram, GlassML screenshot and BlueROV still respectively. Contain diagrams; crop screenshots only to remove irrelevant chrome.

Result copy stays at body size. Bold the result phrase, keeping its qualification in the same sentence:

| Project | Result line | Status |
|---|---|---|
| Port energy | Oslo simulation: **38.9% lower bill and 45.8% lower CO₂** with MPC-LSTM versus a non-optimised base case. | Completed |
| GCAST | Uncertainty-aware wheel-slip estimates with prediction intervals and coverage checks; paper in preparation. | In progress |
| Lumen Home | Tallinn simulation: **35% lower annual bill** versus default rules. | Prototype |
| Virtual power plant | Year-long simulation: **71% higher net value** versus rule-based control; single seed. | Simulation study |
| GlassML | Self-hosted glass-box ML testbench built with Next.js and FastAPI. | Working prototype |
| Marine robotics | Team projects in BlueROV buoy-tracking visual servoing and dynamic positioning control. | Completed |

Status is plain muted text, never a coloured pill.

**Project anatomy**

Under the title, show labelled Status / Year / Role / Tools. Use verified dates and distinguish individual contributions from team work.

1. **Question:** one prominent sentence, then brief system context.
2. **My contribution:** three concise bullets describing owned decisions and deliverables.
3. **Method diagram:** full reading-column white plate, 24 px padding desktop, 12 px mobile. Caption “Figure 1. …”; assumptions in the desktop rail, below the caption on mobile.
4. **Results figures:** sequential Figure 2, Figure 3; one sentence interpreting each. Pair plots only when labels remain legible. Provide full-size image links.
5. **Limitation:** top rule, explicit heading, ordinary body text. State simulation scope, baselines, seed limitations or missing validation as applicable.
6. **Links/video:** paper, repository, thesis and demonstration links, followed by the video facade.

Keep architecture details here: port storage capacities and controller comparisons; GCAST sensor streams; Lumen’s 36-hour planner; VPP capacities. For unfinished work, explicitly label results as pending.

**Publications, CV and about**

Publications: separate “Journal articles (5)”, “Conference papers (4)”, “Manuscript in preparation” and “MSc thesis”. Each ruled entry has title, authors with Tayyab bolded, venue/year, DOI and available manuscript links. Never count preparation as peer-reviewed. Metrics include a checked date and Scholar link.

CV: visible download filename, file size and update date; short research/education summary precedes the PDF. Desktop viewer approximately 760 px tall with an always-visible open/download fallback.

About: concise bio; education rows for TalTech, MIR at Université de Toulon and NTNU with grade A, and UMT Electrical Engineering with Gold Medal. Certification badges remain small, with adjacent names including NASA Open Science 101 and Anthropic Academy. Include PTE Academic 70, “References available on request”, and email only.

**Video and motion**

Reserve a 16:9 poster. Empty state: static poster with an opaque theme-surface caption strip, “Video coming soon”; no play control. Filled state: accessible “Play project demonstration” button; click replaces the poster with a `youtube-nocookie` embed. Make no YouTube requests before activation. Preserve dimensions and provide a separate YouTube link.

Allow 120–160 ms colour transitions and an optional 120 ms poster fade on activation. No entrance animations, parallax or moving diagrams. Reduced motion removes transitions and smooth scrolling.

Exactly three template risks:

1. **Identical floating cards:** use shared rules, asymmetric columns and unboxed rows.
2. **Oversized metric counters:** keep evidence compact, dated and attached to qualifications.
3. **Generic dashboard decoration:** use actual diagrams and screenshots; omit gradients, decorative dots and ornamental badges.