# Goal

Trabaja de forma incremental y segura: cambios pequeños, pruebas rápidas.

# Project Basics

- Stack: React + TypeScript + Vite
- Package manager: pnpm
- Node version: v22.15.0

# Setup

- Instalar dependencias: `pnpm install`
- Ejecutar en dev: `pnpm dev`
- Build: `pnpm build`
- Preview build: `pnpm preview`
- Deploy: `pnpm run deploy` (usa `gh-pages` y `dist/`)

# Quality Gates (antes de finalizar)

- Lint: `pnpm lint`
- Typecheck: `pnpm exec tsc -b --pretty false`
  - Nota: el repo no define script `typecheck`; el typecheck corre dentro de `pnpm build` vía `tsc -b`.

# Code Conventions

- TypeScript estricto: no uses `any` salvo justificación.
- Prefiere componentes funcionales y hooks.
- Mantén cambios mínimos y consistentes con el estilo existente.
- No renombres archivos o APIs sin pedir confirmación.

# Repo Safety

- No tocar `.env`, secretos o llaves.
- No modificar `pnpm-lock.yaml` salvo que sea necesario.
- No ejecutar comandos destructivos (`rm -rf`, `git reset --hard`) sin pedir permiso.
- No editar código generado en `dist/`.

# Where to Work

- Frontend principal: `src/`
- Evitar editar carpetas generadas: `dist/`, `build/`, `coverage/`
