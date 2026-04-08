// components/cars/form/CarFormModal.jsx
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsFormOpen,
  selectFormMode,
  selectSingleCar,
  selectCarLoading,
  selectCarErrors,
  selectIsEditing,
} from "../../../../features/agency/carSelectors";
import { closeModals, clearErrors } from "../../../../features/agency/carSlice";
import { createCarThunk, updateCarThunk } from "../../../../features/agency/carThunks";
import CarFormFields from "./CarFormFields";
import ImageUploadSection from "./ImageUploadSection";
import FormErrorAlert from "./FormErrorAlert";

// ─── Initial form state ───────────────────────────────────────────────────────
const INITIAL_DATA = {
  brand: "",
  model: "",
  category: "",
  year: new Date().getFullYear(),
  transmission: "",
  fuel: "",
  seats: 5,
  doors: 4,
  price_per_day: "",
  status: "available",
  additional_information: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const buildFormData = (fields, coverFile, galleryFiles) => {
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== "") fd.append(k, v);
  });
  if (coverFile) fd.append("cover_image", coverFile);
  galleryFiles.forEach((file) => fd.append("images[]", file));
  return fd;
};

const fileToPreview = (file) => URL.createObjectURL(file);

// ─── Component ────────────────────────────────────────────────────────────────
const CarFormModal = () => {
  const dispatch = useDispatch();
  const isOpen    = useSelector(selectIsFormOpen);
  const isEditing = useSelector(selectIsEditing);
  const car       = useSelector(selectSingleCar);
  const isLoading = useSelector(selectCarLoading);
  const errors    = useSelector(selectCarErrors);

  const [formData, setFormData]           = useState(INITIAL_DATA);
  const [coverFile, setCoverFile]         = useState(null);
  const [coverPreview, setCoverPreview]   = useState(null);
  const [galleryFiles, setGalleryFiles]   = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  // ── Populate form when editing ─────────────────────────────────────────────
  useEffect(() => {
    if (isEditing && car) {
      setFormData({
        brand:                  car.brand                  ?? "",
        model:                  car.model                  ?? "",
        category:               car.category               ?? "",
        year:                   car.year                   ?? new Date().getFullYear(),
        transmission:           car.transmission            ?? "",
        fuel:                   car.fuel                   ?? "",
        seats:                  car.seats                  ?? 5,
        doors:                  car.doors                  ?? 4,
        price_per_day:          car.price_per_day          ?? "",
        status:                 car.status                 ?? "available",
        additional_information: car.additional_information ?? "",
      });
    } else {
      setFormData(INITIAL_DATA);
    }
    // Reset images on every open
    setCoverFile(null);
    setCoverPreview(null);
    setGalleryFiles([]);
    setGalleryPreviews([]);
  }, [isOpen, isEditing, car]);

  // ── Cleanup object URLs ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      galleryPreviews.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [coverPreview, galleryPreviews]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleFieldChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleCoverSelect = useCallback((file) => {
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(fileToPreview(file));
  }, []);

  const handleCoverRemove = useCallback(() => {
    setCoverFile(null);
    setCoverPreview(null);
  }, []);

  const handleGallerySelect = useCallback((files) => {
    const arr = Array.isArray(files) ? files : [files];
    setGalleryFiles((prev) => [...prev, ...arr]);
    setGalleryPreviews((prev) => [...prev, ...arr.map(fileToPreview)]);
  }, []);

  const handleGalleryRemove = useCallback((index) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleClose = () => {
    dispatch(clearErrors());
    dispatch(closeModals());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = buildFormData(formData, coverFile, galleryFiles);

    if (isEditing) {
      // Laravel needs _method spoofing for PUT with FormData
      fd.append("_method", "PUT");
      const result = await dispatch(updateCarThunk({ id: car.id, formData: fd }));
      if (!result.error) handleClose();
    } else {
      const result = await dispatch(createCarThunk(fd));
      if (!result.error) handleClose();
    }
  };

  if (!isOpen) return null;

  // ── Styles ─────────────────────────────────────────────────────────────────
  const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "var(--color-bg-overlay)",
    zIndex: "var(--z-modal)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "var(--space-6) var(--space-4)",
    overflowY: "auto",
  };

  const modalStyle = {
    background: "var(--color-bg-card)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-xl)",
    width: "100%",
    maxWidth: "720px",
    boxShadow: "var(--shadow-xl)",
    overflow: "hidden",
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "var(--space-5) var(--space-6)",
    borderBottom: "1px solid var(--color-border)",
    background: "var(--color-bg-secondary)",
  };

  const badgeStyle = {
    fontSize: "var(--text-xs)",
    fontWeight: "var(--weight-semibold)",
    padding: "3px 10px",
    borderRadius: "var(--radius-full)",
    background: isEditing ? "var(--color-info-bg)" : "var(--color-success-bg)",
    color: isEditing ? "var(--color-info)" : "var(--color-success)",
    border: `1px solid ${isEditing ? "var(--color-info)" : "var(--color-success)"}`,
    textTransform: "uppercase",
    letterSpacing: "var(--tracking-wider)",
  };

  const closeBtnStyle = {
    background: "none",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--color-text-muted)",
    width: "32px",
    height: "32px",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all var(--transition-fast)",
  };

  const bodyStyle = {
    padding: "var(--space-6)",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "var(--space-6)",
  };

  const footerStyle = {
    padding: "var(--space-4) var(--space-6)",
    borderTop: "1px solid var(--color-border)",
    background: "var(--color-bg-secondary)",
    display: "flex",
    justifyContent: "flex-end",
    gap: "var(--space-3)",
  };

  const cancelBtnStyle = {
    background: "none",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--color-text-secondary)",
    padding: "var(--space-2) var(--space-5)",
    cursor: "pointer",
    fontSize: "var(--text-sm)",
    fontFamily: "var(--font-body)",
    transition: "all var(--transition-fast)",
  };

  const submitBtnStyle = {
    background: "var(--gradient-red)",
    border: "none",
    borderRadius: "var(--radius-sm)",
    color: "#fff",
    padding: "var(--space-2) var(--space-6)",
    cursor: isLoading ? "not-allowed" : "pointer",
    fontSize: "var(--text-sm)",
    fontWeight: "var(--weight-semibold)",
    fontFamily: "var(--font-body)",
    opacity: isLoading ? 0.7 : 1,
    transition: "all var(--transition-fast)",
    display: "flex",
    alignItems: "center",
    gap: "var(--space-2)",
  };

  return (
    <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div style={modalStyle}>

        {/* ── Header ── */}
        <div style={headerStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <span style={{ fontSize: "20px" }}>🚗</span>
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "var(--text-lg)",
                  fontWeight: "var(--weight-semibold)",
                  color: "var(--color-text-primary)",
                  margin: 0,
                }}
              >
                {isEditing ? `Modifier — ${car?.brand} ${car?.model}` : "Ajouter un véhicule"}
              </h2>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", margin: 0 }}>
                {isEditing ? "Modifiez les informations du véhicule" : "Remplissez les informations du nouveau véhicule"}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <span style={badgeStyle}>{isEditing ? "Édition" : "Nouveau"}</span>
            <button style={closeBtnStyle} onClick={handleClose}>✕</button>
          </div>
        </div>

        {/* ── Body ── */}
        <form onSubmit={handleSubmit}>
          <div style={bodyStyle}>
            {/* Left column — fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <FormErrorAlert errors={errors} />
              <CarFormFields data={formData} onChange={handleFieldChange} />
            </div>

            {/* Right column — images */}
            <ImageUploadSection
              coverFile={coverFile}
              coverPreview={coverPreview}
              onCoverSelect={handleCoverSelect}
              onCoverRemove={handleCoverRemove}
              galleryFiles={galleryFiles}
              galleryPreviews={galleryPreviews}
              onGallerySelect={handleGallerySelect}
              onGalleryRemove={handleGalleryRemove}
              isEditing={isEditing}
              existingCoverUrl={car?.cover_image?.url ? `/storage/${car.cover_image.url}` : null}
            />
          </div>

          {/* ── Footer ── */}
          <div style={footerStyle}>
            <button type="button" style={cancelBtnStyle} onClick={handleClose}>
              Annuler
            </button>
            <button type="submit" style={submitBtnStyle} disabled={isLoading}>
              {isLoading ? (
                <>
                  <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⏳</span>
                  {isEditing ? "Mise à jour..." : "Ajout en cours..."}
                </>
              ) : (
                <>{isEditing ? "💾 Enregistrer" : "➕ Ajouter le véhicule"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarFormModal;