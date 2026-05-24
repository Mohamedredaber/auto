export const selectAgencyProfile = (state) => state.agencyPublic.profile;
export const selectAgencyFleet = (state) => state.agencyPublic.profile?.fleet ?? [];
export const selectAgencyStats = (state) => state.agencyPublic.profile?.stats;
export const selectIsProfileLoading = (state) => state.agencyPublic.loading;
export const selectProfileError = (state) => state.agencyPublic.error;