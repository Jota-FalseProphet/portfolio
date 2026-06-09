# portfolio

Personal portfolio — [yostesis.online](https://yostesis.online).

A small static site: no build step, no framework. Plain HTML, CSS and JS,
plus a WebGL scene for the chrome figures.

## Features

- **Day / night themes** with a radial wipe transition between them.
- **i18n** in Spanish, English and Catalan.
- **WebGL chrome figures** (Three.js): a torus, a sphere and a torus knot
  with a metal + iridescent material reflecting a procedural sky. Falls back
  to nothing when WebGL isn't available.
- Animated clouds, scroll reveals and counters. Honors `prefers-reduced-motion`.

## Stack

`HTML` · `CSS` · `JavaScript` · `Three.js`

## Structure

```
public/
  index.html      markup
  style.css        styles + themes
  app.js           i18n, theme, reveals, counters
  scene.js         WebGL chrome figures
  i18n.js          translations
  vendor/          three.module.js (self-hosted)
docker-compose.yml  nginx:alpine serving public/
nginx.conf
```

## Run locally

```bash
docker compose up -d   # serves public/ on port 80
```

Or just open `public/index.html` in a browser.

## Deploy

Served by nginx (Docker) behind a Cloudflare tunnel.
