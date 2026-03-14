// src/components/icons/ArrowLeft.jsx
const ArrowLeft = ({ width = 14, height = 14, stroke = "currentColor", className }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth="2"
    className={className}
    role="img"
    aria-label="Arrow left icon"
  >
    <path d="M19 12H5M5 12l7 7M5 12l7-7" />
  </svg>
);

export default ArrowLeft;