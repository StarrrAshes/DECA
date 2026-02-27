# DECA Hub — Multi-Page DECA Informational Website

A professional, responsive multi-page website about DECA (formerly Distributive Education Clubs of America), the career and technical student organization that prepares emerging leaders and entrepreneurs in marketing, finance, hospitality, and management.

> **Disclaimer:** This is a fan-made informational website and is **not** affiliated with or endorsed by DECA Inc. For official information, visit [deca.org](https://www.deca.org).

---

## Pages

| Page | File | Description |
|------|------|-------------|
| **Home** | `index.html` | Hero section, mission overview, four career clusters, key statistics |
| **About DECA** | `about.html` | History, timeline, organizational structure, core values, impact stats |
| **Resources** | `resources.html` | Official links, state associations, competition preparation tips |
| **Events** | `events.html` | Tabbed competitive event categories, ICDC info, 2025–2026 updates |
| **Contact** | `contact.html` | Contact form with validation, DECA HQ info, social links, FAQ |

## Features

- **Responsive Design** — Mobile, tablet, and desktop layouts via CSS media queries
- **Mobile Hamburger Menu** — Animated toggle with smooth open/close
- **Scroll Animations** — Elements fade in as they enter the viewport (IntersectionObserver)
- **Tabbed Content** — Event categories displayed via interactive JavaScript tabs
- **Form Validation** — Client-side validation for name, email, and message fields
- **Active Page Highlighting** — Current page is highlighted in the navigation bar
- **Semantic HTML** — Proper use of `<nav>`, `<header>`, `<section>`, `<footer>`, ARIA labels
- **No External JS Frameworks** — Pure vanilla JavaScript

## File Structure

```
deca-website/
├── index.html          # Home page
├── about.html          # About DECA page
├── resources.html      # Resources page
├── events.html         # Events & competitions page
├── contact.html        # Contact page
├── css/
│   └── style.css       # Global stylesheet
├── js/
│   └── main.js         # Navigation, animations, tabs, form validation
├── images/             # (Images loaded from Unsplash CDN)
└── README.md           # This file
```

## Running Locally

1. Clone or download this repository
2. Open `index.html` in any modern web browser
3. No build step, server, or dependencies required

```bash
# Or use a simple local server:
npx serve .
# Then visit http://localhost:3000
```

## Deploying to GitHub Pages

1. Push this repository to GitHub
2. Go to **Settings → Pages**
3. Under "Source," select **Deploy from a branch**
4. Choose the `main` branch and `/ (root)` folder
5. Click **Save** — your site will be live at `https://yourusername.github.io/repository-name/`

## Image Sources (Royalty-Free)

All images are loaded from Unsplash (free to use under the [Unsplash License](https://unsplash.com/license)):

| Usage | Source URL |
|-------|-----------|
| Hero background — conference crowd | https://images.unsplash.com/photo-1523580494863-6f3031224c94 |
| Mission — students collaborating | https://images.unsplash.com/photo-1531482615713-2afd69097998 |
| Marketing cluster — laptop analytics | https://images.unsplash.com/photo-1460925895917-afdab827c52f |
| Finance cluster — documents | https://images.unsplash.com/photo-1554224155-6726b3ff858f |
| Hospitality cluster — hotel | https://images.unsplash.com/photo-1566073771259-6a8506099945 |
| Management cluster — team whiteboard | https://images.unsplash.com/photo-1552664730-d307ca884978 |
| About — lecture hall | https://images.unsplash.com/photo-1524178232363-1fb2b075b655 |
| About — college students | https://images.unsplash.com/photo-1517245386807-bb43f82c33c4 |
| Events — presentation | https://images.unsplash.com/photo-1573497491208-6b1acb260507 |
| Events — meeting table | https://images.unsplash.com/photo-1556761175-5973dc0f32e7 |
| Events — students pair | https://images.unsplash.com/photo-1522202176988-66273c2fd55f |
| Events — conference hall | https://images.unsplash.com/photo-1540575467063-178a50c2df87 |

## Information Sources

All factual content is sourced from:

- **[DECA.org](https://www.deca.org)** — Official DECA website (mission, membership, programs)
- **[DECA.org/mission](https://www.deca.org/mission)** — Mission statement and partner information
- **[DECA.org/compete](https://www.deca.org/compete)** — Competitive events program
- **[DECA.org/conferences/icdc](https://www.deca.org/conferences/icdc)** — ICDC conference details
- **[DECA Direct](https://www.decadirect.org)** — News and 2025–2026 event updates
- **[Wikipedia: DECA (organization)](https://en.wikipedia.org/wiki/DECA_(organization))** — History and organizational structure
- **[Georgia DECA History](https://gadeca.org/national-deca-history.php)** — Founding and early milestones
- **[Connecticut DECA History](https://www.connecticutdeca.org/deca-history.html)** — Additional historical context
- **[California DECA](https://californiadeca.org/about/)** — State association and founding info
- **[Texas DECA](https://www.texasdeca.org/whatwedo)** — Programs and impact stats
- **[Michigan DECA](https://mideca.org/events/)** — Competition event details
- **[DECA Guide 2025–2026](https://issuu.com/decainc/docs/deca_guide_2025-2026)** — Official competition guidelines

## Technologies

- HTML5 (semantic markup)
- CSS3 (Flexbox, Grid, custom properties, media queries)
- Vanilla JavaScript (ES6+)
- Google Fonts (DM Serif Display, DM Sans)

## License

This project is for educational and informational purposes. DECA® is a registered trademark of DECA Inc. All DECA-related content and branding belong to DECA Inc.
