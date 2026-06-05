export const selectAdminUsers = (state) => state.adminUsers.users;
export const selectSelectedAdminUser = (state) => state.adminUsers.selectedUser;
export const selectAdminUsersPagination = (state) => state.adminUsers.pagination;
export const selectAdminUsersLoading = (state) => state.adminUsers.loading;
export const selectAdminUsersError = (state) => state.adminUsers.error;
export const selectAdminUsersSuccessMessage = (state) =>
  state.adminUsers.successMessage;