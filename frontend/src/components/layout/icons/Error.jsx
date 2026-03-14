// src/components/layout/icons/Error.jsx
const Error = ({ width = 11, height = 11, stroke = "currentColor", className }) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        className={className}
        role="img"
        aria-label="Error icon"
    >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <circle cx="12" cy="16" r=".5" fill="currentColor" />
    </svg>
);

export default Error;
