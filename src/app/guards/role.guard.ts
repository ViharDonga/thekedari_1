import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.currentUser();

    if (!user) {
      return router.createUrlTree(['/login']);
    }

    if (allowedRoles.includes(user.role)) {
      return true;
    }

    return router.createUrlTree([authService.getDefaultRoute()]);
  };
};

export const tabGuard = (tab: 'tab1' | 'tab2' | 'tab3' | 'tab4'): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.canAccessTab(tab)) {
      return true;
    }

    return router.createUrlTree([authService.getDefaultRoute()]);
  };
};
