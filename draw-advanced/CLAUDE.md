# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development

This widget has no standalone `package.json`. Build and hot-reload are handled by the parent **ArcGIS Experience Builder** installation. To develop:

1. Copy (or symlink) the `draw-advanced` folder into `<ExB root>/client/your-extensions/widgets/`
2. Start the ExB dev server from the ExB root: `npm start`
3. The widget compiles as part of ExB's webpack pipeline — no separate build step.

There are no unit tests in this widget.

## Architecture

**Entry points:**
- `src/config.ts` — Shared config types: `Config` interface, `DrawMode` enum (`SINGLE | CONTINUOUS | UPDATE`), `StorageScope` enum (`APP_SPECIFIC | GLOBAL`).
- `src/runtime/widget.tsx` — Main widget (large class component, ~6500+ lines). Contains the full draw toolbar, symbol editors, copy/paste logic, and tab management.
- `src/setting/setting.tsx` — ExB settings panel (class component). Configures draw mode, units, storage scope, and layer title.

**Sub-components (`src/runtime/components/`):**
- `BufferControls.tsx` — Buffer zone controls. Manages buffer graphics, leader lines, and labels as separate graphics on the draw layer. Uses `geometryEngineAsync`.
- `MyDrawingsPanel.tsx` — "My Drawings" panel: graphic list, symbol editing, selection, export (Shapefile via `@mapbox/shp-write` + `JSZip`, GeoJSON). Imports from map layers are also supported.
- `SnappingControls.tsx` — Snapping toggle (feature snapping per layer) + grid controls (`GridControls` from `@arcgis/core`).
- `measure.tsx` — Measurement display overlay (area, length, coordinates). Fully Section 508 / WCAG 2.1 AA compliant.
- `TextStyleEditor.tsx` — Extracted text symbol editor (font, color, halo, alignment). Used inside `MyDrawingsPanel` for inline text editing.

**Styling:** `src/runtime/lib/style.ts` — CSS-in-JS via `jimu-core`'s `css` tagged template. `widget.css` for additional static styles.

**Translations:** `src/runtime/translations/default.ts` — All user-facing strings. Add new keys here when adding UI text.

## Key Conventions

**JSX pragma:** `widget.tsx` uses `/** @jsx jsx */` + `jsx` from `jimu-core` (required for ExB theming). Sub-components use standard React JSX.

**ESRI imports:** The codebase mixes two import styles — both are valid in ExB:
- `esri/...` (AMD-style, e.g. `import Graphic from 'esri/Graphic'`)
- `@arcgis/core/...` (ESM-style, e.g. `import Color from '@arcgis/core/Color'`)

Prefer `@arcgis/core/` for new code, but don't refactor existing `esri/` imports unnecessarily.

**Immutable config:** `IMConfig` is a `seamless-immutable` object. Use `.set(key, value)` to update config in settings; never mutate directly.

**Extended graphics:** Custom properties (`isBufferDrawing`, `sourceGraphicId`, `bufferGraphic`, `measure`, `measureParent`, `bufferSettings`, `_selectionOverlay`) are attached directly to `Graphic` objects via the `ExtendedGraphic` interface defined locally in each file that needs it.

**State shape:** The main `States` interface in `widget.tsx` is large (~60+ fields). When adding features, add state fields there and initialize them in the class constructor.

## Repository

GitHub: https://github.com/martinbaufayt/draw_exp_builder
Active branch: `add_polygons_coordinates`

## Adding New Features

- New draw tool buttons → add to `currentTool` union type in `States`, add state booleans for `active`, and wire into `SketchViewModel`.
- New config option → add to `Config` in `config.ts`, update `setting.tsx` UI, handle in `widget.tsx`.
- New translation string → add to `src/runtime/translations/default.ts` and reference via `this.nls('key')` in class components or the `useIntl` hook equivalent in functional components.
