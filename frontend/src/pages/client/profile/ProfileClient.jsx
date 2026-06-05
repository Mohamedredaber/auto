import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User, Mail, Phone, Calendar, Edit2, Save, X } from "lucide-react";
import { Button, Card } from "../../../components/ui";
import {
  selectUserProfile,
  selectIsProfileLoading,
} from "../../../features/client/profileSelectors";
import {
  fetchUserProfile,
  updateUserProfile,
} from "../../../features/client/profileThunks";
import "./Profile.css";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUserProfile);
  const isLoading = useSelector(selectIsProfileLoading);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  });

  // ✅ Charger le profil au montage du composant
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // Synchroniser les données locales avec le store Redux

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone || "",
        email: user.email,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile(formData))
      .unwrap()
      .then(() => setIsEditing(false))
      .catch((err) => alert("Erreur lors de la mise a jour : " + err));
  };

  if (isLoading && !user) return <div className="loader">Chargement...</div>;

  return (
    <div className="profile-wrapper">
      <Card className="profile-header-section">
        <div className="avatar-large">
          {user?.first_name?.charAt(0).toUpperCase()}
        </div>
        <div className="header-text">
          <h1>
            {user?.first_name} {user?.last_name}
          </h1>
          <p className="member-since">Membre depuis le {user?.created_at}</p>
        </div>
        {!isEditing ? (
          <Button className="btn-edit-toggle" onClick={() => setIsEditing(true)}>
            <Edit2 size={18} /> Modifier le profil
          </Button>
        ) : (
          <div className="edit-actions">
            <Button variant="ghost" className="btn-cancel" onClick={() => setIsEditing(false)}>
              <X size={18} /> Annuler
            </Button>
          </div>
        )}
      </Card>

      <form className="profile-content-grid" onSubmit={handleSubmit}>
        <Card className="info-card">
          <div className="card-header">
            <User size={20} />
            <h2>Détails Personnels</h2>
          </div>

          <div className="card-body">
            <div className="input-group">
              <label>Prénom</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                disabled={!isEditing}
                className={isEditing ? "editable" : ""}
              />
            </div>
            <div className="input-group">
              <label>Nom</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                disabled={!isEditing}
                className={isEditing ? "editable" : ""}
              />
            </div>
          </div>
        </Card>

        <Card className="info-card">
          <div className="card-header">
            <Mail size={20} />
            <h2>Contact & Sécurité</h2>
          </div>

          <div className="card-body">
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled={true} // Email souvent non modifiable pour la sécurité
                className="locked"
              />
            </div>
            <div className="input-group">
              <label>Téléphone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className={isEditing ? "editable" : ""}
              />
            </div>
          </div>
        </Card>

        {isEditing && (
          <div className="save-container">
            <Button type="submit" className="btn-save" disabled={isLoading}>
              <Save size={18} />{" "}
              {isLoading
                ? "Enregistrement..."
                : "Enregistrer les modifications"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfilePage;
