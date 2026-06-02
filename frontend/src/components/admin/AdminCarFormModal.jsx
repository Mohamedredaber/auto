import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import Select from "react-select";
import {selectAdminAgenciesNames} from "../../features/adminCars/adminCarsSelectors";

import {
  selectAdminFormOpen,
  selectAdminFormMode,
  selectAdminSelectedCar,
  selectAdminCarsLoading,
  selectAdminCarsError,
  } from "../../features/adminCars/adminCarsSelectors";

import {
  closeAdminCarModal,
  clearListError,
} from "../../features/adminCars/adminCarsSlice";

import {
  insertAdminCarThunk,
  updateAdminCarThunk,
} from "../../features/adminCars/adminCarsThunks";

import CarFormFields from "../../pages/agency/mycars/CarFormModal/CarFormFields";
import ImageUploadSection from "../../pages/agency/mycars/CarFormModal/ImageUploadSection";
import FormErrorAlert from "../../pages/agency/mycars/CarFormModal/FormErrorAlert";

const INITIAL_DATA = {
  agency_id: "",
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
  available_from: "",
  available_to: "",
  additional_information: "",
  description: "",
};

const buildFormData = (fields, coverFile, galleryFiles) => {
  const fd = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      fd.append(key, value);
    }
  });

  if (coverFile) {
    fd.append("cover_image", coverFile);
  }

  galleryFiles.forEach((file) => {
    fd.append("images[]", file);
  });

  return fd;
};

const fileToPreview = (file) => URL.createObjectURL(file);

const AdminCarFormModal = () => {
  const dispatch = useDispatch();
const agenciesOptions = useSelector(selectAdminAgenciesNames);

  const isOpen = useSelector(selectAdminFormOpen);
  const mode = useSelector(selectAdminFormMode);
  const car = useSelector(selectAdminSelectedCar);
  const isLoading = useSelector(selectAdminCarsLoading);
  const errors = useSelector(selectAdminCarsError);

  const isEditing = mode === "edit";

  const [formData, setFormData] = useState(INITIAL_DATA);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  useEffect(() => {
  console.log("Agencies for select (inside useEffect):", agenciesOptions);
}, [agenciesOptions]);

  useEffect(() => {
    if (isEditing && car) {
      setFormData({
        agency_id: car.agency_id ?? car.agency?.id ?? "",
        brand: car.brand ?? "",
        model: car.model ?? "",
        category: car.category ?? "",
        year: car.year ?? new Date().getFullYear(),
        transmission: car.transmission ?? "",
        fuel: car.fuel ?? "",
        seats: car.seats ?? 5,
        doors: car.doors ?? 4,
        price_per_day: car.price_per_day ?? "",
        status: car.status ?? "available",
        available_from: car.available_from ?? "",
        available_to: car.available_to ?? "",
        additional_information: car.additional_information ?? "",
        description: car.description ?? "",
      });
    } else {
      setFormData(INITIAL_DATA);
    }

    setCoverFile(null);
    setCoverPreview(null);
    setGalleryFiles([]);
    setGalleryPreviews([]);
  }, [isOpen, isEditing, car]);

  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      galleryPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [coverPreview, galleryPreviews]);

  const handleFieldChange = useCallback((name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleCoverSelect = useCallback((file) => {
    if (!file) return;

    setCoverFile(file);
    setCoverPreview(fileToPreview(file));
  }, []);

  const handleCoverRemove = useCallback(() => {
    if (coverPreview) URL.revokeObjectURL(coverPreview);

    setCoverFile(null);
    setCoverPreview(null);
  }, [coverPreview]);

  const handleGallerySelect = useCallback((files) => {
    const selectedFiles = Array.isArray(files) ? files : [files];

    setGalleryFiles((prev) => [...prev, ...selectedFiles]);
    setGalleryPreviews((prev) => [
      ...prev,
      ...selectedFiles.map(fileToPreview),
    ]);
  }, []);

  const handleGalleryRemove = useCallback((index) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));

    setGalleryPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleClose = () => {
    dispatch(clearListError());
    dispatch(closeAdminCarModal());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = buildFormData(formData, coverFile, galleryFiles);

    if (isEditing) {
      fd.append("_method", "PUT");

      const result = await dispatch(
        updateAdminCarThunk({
          id: car.id,
          formData: fd,
        })
      );

      if (!result.error) handleClose();
    } else {
      const result = await dispatch(insertAdminCarThunk(fd));

      if (!result.error) handleClose();
    }
  };

  if (!isOpen) return null;

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
    border: `1px solid ${
      isEditing ? "var(--color-info)" : "var(--color-success)"
    }`,
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
    opacity: isLoading ? 0.7 : 1,
  };



  return (
    <div
      style={overlayStyle}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div style={modalStyle}>
        <div style={headerStyle}>
          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <span style={{ fontSize: "20px" }}>🚗</span>

            <div>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "var(--text-lg)",
                  color: "var(--color-text-primary)",
                  margin: 0,
                }}
              >
                {isEditing
                  ? `Modifier — ${car?.brand} ${car?.model}`
                  : "Ajouter un véhicule"}
              </h2>

              <p
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-muted)",
                  margin: 0,
                }}
              >
                {isEditing
                  ? "Admin peut modifier le véhicule et son agence"
                  : "Admin peut ajouter un véhicule pour une agence"}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <span style={badgeStyle}>{isEditing ? "Édition" : "Nouveau"}</span>

            <button style={closeBtnStyle} onClick={handleClose}>
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={bodyStyle}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-4)",
              }}
            >
              <FormErrorAlert errors={errors} />

              <div className="form-field">
                <label className="form-label">
                  Agence <span className="required-star">*</span>
                </label>

                <input
                  type="number"
                  className="form-input"
                  value={formData.agency_id}
                  onChange={(e) =>
                    handleFieldChange("agency_id", e.target.value)
                  }
                  placeholder="Ex: 1"
                  required
                />
              </div>

              <CarFormFields data={formData} onChange={handleFieldChange} />
            </div>

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
              existingCoverUrl={
                car?.cover_image?.url ? `/storage/${car.cover_image.url}` : null
              }
            />
          </div>

          <div style={footerStyle}>
            <button type="button" style={cancelBtnStyle} onClick={handleClose}>
              Annuler
            </button>

            <button type="submit" style={submitBtnStyle} disabled={isLoading}>
              {isLoading
                ? isEditing
                  ? "Mise à jour..."
                  : "Ajout en cours..."
                : isEditing
                  ? "💾 Enregistrer"
                  : "➕ Ajouter le véhicule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCarFormModal;