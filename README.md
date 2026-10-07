# Copywrk — Walkable Archive

A first-person 3D portfolio gallery inspired by the supplied museum reference.

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

- Desktop: click the scene to capture the mouse, move with WASD / arrow keys, click an artwork to open it, Esc releases the pointer.
- Mobile: left thumb joystick to walk; drag on the right side to look; tap an artwork to open it.

## Structure

- `src/main.js` — Three.js scene, first-person controls, collisions and project interaction.
- `src/style.css` — entry sequence, HUD, mobile controls and project/archive/contact overlays.
- `public/art/` — six local art textures used in the gallery.

## Replace projects

Edit the `projects` array near the top of `src/main.js`. For each project you can change title, category, copy, image path and live URL. Keep images in `public/art/` for a self-contained deployment.
