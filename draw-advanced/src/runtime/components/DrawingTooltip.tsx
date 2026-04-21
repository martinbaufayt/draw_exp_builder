import React from 'react';
import ReactDOM from 'react-dom';

interface DrawingTooltipProps {
  visible: boolean;
  x: number;
  y: number;
  text: string;
}

function getOverlayRoot(): HTMLElement {
  let root = document.getElementById('draw-widget-overlay-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'draw-widget-overlay-root';
    // position:relative creates a stacking context at z-index max,
    // ensuring children beat any ExB or ArcGIS layers stacking context.
    root.style.cssText = 'position:relative;z-index:2147483647;pointer-events:none;';
    document.body.appendChild(root);
  }
  return root;
}

const DrawingTooltip: React.FC<DrawingTooltipProps> = ({ visible, x, y, text }) => {
  if (!visible || !text) return null;

  return ReactDOM.createPortal(
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: x + 14,
        top: y - 30,
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        color: '#ffffff',
        padding: '3px 8px',
        borderRadius: '3px',
        fontSize: '12px',
        fontFamily: "'Avenir Next LT Pro', Arial, sans-serif",
        fontWeight: 500,
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        letterSpacing: '0.02em',
      }}
    >
      {text}
    </div>,
    getOverlayRoot()
  );
};

export default DrawingTooltip;
