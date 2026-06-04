// components/cars/form/ImageUploadSection.jsx
import { useRef, useState } from "react";
import { Image, Images  } from "lucide-react";

const UploadBox = ({ label, required, preview, onSelect, onRemove, multiple = false, hint }) => {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = multiple ? Array.from(e.dataTransfer.files) : [e.dataTransfer.files[0]];
    onSelect(multiple ? files : files[0]);
  };

  const boxStyle = {
    border: `2px dashed ${dragging ? "var(--color-red-500)" : "var(--color-border)"}`,
    borderRadius: "var(--radius-md)",
    background: dragging ? "var(--color-error-bg)" : "var(--color-bg-input)",
    padding: "var(--space-4)",
    cursor: "pointer",
    transition: "border-color var(--transition-fast), background var(--transition-fast)",
    textAlign: "center",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <label style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)", color: "var(--color-text-secondary)" }}>
        {label}
        {required && <span style={{ color: "var(--color-red-500)", marginLeft: "2px" }}>*</span>}
      </label>

      <div
        style={boxStyle}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {!multiple && preview ? (
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={preview}
              alt="cover"
              style={{
                width: "100%",
                maxHeight: "140px",
                objectFit: "cover",
                borderRadius: "var(--radius-sm)",
              }}
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              style={{
                position: "absolute",
                top: "6px",
                right: "6px",
                background: "var(--color-red-600)",
                border: "none",
                borderRadius: "var(--radius-full)",
                color: "#fff",
                width: "22px",
                height: "22px",
                cursor: "pointer",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>
        ) : !multiple ? (
          <div>
            <div style={{ fontSize: "24px", marginBottom: "var(--space-2)" }}><Image size={20} /></div>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
              Glisser ou cliquer pour ajouter
            </p>
          </div>
        ) : null}

        {multiple && preview?.length > 0 ? (
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
              {preview.map((src, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img
                    src={src}
                    alt={`gallery-${i}`}
                    style={{
                      width: "64px",
                      height: "64px",
                      objectFit: "cover",
                      borderRadius: "var(--radius-sm)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onRemove(i); }}
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-6px",
                      background: "var(--color-red-600)",
                      border: "none",
                      borderRadius: "var(--radius-full)",
                      color: "#fff",
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                      fontSize: "10px",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
              Cliquer pour ajouter d'autres images
            </p>
          </div>
        ) : multiple ? (
          <div>
            <div style={{ fontSize: "24px", marginBottom: "var(--space-2)"  }}><Images size={20} /></div>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
              Glisser ou cliquer (plusieurs images)
            </p>
          </div>
        ) : null}
      </div>

      {hint && (
        <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{hint}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        multiple={multiple}
        style={{ display: "none" }}
        onChange={(e) => {
          const files = multiple ? Array.from(e.target.files) : e.target.files[0];
          onSelect(files);
        }}
      />
    </div>
  );
};

const ImageUploadSection = ({
  coverFile, coverPreview, onCoverSelect, onCoverRemove,
  galleryFiles, galleryPreviews, onGallerySelect, onGalleryRemove,
  isEditing, existingCoverUrl,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>

      {/* Cover image */}
      <UploadBox
        label="Image de couverture"
        required={!isEditing}
        preview={coverPreview || (isEditing && existingCoverUrl ? existingCoverUrl : null)}
        onSelect={onCoverSelect}
        onRemove={onCoverRemove}
        hint={isEditing ? "Laisser vide pour conserver l'image actuelle" : "JPEG / PNG — max 2 Mo"}
      />

      {/* Gallery */}
      <UploadBox
        label="Galerie d'images"
        multiple
        preview={galleryPreviews}
        onSelect={onGallerySelect}
        onRemove={onGalleryRemove}
        hint="Optionnel — JPEG / PNG — max 2 Mo chacune"
      />
    </div>
  );
};

export default ImageUploadSection;