# Queenreal's Beauty Stop

A premium, editorial-style website for **Queenreal's Beauty Stop, LLC** — a hair artistry and textured hair care studio led by Crishion Canaday, serving Vinton, Virginia.

Built as a fully static site using **HTML5, CSS3, and vanilla JavaScript** (with [GSAP](https://gsap.com/) + ScrollTrigger via CDN for scroll-driven motion). No frameworks, no build step, no server required.

## Live Structure

```
/
├── index.html          Home — hero, brand story, offerings, storytelling, gallery
├── collections.html    Collections & Services — category breakdown + full price menu
├── about.html           About — founder story, values, mission
├── contact.html         Contact — info cards, enquiry form, FAQ
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── favicon.ico
└── assets/
    ├── css/
    │   ├── base.css          Design tokens, nav, footer, shared components
    │   ├── home.css
    │   ├── collections.css
    │   ├── about.css
    │   └── contact.css
    ├── js/
    │   ├── main.js            Nav, mobile drawer, cursor, magnetic buttons, lightbox, reveal engine
    │   ├── animations.js      GSAP/ScrollTrigger: hero entrance, parallax, pinned storytelling, horizontal scroll
    │   ├── collections.js     Category pill scroll-spy
    │   ├── contact-form.js    Client-side validation + mailto fallback
    │   └── faq.js             Accordion
    └── images/                 Optimized WebP imagery + favicon set
```

## Design System

- **Palette:** deep plum/aubergine darks, champagne gold accents, warm cream, with the brand's original royal purple (`#7000ff`, pulled from the client's existing Square site) used sparingly for glow/interactive accents.
- **Type:** Playfair Display (display serif) + Inter (body/UI sans).
- **Motion:** cinematic hero entrance, scroll-reveal, parallax layers, pinned scroll-storytelling, horizontal-scroll galleries, magnetic CTAs, 3D tilt cards, custom cursor (desktop), masked image reveals. All motion respects `prefers-reduced-motion`.

## Content & Imagery Sourcing

- **Business copy** (mission statement, service descriptions, founder bio, real service pricing) was pulled directly from the client's existing Square Online site (`queenreals-beauty-stopllc.square.site`) — no fabricated claims, prices, or history.
- **Founder photo** and **five real client-work photos** (box braids, cornrows, crochet curls, freeform dreads) are the business's own uploaded images, reused directly.
- **Brand mark** (the purple woman-silhouette icon) was extracted and cleaned from the client's existing site cover image/favicon — the business's real logo graphic, not a generated substitute.
- **Editorial/stock photography** is sourced from [Pexels](https://www.pexels.com) (free license, no attribution required) and optimized to WebP.

## Contact Form

The enquiry form on `contact.html` performs full client-side validation, then opens the visitor's email client via a `mailto:` link pre-filled with their enquiry, addressed to the business. **There is no backend** — nothing is silently submitted server-side.

To wire a real backend later (Formspree, Netlify Forms, a serverless function, etc.), replace the `submitViaMailto()` call in `assets/js/contact-form.js`'s submit handler with a `fetch()` POST to that endpoint. See the comment block at the top of that file.

## Running Locally

No build step needed — just serve the folder statically, e.g.:

```bash
npx serve .
# or
python -m http.server 8080
```

Then open `http://localhost:<port>/index.html`.

## Deployment

Deploy as-is to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, S3, etc.). Update the canonical/OG URLs in each page's `<head>` (currently `https://queenrealsbeautystop.com/...`) to match the final production domain.
