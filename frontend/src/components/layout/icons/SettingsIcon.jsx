const SettingsIcon = ({ width = 20, height = 20, stroke = "currentColor", className }) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={stroke} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2a2 2 0 0 1-2 2a2 2 0 0 0-2 2l-.31.31a2 2 0 0 0 0 2.83l.31.31a2 2 0 0 1 0 2.83l-.31.31a2 2 0 0 0 0 2.83l.31.31a2 2 0 0 0 2.83 0l.31-.31a2 2 0 0 1 2.83 0l.31.31a2 2 0 0 0 2.83 0l.31-.31a2 2 0 0 1 2.83 0l.31.31a2 2 0 0 0 2.83 0l.31-.31a2 2 0 0 0 0-2.83l-.31-.31a2 2 0 0 1 0-2.83l.31-.31a2 2 0 0 0 0-2.83l-.31-.31a2 2 0 0 0-2.83 0l-.31.31a2 2 0 0 1-2.83 0l-.31-.31a2 2 0 0 0-2.83 0l-.31.31a2 2 0 0 1 0 2.83" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
export default SettingsIcon;