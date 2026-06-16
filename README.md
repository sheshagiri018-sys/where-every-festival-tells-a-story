# 🪔 Where Every Festival Tells a Story!

> A cinematic digital experience celebrating the timeless festivals and cultural heritage of Tamil Nadu.

**Live Demo:** `https://[your-username].github.io/where-every-festival-tells-a-story/`

---

## ✨ About

A world-class, award-inspired frontend website that takes visitors on a cinematic journey through the festivals of Tamil Nadu — Pongal, Karthigai Deepam, Navaratri, Deepavali, Tamil New Year, Chithirai Festival and more.

> *"Thousands of Years. Millions of Hearts. One Culture."*

---

## 🎨 Features

- 🌅 **Cinematic Hero** — animated canvas with temple silhouette, rising sun & flying birds
- 🪔 **Interactive Pongal Pot** — milk rises and overflows with confetti celebration
- 🔥 **Deepam Canvas** — 40+ animated oil lamp flames with flicker effects
- 🎆 **Deepavali Fireworks** — canvas-based rocket & particle fireworks
- 🎭 **Golu Steps** — interactive Navaratri doll arrangement
- 🗺️ **Tamil Nadu Festival Map** — animated city markers with festival info
- ✨ **Scroll Reveal Animations** — cinematic section entrances throughout
- 🎨 **Custom Cursor** — gold dot with trail (desktop)
- 📱 **Fully Responsive** — mobile menu, adaptive layouts

---

## 🚀 Deploy to GitHub Pages (Actions Mode)!

### Step 1 — Create Repo
Name it exactly: `where-every-festival-tells-a-story`

### Step 2 — Push all files
```bash
git init
git add .
git commit -m "🪔 Initial launch — Tamil Festivals website"
git branch -M main
git remote add origin https://github.com/[your-username]/where-every-festival-tells-a-story.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages via Actions
1. Go to your repo → **Settings**
2. Click **Pages** in the left sidebar
3. Under **Source**, select **GitHub Actions**
4. The workflow in `.github/workflows/deploy.yml` will trigger automatically on every push to `main`

### Step 4 — Done ✅
Your site will be live at:
`https://[your-username].github.io/where-every-festival-tells-a-story/`

---

## 📁 File Structure

```
where-every-festival-tells-a-story/
├── .github/
│   └── workflows/
│       └── deploy.yml        ← GitHub Actions deployment
├── css/
│   └── style.css             ← All styles
├── js/
│   └── main.js               ← All animations & interactions
├── index.html                ← Main HTML
├── .nojekyll                 ← Prevents Jekyll processing (critical!)
└── README.md
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 Canvas | Hero background, Deepam flames, Fireworks |
| CSS Custom Properties | Design tokens, theming |
| Vanilla JavaScript | All interactions & animations |
| GSAP (CDN) | ScrollTrigger-ready |
| Google Fonts | Playfair Display, Inter, Noto Serif Tamil |
| Intersection Observer API | Scroll-triggered reveals |
| GitHub Actions | Auto deployment |

---

## ⚠️ Important — The `.nojekyll` File

The `.nojekyll` file in the root is **critical**. Without it, GitHub Pages runs Jekyll on your project and can break CSS/JS paths. Never delete this file.

---

## 📜 Festivals Covered

| Festival | Season | Theme |
|---|---|---|
| Pongal | January | Harvest & Gratitude |
| Tamil New Year | April | New Beginnings |
| Karthigai Deepam | November | Festival of Lights |
| Navaratri | October | Nine Nights of Celebration |
| Deepavali | Oct/Nov | Light over Darkness |
| Chithirai Festival | April | Madurai's Grand Celebration |
| Thaipusam | Jan/Feb | Devotion to Murugan |
| Aadi Perukku | July/Aug | Honouring the Rivers |
| Panguni Uthiram | March/April | Divine Unions |

---

*Crafted with pride for Tamil culture. A digital heritage experience.*

**யாதும் ஊரே யாவரும் கேளிர்** — *"Every place is my hometown. Every person is my kin."*
