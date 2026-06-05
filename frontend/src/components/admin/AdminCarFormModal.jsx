import "./AdminCarFormModal.css";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";

import {
  selectAdminFormOpen,
  selectAdminFormMode,
  selectAdminSelectedCar,
  selectAdminCarsLoading,
  selectAdminCarsError,
  selectAdminAgenciesNames,
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
import { fetchAdminAgenciesNamesThunk } from "../../features/adminCars/adminCarsThunks";


const INITIAL_DATA = {
  agency_id: "",
  brand: "",
  model: "",
  category: "",
  year: new Date().getFullYear(),
  transmission: "manual",
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

  if (coverFile) fd.append("cover_image", coverFile);

  galleryFiles.forEach((file) => {
    fd.append("images[]", file);
  });

  return fd;
};

const fileToPreview = (file) => URL.createObjectURL(file);

const AdminCarFormModal = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector(selectAdminFormOpen);
  const mode = useSelector(selectAdminFormMode);
  const car = useSelector(selectAdminSelectedCar);
  const isLoading = useSelector(selectAdminCarsLoading);
  const errors = useSelector(selectAdminCarsError);
  const agencies = useSelector(selectAdminAgenciesNames);
   

  const isEditing = mode === "edit";

  const [formData, setFormData] = useState(INITIAL_DATA);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const agencyOptions = agencies.map((agency) => ({
    value: agency.id,
    label: agency.agency_name,
  }));

  const selectedAgency =
    agencyOptions.find(
      (option) => option.value === Number(formData.agency_id)
    ) || null;
    useEffect(() => {
    dispatch(fetchAdminAgenciesNamesThunk());
    }, [dispatch]);

  useEffect(() => {
    
    if (isEditing && car) {
      setFormData({
        agency_id: car.agency_id ?? car.agency?.id ?? "",
        brand: car.brand ?? "",
        model: car.model ?? "",
        category: car.category ?? "",
        year: car.year ?? new Date().getFullYear(),
        transmission:  car.transmission ?? "",
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
    
    console.log("Submitting form with data:", formData);
    const fd = buildFormData(formData, coverFile, galleryFiles);

    if (isEditing) {
      fd.append("_method", "PUT");

      const result = await dispatch(
        updateAdminCarThunk({
          carId: car.id,
          carData: fd,
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
          <div>
            <h2 style={{ margin: 0 }}>
              {isEditing
                ? `Modifier — ${car?.brand} ${car?.model}`
                : "Ajouter un véhicule"}
            </h2>
            <p style={{ margin: 0, color: "var(--color-text-muted)" }}>
              {isEditing
                ? "Modifier les informations du véhicule"
                : "Ajouter une voiture pour une agence"}
            </p>
          </div>

          <button type="button" onClick={handleClose}>
            ✕
          </button>
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

                <Select
                    classNamePrefix="agency-select"
                    options={agencyOptions}
                    value={selectedAgency}
                    onChange={(option) =>
                        handleFieldChange("agency_id", option?.value || "")
                    }
                    placeholder="Rechercher une agence..."
                    isSearchable
                    isClearable
                    noOptionsMessage={() => "Aucune agence trouvée"}
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
                car?.images?.find((img) => img.is_cover == 1)?.url || null
              }
            />
          </div>

          <div style={footerStyle}>
            <button type="button" onClick={handleClose}>
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