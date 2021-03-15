const roles = ['USER', 'ADMIN', 'XADMIN'] as const;

enum AuthRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  XADMIN = 'XADMIN',
}

export {  roles, AuthRole };
