import { inject } from "@angular/core";
import { AuthService } from "../Services/auth-citoyen-service";
import { CanActivateFn, Router } from "@angular/router";
import { UserRole } from "../Models/auth/utilisateur";

export const roleGuard: CanActivateFn = (route) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  // Récupérer les rôles autorisés définis dans la route
  const allowedRoles = route.data['roles'] as UserRole[];

   // Récupérer l'utilisateur connecté
  const currentUser = authService.currentUser();

  // Aucun utilisateur connecté
  if (!currentUser) {
    return router.createUrlTree(['/connexion']);

  }

  // Vérifier si le rôle de l'utilisateur
  // fait partie des rôles autorisés
  if (allowedRoles.includes(currentUser.role)) {

    return true;

  }

  // L'utilisateur est connecté
  // mais n'a pas le bon rôle
  return router.createUrlTree(['/acces-interdit']);
};
