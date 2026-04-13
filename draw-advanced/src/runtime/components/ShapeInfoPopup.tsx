import React, { useEffect, useRef } from 'react';

export interface ShapeInfoData {
  shapeType: string; // 'circle' | 'extent' | 'polygon' | 'freepolygon' | 'point' | 'polyline' | ...
  dd: string;
  dms: string;
  ddm: string;
  mgrs: string;
  // Polygon / rectangle
  areaSqM?: number;
  perimeterM?: number;
  // Circle
  radiusNM?: number;
  radiusM?: number;
}

interface ShapeInfoPopupProps {
  open: boolean;
  data: ShapeInfoData | null;
  screenX: number;
  screenY: number;
  onClose: () => void;
}

const PANEL_WIDTH = 280;
const PANEL_HEIGHT_APPROX = 220;
const OFFSET = 16;

function clampPosition(x: number, y: number): { left: number; top: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let left = x + OFFSET;
  let top = y + OFFSET;
  if (left + PANEL_WIDTH > vw - 8) left = x - PANEL_WIDTH - OFFSET;
  if (left < 8) left = 8;
  if (top + PANEL_HEIGHT_APPROX > vh - 8) top = y - PANEL_HEIGHT_APPROX - OFFSET;
  if (top < 8) top = 8;
  return { left, top };
}

function formatArea(sqM: number): string {
  if (sqM >= 1_000_000) return (sqM / 1_000_000).toFixed(3) + ' km²';
  if (sqM >= 10_000) return (sqM / 10_000).toFixed(2) + ' ha';
  return Math.round(sqM) + ' m²';
}

function formatDist(m: number): string {
  if (m >= 1000) return (m / 1000).toFixed(3) + ' km';
  return Math.round(m) + ' m';
}

function shapeLabel(type: string): string {
  switch (type) {
    case 'circle': return 'Circle';
    case 'extent': return 'Rectangle';
    case 'polygon': return 'Polygon';
    case 'freepolygon': return 'Freehand Polygon';
    case 'point': return 'Point';
    case 'polyline': return 'Line';
    case 'freepolyline': return 'Freehand Line';
    default: return type;
  }
}

const ShapeInfoPopup: React.FC<ShapeInfoPopupProps> = ({ open, data, screenX, screenY, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Delay so the click that opened it doesn't immediately close it
    const timerId = setTimeout(() => document.addEventListener('mousedown', handler), 100);
    return () => {
      clearTimeout(timerId);
      document.removeEventListener('mousedown', handler);
    };
  }, [open, onClose]);

  if (!open || !data) return null;

  const { left, top } = clampPosition(screenX, screenY);

  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    left,
    top,
    width: PANEL_WIDTH,
    backgroundColor: '#1e1e1e',
    color: '#e8e8e8',
    borderRadius: '6px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.55)',
    zIndex: 10000,
    fontFamily: "'Avenir Next LT Pro', Arial, sans-serif",
    fontSize: '12px',
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 10px 6px',
    backgroundColor: '#2d2d2d',
    borderBottom: '1px solid #444',
    fontWeight: 600,
    fontSize: '12px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  };

  const closeBtnStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: '#aaa',
    cursor: 'pointer',
    fontSize: '14px',
    lineHeight: 1,
    padding: '0 2px',
  };

  const sectionStyle: React.CSSProperties = {
    padding: '8px 10px',
    borderBottom: '1px solid #333',
  };

  const labelStyle: React.CSSProperties = {
    color: '#888',
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '4px',
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '3px',
  };

  const keyStyle: React.CSSProperties = {
    color: '#aaa',
    minWidth: '36px',
    flexShrink: 0,
  };

  const valStyle: React.CSSProperties = {
    color: '#e8e8e8',
    fontFamily: 'monospace',
    fontSize: '11px',
    textAlign: 'right',
    wordBreak: 'break-all',
  };

  const showCoordinates = ['circle', 'extent', 'point'].includes(data.shapeType);

  const hasMeasures =
    data.areaSqM !== undefined ||
    data.perimeterM !== undefined ||
    data.radiusNM !== undefined;

  return (
    <div ref={panelRef} style={panelStyle} role="dialog" aria-label="Shape information">
      {/* Header */}
      <div style={headerStyle}>
        <span>{shapeLabel(data.shapeType)}</span>
        <button style={closeBtnStyle} onClick={onClose} aria-label="Close shape info">×</button>
      </div>

      {/* Coordinates — only for circle, rectangle, point */}
      {showCoordinates && (
        <div style={sectionStyle}>
          <div style={labelStyle}>Center coordinates</div>
          <div style={rowStyle}>
            <span style={keyStyle}>DD</span>
            <span style={valStyle}>{data.dd}</span>
          </div>
          <div style={rowStyle}>
            <span style={keyStyle}>DMS</span>
            <span style={valStyle}>{data.dms}</span>
          </div>
          <div style={rowStyle}>
            <span style={keyStyle}>DDM</span>
            <span style={valStyle}>{data.ddm}</span>
          </div>
          <div style={rowStyle}>
            <span style={keyStyle}>MGRS</span>
            <span style={valStyle}>{data.mgrs}</span>
          </div>
        </div>
      )}

      {/* Measures */}
      {hasMeasures && (
        <div style={{ ...sectionStyle, borderBottom: 'none' }}>
          <div style={labelStyle}>Measurements</div>
          {data.areaSqM !== undefined && (
            <div style={rowStyle}>
              <span style={keyStyle}>Area</span>
              <span style={valStyle}>{formatArea(data.areaSqM)}</span>
            </div>
          )}
          {data.perimeterM !== undefined && (
            <div style={rowStyle}>
              <span style={keyStyle}>Perim.</span>
              <span style={valStyle}>{formatDist(data.perimeterM)}</span>
            </div>
          )}
          {data.radiusNM !== undefined && (
            <div style={rowStyle}>
              <span style={keyStyle}>Radius</span>
              <span style={valStyle}>
                {data.radiusNM < 0.01
                  ? formatDist(data.radiusM ?? 0)
                  : data.radiusNM.toFixed(3) + ' NM'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShapeInfoPopup;
