import React from 'react';

interface DrawingTooltipProps {
  visible: boolean;
  x: number;
  y: number;
  text: string;
}

const DrawingTooltip: React.FC<DrawingTooltipProps> = ({ visible, x, y, text }) => {
  if (!visible || !text) return null;

  return (
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
        zIndex: 9999,
        whiteSpace: 'nowrap',
        userSelect: 'none',
        letterSpacing: '0.02em',
      }}
    >
      {text}
    </div>
  );
};

export default DrawingTooltip;
