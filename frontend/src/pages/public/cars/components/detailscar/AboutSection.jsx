const PERKS = [
  {
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    label: "Protection Totale",
    desc: "Assurance tous risques incluse par défaut.",
  },
  {
    icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z",
    label: "Livraison Flexible",
    desc: "À l'aéroport ou directement à votre hôtel.",
  },
  {
    icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2",
    label: "Kilométrage Illimité",
    desc: "Explorez tout le Maroc sans contrainte.",
  },
];

export default function AboutSection({ description }) {
  return (
    <div className="about-section">
      <h3 className="about-section__title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
        À propos de ce véhicule
      </h3>

      <p className="about-section__text">
        {description || "Découvrez le luxe raffiné et les performances de ce véhicule d'exception. Idéal pour vos déplacements professionnels ou vos escapades au Maroc."}
      </p>

      <div className="about-section__perks">
        {PERKS.map(({ icon, label, desc }) => (
          <div className="about-section__perk" key={label}>
            <div className="about-section__perk-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={icon} />
              </svg>
            </div>
            <span className="about-section__perk-label">{label}</span>
            <span className="about-section__perk-desc">{desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}