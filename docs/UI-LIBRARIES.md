# UI Component Libraries

This project is configured for **shadcn/ui**, **Aceternity UI**, **Magic UI**, and **Framer Motion** copy-paste components on **Tailwind CSS v4 + Next.js**.

## Install a shadcn component

```bash
npx shadcn@latest add button
npx shadcn@latest add accordion dialog sheet tabs
```

Components land in `src/components/ui/` and import `cn` from `@/lib/utils`.

## Copy-paste Aceternity / Magic UI

1. Install any extra deps listed on the component page (often `framer-motion`, `clsx`, `tailwind-merge`).
2. Paste the component into `src/components/ui/` (or `src/components/magicui/` / `aceternity/`).
3. Ensure imports use:
   - `import { cn } from "@/lib/utils"`
   - `import { motion } from "framer-motion"` (or `motion/react`)
4. Prefer token classes: `bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`, `border-border`, `ring-ring`.

## Dark mode

Root layout already sets `className="… dark …"` on `<html>`.

- Force dark: add `dark` on `<html>` (current default)
- Force light: remove `dark` from `<html>`
- Toggle: `document.documentElement.classList.toggle("dark")`

Utility classes respond via `@custom-variant dark (&:is(.dark *))`.

## Key files

| File | Role |
|------|------|
| `src/lib/utils.ts` | `cn()` helper |
| `src/app/globals.css` | CSS variables + `@theme inline` |
| `tailwind.config.ts` | Tooling / docs-compatible theme map |
| `components.json` | shadcn CLI config |
| `src/components/ui/*` | Base Button, Card, Input, Label |

## Notes (Tailwind v4)

- Live theme tokens are in `globals.css` (`@theme inline`), not only in `tailwind.config.ts`.
- Do **not** replace `@import "tailwindcss"` with legacy `@tailwind base/components/utilities`.
- Brand `text-accent` / `bg-accent` stay steel-blue (`#3A8FB8`) in dark mode so existing pages keep working.
