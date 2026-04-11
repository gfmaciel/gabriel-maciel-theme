# gabriel-maciel-theme

Custom Ghost CMS theme for [gabrielmaciel.com.br](https://gabrielmaciel.com.br) — the personal website of Gabriel Maciel, AI consultant and builder.

Converted from a React/JSX prototype (`reference/gabriel-maciel-v8.jsx`) to a full Ghost Handlebars theme.

---

## Pages

| Template | URL | Description |
|----------|-----|-------------|
| `page-home.hbs` | `/` | Custom homepage — Hero, Projects preview, Articles preview, YouTube, Contact form |
| `index.hbs` | `/posts/` | Articles archive with tag filter |
| `post.hbs` | `/[slug]/` | Single post — content, author, related posts |
| `page-projects.hbs` | `/projetos/` | Projects grid (CMS-driven via `#projetos` tag) |
| `page-freebie.hbs` | `/[slug]/` | Freebie lead capture landing page |
| `page.hbs` | fallback | Generic static page |
| `error.hbs` | `/404`, `/500` | Error pages |

---

## Ghost Admin Setup (Required)

### 1. Create the Homepage page
1. Ghost Admin → **Posts → New page**
2. Title: `Home`, Slug: `home`
3. Publish it
4. Go to **Settings → Design → Homepage** → select **Home**
   - Ghost will now serve `page-home.hbs` at `/`
   - The blog index moves to `/posts/`

### 2. Create the Projects page
1. Ghost Admin → **Posts → New page**
2. Title: `Projetos`, Slug: `projetos`
3. Select template: **Page — Projects** (appears in sidebar)
4. Publish

### 3. Create a Freebie page
1. Ghost Admin → **Posts → New page**
2. Set any title (e.g. "Meu Checklist de IA")
3. Select template: **Page — Freebie**
4. Write benefits in the page body (optional — fallback content is shown if empty)
5. Publish

### 4. Tag projects in Ghost
Projects are managed as Ghost **posts** with the internal tag `#projetos`:
1. Ghost Admin → **Tags → New tag**
2. Name: `#projetos` (the `#` prefix makes it internal — hidden from public tag pages)
3. Add this tag to any post you want to appear in the Projects section/page

### 5. Configure Navigation
Ghost Admin → **Settings → Navigation**:
```
Home          /
Artigos       /posts/
Projetos      /projetos/
```

---

## Theme Installation

### Option A: GitHub auto-deploy (active)
This repo is connected to Ghost via the **GitHub integration** (Settings → Integrations → GitHub). Pushing to `main` automatically deploys the updated theme to the live site — no manual upload needed.

```bash
git add .
git commit -m "your change"
git push origin main
# Ghost pulls and activates the new theme within ~30 seconds
```

### Option B: Zip upload (manual)
```bash
# From the theme root folder:
zip -r gabriel-maciel-theme.zip . -x "*.git*" -x "reference/*" -x "node_modules/*"
```
Upload the zip via Ghost Admin → **Settings → Design → Upload theme**.

### Option C: Direct deployment on EasyPanel
If Ghost is running via EasyPanel with volume mounts, copy the theme folder into:
```
/var/lib/ghost/content/themes/gabriel-maciel-theme/
```
Then in Ghost Admin → **Settings → Design**, activate the theme.

---

## Contact Form

The contact form in `page-home.hbs` currently POSTs to `/api/contact` (placeholder).
To make it functional, wire it to a backend:

### Option 1: Formspree (easiest)
```html
<!-- In page-home.hbs, find the <form> tag and change: -->
<form id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```
Then in `assets/js/main.js`, change the fetch endpoint to match or remove the JS submission and let the native form POST handle it.

### Option 2: Self-hosted endpoint on EasyPanel
Deploy a simple Express/Node.js service that:
1. Validates the reCAPTCHA token against Google's API
2. Sends email via SendGrid, Resend, or SMTP

The form sends: `{ nome, email, mensagem, recaptchaToken }` as JSON to `POST /api/contact`.

### reCAPTCHA
The theme uses reCAPTCHA v2 (checkbox). The test key is hardcoded in `page-home.hbs`:
```html
data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
```
Replace with your production site key from [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin).

---

## YouTube Section

The YouTube cards in `page-home.hbs` are **hardcoded** (thumbnails from Unsplash, placeholder titles). Update them manually with real video thumbnails and URLs:

```html
<!-- Find the yt-card blocks in page-home.hbs and update: -->
<img src="https://img.youtube.com/vi/YOUR_VIDEO_ID/hqdefault.jpg" ...>
<a href="https://youtube.com/watch?v=YOUR_VIDEO_ID" ...>
```

---

## Customization

### Updating social links
Edit `partials/footer.hbs` — all social URLs are hardcoded there.
Also update the nav partial (`partials/navigation.hbs`) if needed.

### Brand colors
All colors are defined as CSS custom properties in `assets/css/screen.css` at `:root`. Change there to propagate site-wide.

### Posts per page
Edit `package.json`:
```json
"config": {
  "posts_per_page": 10
}
```

---

## Known Issues & Conventions Discovered

### Ghost `{{#get}}` filter syntax for internal tags
Internal tags (prefixed `#`) in Ghost filter strings must be written as `hash-tagname` in the filter:
```handlebars
{{!-- CORRECT --}}
{{#get "posts" filter="tag:hash-projetos"}}

{{!-- WRONG (won't work) --}}
{{#get "posts" filter="tag:#projetos"}}
```

### `{{multiply}}` helper not built-in
The `{{multiply @index 0.07}}` syntax used in `index.hbs` for staggered animation delays is **not a built-in Ghost helper**. Ghost uses a subset of Handlebars helpers. This was replaced with direct `data-delay` values. If you see issues, remove the `data-delay` attributes — animations will still work without stagger.

### `{{#get}}` nesting issue in page-projects.hbs
Ghost's `{{#get}}` block requires the `{{else}}` inside the get block, but the outer `{{#foreach}}` also needs its own `{{else}}`. Fixed by restructuring to avoid nested else ambiguity.

### React → Handlebars limitations
- No component state: all interactivity moved to `assets/js/main.js`
- No conditional class binding: uses `.service-option.selected` class toggled by JS
- Float label form fields: CSS-only approach using `.has-value` and `.focused` classes set by JS
- reCAPTCHA widget: rendered via `window.onRecaptchaLoad` callback instead of React hook

### EasyPanel + Ghost
- Ghost on EasyPanel uses Docker. Theme files go in the `content/themes/` volume.
- After uploading a theme zip, restart Ghost from the EasyPanel dashboard.
- The `ghost_head` and `ghost_foot` helpers handle portal, membership, and admin bar injection automatically.

### Image optimization
Ghost's `{{img_url}}` helper supports responsive sizes: `xs`, `s`, `m`, `l`, `xl`. Used throughout the theme:
- Card thumbnails: `size='s'`
- Feature images: `size='l'`
- Author avatars: `size='xs'`

---

## File Structure
```
gabriel-maciel-theme/
├── assets/
│   ├── css/screen.css      — All styles (brand + pages + responsive)
│   └── js/main.js          — Vanilla JS (menu, animations, forms)
├── partials/
│   ├── navigation.hbs      — Fixed top nav with GM logo
│   ├── footer.hbs          — Footer with social links
│   └── post-card.hbs       — Article card (cover + text-row variants)
├── default.hbs             — Base HTML layout
├── index.hbs               — Articles archive (/posts/)
├── post.hbs                — Single post
├── page.hbs                — Generic static page fallback
├── page-home.hbs           — Custom homepage
├── page-projects.hbs       — Projects listing
├── page-freebie.hbs        — Freebie lead capture
├── error.hbs               — 404/500 error page
├── package.json            — Ghost theme manifest
├── BRAND.md                — Brand guidelines
└── reference/
    └── gabriel-maciel-v8.jsx  — Original React prototype (design reference only)
```
