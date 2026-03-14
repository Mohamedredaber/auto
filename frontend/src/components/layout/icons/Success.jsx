// src/components/layout/icons/Success.jsx
const Success = ({ width = 30, height = 30, stroke = "#10B981", className }) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        className={className}
        role="img"
        aria-label="Success icon"
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export default Success;
