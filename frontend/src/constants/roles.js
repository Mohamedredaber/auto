export const ROLES = {
  CLIENT: "client",
  ADMIN_AGENCY: "admin_agency",
  SUPER_ADMIN: "super_admin",
};

export const ROLE_HOME = {
  [ROLES.CLIENT]: "/client/dashboard",
  [ROLES.ADMIN_AGENCY]: "/agency/dashboard",
  [ROLES.SUPER_ADMIN]: "/admin/dashboard",
};
