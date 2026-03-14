// src/components/icons/Mail.jsx
const Mail = ({ width = 15, height = 15, stroke = "currentColor", className }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth="1.5"
    className={className}
    role="img"
    aria-label="Mail icon"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 7 10 7 10-7" />
  </svg>
);

export default Mail;