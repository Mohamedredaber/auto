// src/components/layout/icons/ArrowRight.jsx
const ArrowRight = ({ width = 14, height = 14, stroke = "currentColor", className }) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        className={className}
        role="img"
        aria-label="Arrow right icon"
    >
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

export default ArrowRight;
