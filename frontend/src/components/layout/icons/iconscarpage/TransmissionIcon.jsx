const TransmissionIcon = ({ width = 20, height = 20, stroke = "currentColor", className }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="3" />
    <path d="M16 12h3" />
    <path d="M5 12h3" />
    <path d="M12 5v3" />
    <path d="M12 16v3" />
    <path d="M14.8 14.8l2.1 2.1" />
    <path d="M7.1 7.1l2.1 2.1" />
    <path d="M14.8 9.2l2.1-2.1" />
    <path d="M7.1 16.9l2.1-2.1" />
  </svg>
);
export default TransmissionIcon;