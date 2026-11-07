# Cutout Studio — Free background remover & photo editor

Everything runs in your browser. Your photos never leave your device. No signup, no
watermarks, no limits. Free.

## Features
- AI background removal (runs locally via WASM — `@imgly/background-removal`)
- Replace background: solid color, gradient, blur (of original), or your own image
- Adjustments: brightness, contrast, saturation, temperature
- Transform: rotate, flip horizontal/vertical
- Crop ratio presets (1:1, 4:3, 16:9, 3:4, 9:16, free) — center crop on export
- Export: PNG / JPEG / WebP, optional resize presets (Instagram, LinkedIn, etc.)

## Stack
Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind v4 · Turborepo · pnpm

## Run
```bash
pnpm install
pnpm dev   # http://localhost:3000
```

## Build
```bash
pnpm build
pnpm --filter web typecheck
```

## Why this exists
A portfolio-grade, genuinely useful product: a free, privacy-first photo tool. Built as a
shipping exercise (full-stack, strict TS, accessible, deployable). Background removal happens
entirely client-side, so there is no backend cost and no privacy risk.

## Roadmap
- [ ] Cloud save / gallery (optional, with auth)
- [ ] Batch processing
- [ ] AI headshots (paid packs) — future vertical
- [ ] PWA / offline support
- [ ] Tests (Vitest + Playwright) + CI
