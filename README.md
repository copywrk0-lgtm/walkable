# Copywrk — Walkable Archive v2

A first-person 3D portfolio with a fast, accessible HTML portfolio built into the same page.

## What changed in v2

- Browser zoom is no longer disabled.
- Meaningful first paint: headline + Pakeezah project preview render immediately while 3D loads.
- Persistent `START A PROJECT` CTA in the gallery HUD.
- First-entry control hint fades away automatically.
- `#projects` provides a real scrolling HTML fallback with all six projects.
- WebGL failure automatically opens the HTML fallback.
- Project names, descriptions and live links are present in real HTML for crawlers and previews.
- Three rooms now have different materials and light temperatures.
- Pixel ratio is capped at 1.5; runtime shadows are disabled; gallery textures are compressed WebP.
- Mobile controls use `touch-action: none`; canvas touch movement prevents browser gesture interference without disabling document zoom.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

Vercel will auto-detect Vite and deploy the `dist` output.

## Controls

- Desktop: enter the 3D archive, click once to capture the mouse, WASD / arrows to move, click a targeted work to open it. Esc releases pointer lock.
- Mobile: left thumb joystick to walk; drag the right half of the screen to look; tap a targeted work to open it.
- Fast fallback: choose `VIEW PROJECTS AS A LIST` at any time. The list also opens automatically when WebGL is unavailable.

## Project data

The 3D project data lives near the top of `src/main.js`. The crawlable fallback lives directly in `index.html`. Keep those descriptions aligned when changing projects.
