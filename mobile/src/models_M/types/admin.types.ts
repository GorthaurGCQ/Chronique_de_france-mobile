/** Actions admin disponibles sur un utilisateur (ban, rôles, permissions). */
export type AdminUserAction =
  | 'ban'
  | 'unban'
  | 'makeAdmin'
  | 'makeUser'
  | 'delete'
  | 'updatePermissions';
