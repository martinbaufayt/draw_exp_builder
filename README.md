# draw-advanced — ArcGIS Experience Builder Widget

A feature-rich drawing widget for [ArcGIS Experience Builder](https://developers.arcgis.com/experience-builder/) that extends native drawing capabilities with advanced geometry tools, live measurements, coordinate display, and data management.

> [!NOTE]
> This repository is a personal project used to explore GitHub workflows and Claude Code capabilities. It is based on an open-source widget originally developed by the community.
>
> **Original authors:** Robert Scheitlin, Jeffrey Thompson, Brian McLeer, Adrien Hoff, Mattias Ekström, Jérôme Ray

---

## Features

### Drawing tools

| Tool | Description |
|---|---|
| Point | Single marker |
| Polyline | Multi-segment line with optional arrowheads |
| Freehand polyline | Smooth hand-drawn line |
| Rectangle | Axis-aligned bounding rectangle |
| Polygon | Multi-sided polygon |
| Freehand polygon | Smooth hand-drawn polygon |
| Circle | Radius-based circle |
| Text | Annotation with full font control |

### Measurements

- Area, perimeter, length, and radius with configurable units (km, mi, m, NM, ft, yd; km², mi², ac, ha, m², ft², yd²)
- Per-segment length labels on polylines
- Draggable measurement labels
- **Live tooltip during drawing** *(branch: `feature/live-drawing-tooltip`)*
  - Circle → radius in nautical miles, updated in real time as you drag
  - Rectangle → width and height in metres/km
  - Polygon → current segment length in metres/km
  - Disappears automatically when the shape is completed

### Coordinate display

- Center coordinates shown on measurement labels for circles and rectangles
- WGS84 `Lon(X)/Lat(Y)` with native-CRS fallback

### Shape info popup *(branch: `feature/shape-info-popup`)*

Click any drawn shape after it is completed to open an information panel showing:

- **Center coordinates** in four formats: Decimal Degrees (DD), Degrees Minutes Seconds (DMS), Degrees Decimal Minutes (DDM), and MGRS
- **Area** and **perimeter** for polygons and rectangles (auto-scaled to m², ha, or km²)
- **Radius** in nautical miles for circles

Closes on outside click, `Escape`, or when a new drawing tool is activated.

### Symbology

- Point: simple marker and picture marker symbols
- Line: stroke color, width, style, and optional arrowheads (start/end/both)
- Polygon: fill color and stroke
- Text: font family, size, weight, style, color, halo, opacity, alignment, rotation

### Data management

- **My Drawings panel** — list, rename, reorder, and edit symbology for all drawn graphics
- **Export** — Shapefile (`.zip`) or GeoJSON
- **Import** — from any feature layer, graphics layer, GeoJSON layer, or CSV layer in the map
- **Copy/Paste** — copy features from any visible map layer into the drawing layer
- **Undo/Redo** — full history stack

### Other

- **Buffer zones** — configurable distance and unit around any geometry
- **Snapping** — feature snapping per layer with grid controls
- **Storage scope** — persist drawings per-app or globally across all apps (configurable in ExB settings)
- **Section 508 / WCAG 2.1 AA** compliant measurement overlay

---

## Requirements

- ArcGIS Experience Builder **1.17+**
- An ArcGIS Online or ArcGIS Enterprise account to run Experience Builder

---

## Installation

1. Copy (or symlink) the `draw-advanced` folder into your Experience Builder extensions directory:

   ```
   <ExB root>/client/your-extensions/widgets/draw-advanced
   ```

2. Start the ExB dev server from the ExB root:

   ```bash
   npm start
   ```

3. Open the Experience Builder app in your browser, add the **draw-advanced** widget to your experience, and configure the target map widget in the settings panel.

> [!NOTE]
> The widget has no standalone build step — it compiles as part of ExB's webpack pipeline.

---

## Architecture

```
draw-advanced/
├── manifest.json               # Widget metadata (ExB registry)
├── config.json                 # Default configuration
└── src/
    ├── config.ts               # Shared types: Config, DrawMode, StorageScope
    ├── runtime/
    │   ├── widget.tsx          # Main class component (~6 500 lines)
    │   ├── widget.css          # Static styles
    │   ├── lib/style.ts        # CSS-in-JS (jimu-core)
    │   ├── translations/       # i18n strings
    │   └── components/
    │       ├── measure.tsx          # Live measurement overlay
    │       ├── DrawingTooltip.tsx   # Cursor tooltip during sketch
    │       ├── ShapeInfoPopup.tsx   # Post-draw info popup
    │       ├── BufferControls.tsx   # Buffer zone UI
    │       ├── MyDrawingsPanel.tsx  # Drawings list + export
    │       ├── SnappingControls.tsx # Snapping + grid controls
    │       └── TextStyleEditor.tsx  # Text symbol editor
    └── setting/
        └── setting.tsx         # ExB configuration panel
```

Key ArcGIS JS SDK APIs: `SketchViewModel`, `GraphicsLayer`, `geometryEngine` / `geometryEngineAsync`, `coordinateFormatter`, `projectOperator`.

---

## Branch overview

| Branch | Description |
|---|---|
| `main` | Baseline widget with all core drawing and measurement features |
| `add_polygons_coordinates` | Adds center coordinates display (WGS84 Lon/Lat) on measurement labels |
| `feature/live-drawing-tooltip` | Adds real-time tooltip showing radius/segment length while drawing |
| `feature/shape-info-popup` | Adds click popup with DD/DMS/DDM/MGRS coordinates and measurements |

---

## Development notes

- No unit tests — manual testing via the ExB dev server.
- ESRI imports: both `esri/…` (AMD) and `@arcgis/core/…` (ESM) styles are valid; prefer `@arcgis/core/` for new code.
- `IMConfig` is a `seamless-immutable` object — use `.set(key, value)` to update it; never mutate directly.
- `widget.tsx` uses `/** @jsx jsx */` + `jsx` from `jimu-core` for ExB theming.
- User-facing strings live in `src/runtime/translations/default.ts`; reference them via `this.nls('key')`.
