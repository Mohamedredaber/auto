export const ROLES = {
  CLIENT:       "client",
  ADMIN_AGENCY: "admin_agency",
  SUPER_ADMIN:  "super_admin",
};

/**
 * Route d'accueil selon le rôle — doit correspondre EXACTEMENT à AppRoutes.jsx
 */
export const ROLE_HOME = {
  [ROLES.CLIENT]:       "/dashboard/client",
  [ROLES.ADMIN_AGENCY]: "/dashboard/agency",
  [ROLES.SUPER_ADMIN]:  "/dashboard/admin",
};
