// src/components/layout/icons/Check.jsx
const Check = ({ width = 9, height = 9, stroke = "white", className }) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth="3"
        className={className}
        role="img"
        aria-label="Check icon"
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export default Check;
