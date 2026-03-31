# draw_exp_builder

A custom draw widget for ArcGIS Experience Builder.

> **Note:** This repository is a personal project used to explore GitHub workflows and Claude Code capabilities. It is based on an open-source widget originally developed by the community.

## Original Authors

Robert Scheitlin, Jeffrey Thompson, Brian McLeer, Adrien Hoff, Mattias Ekström, Jérôme Ray

## Overview

`draw-advanced` is a TypeScript/React widget for ArcGIS Experience Builder that extends the native drawing capabilities with advanced geometry tools, measurement display, and data management features.

## Features

- **Draw tools** — Point, polyline, freehand polyline, rectangle, polygon, freehand polygon, circle, text
- **Measurements** — Area, perimeter, length, radius, segment lengths, with configurable units (km, mi, m, NM, ft, yd and equivalents for area)
- **Coordinates display** — For circle and rectangle drawings, optionally display:
  - `Lon(X)/Lat(Y)` of the center point (WGS84)
  - `X/Y` fallback in the map's native projection
- **Symbol editor** — Full control over fill, stroke, font, halo, opacity, rotation, text alignment
- **Snapping** — Feature snapping per layer + grid controls
- **Buffer zones** — Draw a buffer around any geometry with configurable distance and unit
- **My Drawings panel** — List, edit, select, and export drawings (Shapefile, GeoJSON), or import from map layers
- **Copy/Paste** — Copy features from any map layer into the drawing layer
- **Undo/Redo** — Full history support
- **Storage scope** — Drawings can be persisted per-app or globally across apps

## Branch: `add_polygons_coordinates`

This branch introduces the **coordinates display feature** for polygon measurements:

| Change | Detail |
|---|---|
| New checkbox in Measurements panel | "Coordinates" — visible when circle or rectangle is active |
| Center coordinates on label | Displays `Lon(X)/Lat(Y): x, y` on the drawn shape (WGS84 projection) |
| Fallback | Displays `X/Y: x, y` in the map's native CRS if WGS84 projection fails |

## Installation

1. Copy the `draw-advanced` folder into your Experience Builder extensions directory:
   ```
   <ExB root>/client/your-extensions/widgets/draw-advanced
   ```
2. Start the ExB dev server from the ExB root:
   ```bash
   npm start
   ```
3. The widget is compiled as part of ExB's webpack pipeline — no separate build step required.

## Requirements

- ArcGIS Experience Builder 1.17+
- `jimu-arcgis` dependency (declared in `manifest.json`)
