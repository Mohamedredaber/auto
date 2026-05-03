import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Eye, Edit2, Trash2, AlertCircle } from "lucide-react";
import "./ActionMenu.css";

const ActionMenu = ({ booking, onViewDetails, onEditStatus, onCancel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
        setConfirmDelete(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleViewDetails = () => {
    onViewDetails(booking);
    setIsOpen(false);
    setConfirmDelete(false);
  };

  const handleEditStatus = () => {
    onEditStatus(booking);
    setIsOpen(false);
    setConfirmDelete(false);
  };

  const handleCancelClick = () => {
    if (confirmDelete) {
      onCancel(booking.id);
      setIsOpen(false);
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
    }
  };

  const canCancel =
    booking.status !== "canceled" && booking.status !== "completed";

  return (
    <div className="action-menu-container" ref={menuRef}>
      <button
        className="btn-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="Actions"
        aria-label="Actions du menu"
      >
        <MoreHorizontal size={18} />
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <button
            className="menu-item"
            onClick={handleViewDetails}
            title="Afficher les détails de la réservation"
          >
            <Eye size={16} />
            <span>Afficher détails</span>
          </button>

          <button
            className="menu-item"
            onClick={handleEditStatus}
            title="Modifier le statut de la réservation"
          >
            <Edit2 size={16} />
            <span>Modifier statut</span>
          </button>

          {canCancel && (
            <>
              <div className="menu-divider"></div>
              <button
                className={`menu-item menu-item-danger ${
                  confirmDelete ? "confirming" : ""
                }`}
                onClick={handleCancelClick}
                title={
                  confirmDelete
                    ? "Cliquez à nouveau pour confirmer l'annulation"
                    : "Annuler cette réservation"
                }
              >
                {confirmDelete ? (
                  <>
                    <AlertCircle size={16} />
                    <span>Confirmer l'annulation</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    <span>Annuler</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
