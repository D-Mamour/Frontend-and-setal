import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import { AuthService } from '../Services/auth-citoyen.service';
import { UserRole } from '../Models/auth/utilisateur';
import { catchError, map, of } from 'rxjs';

export const roleGuardAdmin: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const allowedRoles = route.data['roles'] as UserRole[];

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/admin/login']);
  }

  const currentUser = authService.currentUser();

  if (!currentUser) {
    // Token présent mais profil pas encore chargé -> on le récupère au lieu de rediriger
    return authService.getProfil().pipe(
      map(user => allowedRoles.includes(user.role)
        ? true
        : router.createUrlTree(['/acces-interdit'])),
      catchError(() => of(router.createUrlTree(['/admin/login'])))
    );
  }

  return allowedRoles.includes(currentUser.role)
    ? true
    : router.createUrlTree(['/acces-interdit']);
};
