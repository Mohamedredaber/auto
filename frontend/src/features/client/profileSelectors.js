// Sélecteur de base pour accéder à la tranche profile
export const selectProfileState = (state) => state.profileclient;

// Récupérer les données du profil
export const selectUserProfile = (state) => state.profileclient.profile;

// Récupérer le nom complet (optionnel mais utile pour l'UI)
export const selectUserFullName = (state) => {
    const profile = state.profileclient.profile;
    return profile ? `${profile.first_name} ${profile.last_name}` : "";
};

// Récupérer l'état de chargement
export const selectIsProfileLoading = (state) => state.profileclient.loading;

// Récupérer les erreurs
export const selectProfileError = (state) => state.profileclient.error;