// src/components/layout/icons/Building.jsx
const Building = ({ width = 15, height = 15, stroke = "currentColor", className }) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        className={className}
        role="img"
        aria-label="Building icon"
    >
        <rect x="3" y="7" width="18" height="14" rx="2" />
        <path d="M8 7V5a4 4 0 0 1 8 0v2" />
    </svg>
);

export default Building;
