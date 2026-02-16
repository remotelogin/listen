import type { CSSProperties } from "react";

export const controlPanelStyle: CSSProperties = {
	position: 'fixed',
	bottom: '1.25em',
	right: '1.25em',
	padding: '0.75em 1em',
	borderRadius: '12px',
	background: 'linear-gradient(145deg, #1f2937, #111827)',
	boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: '0.25em',
	backdropFilter: 'blur(6px)',
	border: '1px solid rgba(255,255,255,0.06)'
};

export const panelHeader: CSSProperties = {
	fontSize: '0.75rem',
	textTransform: 'uppercase',
	letterSpacing: '0.06em',
	color: '#9ca3af',
	marginBottom: '0.25em'
};

export const floatingPanel: CSSProperties = {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  padding: '12px 14px',
  borderRadius: '14px',
  background: 'linear-gradient(180deg, #1b1f2a, #151821)',
  boxShadow: '0 10px 28px rgba(0,0,0,0.45)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  backdropFilter: 'blur(6px)',
  border: '1px solid rgba(255,255,255,0.06)',
  zIndex: 9999,
};

export const floatingPanelLabel: CSSProperties = {
  fontSize: '0.7rem',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: '#9ca3af',
};
