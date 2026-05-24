import { useState } from "react";

export default function ImageGallery({ coverImage, gallery = [], year }) {
  const [active, setActive] = useState(0);

  // Build list: cover first, then the rest (excluding cover duplicates)
  const images = gallery.length > 0
    ? gallery.map(g => g.url)
    : coverImage
    ? [coverImage]
    : [];

  const displayed = images[active] || coverImage;

  // Fill to 4 slots
  const thumbSlots = [...images, null, null, null, null].slice(0, 4);

  return (
    <div className="image-gallery">
      {/* Main image */}
      <div className="image-gallery__main">
        {displayed ? (
          <img src={displayed} alt="Voiture" loading="lazy" />
        ) : (
          <div style={{ background: "var(--color-bg-card)", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--color-border)" strokeWidth="1">
              <rect x="2" y="7" width="20" height="13" rx="2" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </div>
        )}
        <span className="image-gallery__badge">Luxe Premium</span>
        {year && <span className="image-gallery__year">{year}</span>}
      </div>

      {/* Thumbnails */}
      <div className="image-gallery__thumbs">
        {thumbSlots.map((url, i) =>
          url ? (
            <div
              key={i}
              className={`image-gallery__thumb${active === i ? " image-gallery__thumb--active" : ""}`}
              onClick={() => setActive(i)}
            >
              <img src={url} alt={`Vue ${i + 1}`} loading="lazy" />
            </div>
          ) : (
            <div key={i} className="image-gallery__thumb image-gallery__thumb--empty">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
          )
        )}
      </div>
    </div>
  );
}