# Gabriel Maciel — Brand Guidelines

## Identity

**Name**: Gabriel Maciel
**Logo**: "GM" monogram in Georgia serif
**Tagline**: "Você não precisa entender de tecnologia para usar IA de verdade."
**Domain**: gabrielmaciel.com.br
**Language**: Portuguese (Brazilian)
**Tone**: Professional, direct, approachable — zero jargon, real results

---

## Colors

| Name | Hex | Usage |
|------|-----|-------|
| Navy | `#0C2D3E` | Hero, Contact, Navbar logo, headings |
| Navy Mid | `#163B50` | Contact section cards, code blocks |
| Gold | `#D4A920` | CTAs, gold bars, links, accents, pill text |
| Gold Light | `#F0CC50` | Gold hover state |
| Gold Pale | `#FBF3D0` | Pill backgrounds, filter chips active |
| White | `#FFFFFF` | Main content backgrounds, card backgrounds |
| Off White | `#F7F8F9` | Alternating sections, code backgrounds |
| Ink | `#111820` | Body text, headings on light |
| Ink Mid | `#3A4A56` | Secondary body text, post content |
| Ink Light | `#6B7E8C` | Captions, metadata, placeholder text |
| Border | `#DDE4E8` | Card borders, dividers, input borders |
| Error | `#D94F4F` | Form validation errors |
| Footer Dark | `#060F15` | Footer background |

### CSS Custom Properties
All colors available via `var(--navy)`, `var(--gold)`, etc. in `screen.css`.

---

## Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| Display / Logo | Georgia, serif | 700 | `clamp(52px, 10vw, 96px)` |
| Section titles | Georgia, serif | 700 | `clamp(24px, 4vw, 36px)` |
| Card titles | Georgia, serif | 700 | `18–20px` |
| Body text | System sans-serif | 300–400 | `15–17px` |
| Labels / tags | System sans-serif | 700 | `11px`, UPPERCASE, 0.1em tracking |
| Buttons | System sans-serif | 600–700 | `13–15px` |
| Captions / meta | System sans-serif | 400 | `11–13px` |

**System sans-serif stack**: `-apple-system, 'Segoe UI', sans-serif`

**Serif class**: `.serif` → `font-family: Georgia, serif`
**Sans class**: `.sans` → `font-family: -apple-system, 'Segoe UI', sans-serif`

---

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| Section padding | `80px 32px` | Standard section vertical/horizontal |
| Hero padding | `124px 32px 84px` | Hero sections |
| Max content width | `860px` | Articles, projects |
| Max text width | `720px` | Post body, single-column content |
| Card radius | `10px` | Cards, input fields |
| Gold bar | `44px × 3px` | Decorative accent below section labels |

---

## Components

### Gold Accent Bar
Used below every section label. Always gold (`#D4A920`), 44px wide, 3px tall, `border-radius: 2px`.

### Section Label
`UPPERCASE`, 11px, 700 weight, gold color, `0.1em` letter-spacing. Always appears above gold bar.

### Section Header Pattern
```
[LABEL TEXT] ← gold, uppercase, 11px
[gold bar 44×3px]
[Section Title] ← serif, 700, clamp(24px, 4vw, 36px), navy
```

### `.btn-gold`
Background: `#D4A920` → hover `#F0CC50`. Text: navy. Uppercase. 4px radius. Lifts 2px on hover with gold glow.

### `.btn-outline`
Transparent with white border. Hover: gold border + gold text. Used on dark (navy) backgrounds.

### `.pill`
Background `#FBF3D0`, text `#7A5800`. 11px, 700, uppercase, 5px letter-spacing. `border-radius: 20px`.

### `.card`
White background, `#DDE4E8` border, `10px` radius. On hover: `translateY(-5px)`, gold border, box shadow.

### `.post-row`
Article list item without image. `border-bottom: 1px solid border`. Hover: indent left, gold arrow appears.

---

## Page Structure

| Page | Template | Background |
|------|----------|------------|
| Homepage | `page-home.hbs` | Hero: Navy → Off-white → White → Off-white → Navy |
| Articles | `index.hbs` | Header: Navy, List: White |
| Single Post | `post.hbs` | Header: Navy, Body: White, Related: Off-white |
| Projects | `page-projects.hbs` | Header: Navy, Grid: White, CTA: Navy |
| Freebie | `page-freebie.hbs` | Hero: Navy, Benefits: Off-white |
| Static page | `page.hbs` | Header: Navy, Body: White |
| Error | `error.hbs` | Full: Navy |

---

## Voice & Tone

- **Direct**: No fluff. Every sentence earns its place.
- **Practical**: Real use cases, real results. No hype.
- **Personal**: First person, conversational. Never corporate.
- **Bilingual-aware**: Primary language is Portuguese (BR). Technical terms in English are acceptable.
- **CTAs**: Always action-oriented. "Ver projetos", "Fale comigo", "Ler artigo".
