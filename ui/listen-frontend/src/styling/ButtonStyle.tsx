import type { CSSProperties } from "react";

export const pulseAnimation = `
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(230, 57, 70, 0.7);
  }
  50% {
    box-shadow: 0 0 20px 10px rgba(230, 57, 70, 0.5);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(230, 57, 70, 0.7);
  }
}`;

export const floatingButton: CSSProperties = {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  border: 'none',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '0.9rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  transition: 'background 0.3s ease',
  overflow: 'hidden',
};

export const floatingButtonInner: CSSProperties = {
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  border: 'none',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '0.9rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  transition: 'background 0.3s ease',
};

export const progressContainer: CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  height: '4px',
  background: '#fff3',
};

export const buttonColors = {
  on: '#e63946',
  off: '#457b9d',
};
