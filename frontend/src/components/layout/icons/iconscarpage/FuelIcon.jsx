const FuelIcon = ({ width = 20, height = 20, stroke = "currentColor", className }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="3" y1="22" x2="15" y2="22" />
    <path d="M4 9h11" />
    <path d="M14 22V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v18" />
    <path d="M18 22V15a2 2 0 0 1 2-2 2 2 0 0 0 2-2V7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v1.2" />
  </svg>
);
export default FuelIcon;