// src/components/icons/User.jsx
const User = ({ width = 22, height = 22, stroke = "currentColor", className }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth="1.5"
    className={className}
    role="img"
    aria-label="User icon"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

export default User;