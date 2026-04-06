const BellIcon = ({ 
  width = 24, 
  height = 24, 
  stroke = "currentColor", 
  fill = "none", 
  className 
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role="img"
    aria-label="Icône de notification Bell"
  >
    {/* Corps de la cloche */}
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    
    {/* Le battant (le petit rond en bas) */}
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    
    {/* Optionnel: Petit point de notification stylisé si tu ne veux pas utiliser le span rouge */}
    {/* <circle cx="18" cy="6" r="3" fill="var(--color-red-500)" stroke="none" /> */}
  </svg>
);

export default BellIcon;