import "../../styles/components/ConfirmDialog.css";

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!isOpen) return null;

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onCancel?.();
    }
  };

  return (
    <div className="confirm-dialog-overlay" onClick={handleOverlayClick}>
      <div className="confirm-dialog" role="dialog" aria-modal="true">
        <div className="confirm-dialog-header">
          <h3>{title}</h3>
        </div>
        <div className="confirm-dialog-body">
          <p>{message}</p>
        </div>
        <div className="confirm-dialog-actions">
          <button
            type="button"
            className="confirm-dialog-btn cancel"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="confirm-dialog-btn confirm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Suppression..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
