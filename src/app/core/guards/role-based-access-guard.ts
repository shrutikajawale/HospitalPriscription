import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user-service';

export const roleBasedAccessGuard: CanActivateFn = (route) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const allowedRoles = route.data['roles'] as string[] | undefined;
  const userRole = userService.loggedUserData?.roleName;

  if (!userRole) {
    return router.parseUrl('/login');
  }

  if (!allowedRoles || allowedRoles.includes(userRole)) {
    return true;
  }

  return router.parseUrl('/admin/dashboard');
};
