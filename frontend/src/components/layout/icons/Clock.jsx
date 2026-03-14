// src/components/layout/icons/Clock.jsx
const Clock = ({ width = 15, height = 15, stroke = "currentColor", className }) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        className={className}
        role="img"
        aria-label="Clock icon"
    >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

export default Clock;
