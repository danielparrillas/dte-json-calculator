# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

DTE - Document Table Explorer: a 100% client-side React + TypeScript + Vite SPA that reads El Salvador electronic invoice (DTE) JSON files from the user's disk, flattens them into explorable/filterable tables, and exports to XLSX. No backend, no API calls — all parsing happens in the browser. Deployed to GitHub Pages. UI copy is in Spanish; keep new user-facing strings in Spanish.

`AGENTS.md` holds the shared agent rules (in Spanish); the important ones are repeated here.

## Commands

```bash
pnpm install
pnpm dev                          # vite dev server
pnpm build                        # tsc -b (typecheck) then vite build
pnpm exec tsc -b --pretty false   # typecheck only (no `typecheck` script exists)
pnpm lint                         # eslint .
pnpm preview                      # serve the built dist/
pnpm run deploy                   # gh-pages -d dist  (run build first)
```

Node v22, pnpm. There is no test framework; typecheck + lint are the quality gates to run before finishing.

`vite.config.ts` sets `base: "/dte-json-calculator/"` for Pages, so built assets only resolve under that path — use `pnpm preview`, not a bare static server at root.

## Architecture

Data flows one way: pick format → file input → parse → Zustand store → per-format column definitions → `DataTable`.

### DTE formats

The app supports several DTE document formats, enumerated in `src/types/dteFormatEnum.ts` (`CCF`, `CCF-T`, `DCL-T`). Each format has:

- its own type file in `src/types/` (`ccf.d.ts`, `ccf_t.d.ts`, `dcl_t.d.ts`) — each *exports* its own `DTE`, `Identificacion`, `Emisor`, `CuerpoDocumento`, … types with the same names, so import them by path (aliasing when several are needed, as `dteStore.ts` and `selloSupport.ts` do). Every field is optional/nullable because real-world JSONs differ between emitters — always use optional chaining.
- its own folder in `src/partials/<format>/` with a `*-table-section.tsx` (one row per DTE) and, where it makes sense, a `*-items-table-section.tsx` (one row per `cuerpoDocumento` entry, carrying `{ item, dte }` so DTE-level columns stay available). DCL-T currently has no items table.
- a card in `src/partials/select-dte-format.tsx` and a branch in `App.tsx`'s conditional rendering.

Adding a format means touching all four places: enum, type file, partials folder, and the selector + `App.tsx` switch.

There is no schema validation: uploaded JSONs are stored untyped and each section simply casts `jsons as DTE[]` to its format's type. The selected format is what decides interpretation, and changing format does not clear the loaded files.

### Store

`src/hooks/dteStore.ts` is the single Zustand store (`format`, `jsons`, `errors`, `selectedJson`). State is mutated through exported module-level functions (`setDteFormat`, `setJsonsFromFiles`, `setSelectedJson`); components only *read* via `useDteStore(selector)`. Upload is disabled until a format is chosen. `setJsonsFromFiles` parses every file in parallel and partitions results into `jsons` and `errors`, so a malformed file never blocks the rest (errors render in `partials/errors-section.tsx`).

### Product catalog (optional)

`src/hooks/productosStore.ts` is a second Zustand store for an optional product catalog (`.xlsx`/`.xls`/`.json`, parsed by `src/utils/fileToRows.ts`). The user maps which column is the code and which is the type (`M` Mercadería / `S` Servicio); both are auto-detected on load. When configured, `useCatalogoProductos()` returns a code → type lookup, and the items tables tag each row with `tipoProducto`, add the "Tipo producto" / "Mercadería" / "Servicio" columns via `withProductoColumns` (`src/utils/productoColumns.ts`), and show the type filter cards (`partials/select-tipo-producto-section.tsx`). Codes are matched trimmed and case-insensitively, falling back to a comparison without leading zeros.

### Table shell

`src/components/ui/data-table.tsx` is the generic TanStack Table v8 shell: per-column popover header with filter/sort/hide, column-visibility dropdown, pagination, XLSX export, and an auto-summing footer (`DataTableTotal`). Sections extend it via props (`filterBy`, `exportedFileName`, `initialColumnVisibility`, `headerContent`, …) rather than building their own tables. Each section owns its `ColumnDef<T>[]` at module scope.

`src/components/json-sheet-viewer.tsx` is a global side sheet driven by `selectedJson`; a row's eye button calls `setSelectedJson(row.original)` to show the raw JSON (in items tables that is the whole `{ item, dte }` row).

### Column `meta` contract

Columns are keyed by a human-readable `id` (e.g. `"Emisor NIT"`), which is also what `filterBy` and the column-visibility list display. Each column should carry:

```ts
meta: { title: string; type: "string" | "number" | "date" }
```

`meta.title` is the header label and XLSX header; `meta.type` drives cell coercion in `src/utils/exportToXLSXFromDataTable.ts` (only visible columns and filtered rows are exported).

- `type: "date"` — the exporter only recognizes an accessor value in the exact format `"YYYY-MM-DD HH:MM:SS"`, so date columns return `` `${fecEmi} ${horEmi}` `` from `accessorFn` and format for display in `cell`.
- `type: "number"` — accessors return `Number(...).toFixed(2)` strings, which the exporter reparses. Because they are strings, `DataTableTotal` (which only sums `typeof value === "number"`) does not total them.

### Sello lookup

The reception seal isn't at a stable path: emitters use a top-level key matching `/sello/i` (`selloRecibido`, `SelloRecepcion`, …) or, for CCF, an `apendice[]` entry whose `etiqueta` matches. Read it through the per-format helper in `src/utils/selloSupport.ts` (`obtenerValorSelloForCCF` / `ForCCFT` / `ForDCL`), never a direct property access.

## Conventions

- shadcn/ui (new-york style, zinc base) in `src/components/ui`, configured in `components.json`. Add components with the shadcn CLI; app-specific composites go in `src/components` or `src/partials`.
- `@/*` aliases `src/*` (in both `tsconfig.app.json` and `vite.config.ts`).
- Tabs, double quotes, semicolons — match surrounding files.
- `tsconfig.app.json` has `strict`, `noUnusedLocals`, `noUnusedParameters`; unused imports/params fail the build. Avoid `any`.
- Keep changes small; don't rename files or public APIs (including existing typos like `uppload-section.tsx`) without asking. Don't touch `pnpm-lock.yaml` unless necessary.
