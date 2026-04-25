import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Eye, Edit2, Trash2 } from "lucide-react";
import "./ActionMenu.css";

const ActionMenu = ({ booking, onViewDetails, onEditStatus, onCancel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleViewDetails = () => {
    onViewDetails(booking);
    setIsOpen(false);
  };

  const handleEditStatus = () => {
    onEditStatus(booking);
    setIsOpen(false);
  };

  const handleCancel = () => {
    if (window.confirm("Êtes-vous sûr d'annuler cette réservation ?")) {
      onCancel(booking.id);
      setIsOpen(false);
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
      >
        <MoreHorizontal size={18} />
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <button className="menu-item" onClick={handleViewDetails}>
            <Eye size={16} />
            <span>Afficher détails</span>
          </button>

          <button className="menu-item" onClick={handleEditStatus}>
            <Edit2 size={16} />
            <span>Modifier statut</span>
          </button>
          {canCancel && (
            <>
              <div className="menu-divider"></div>
              <button
                className="menu-item menu-item-danger"
                onClick={handleCancel}
              >
                <Trash2 size={16} />
                <span>Annuler</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
