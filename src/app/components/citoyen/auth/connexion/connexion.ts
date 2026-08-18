import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../Services/auth-citoyen.service';
import { UserRole } from '../../../../Models/auth/utilisateur';

@Component({
  selector: 'app-connexion',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './connexion.html',
  styleUrl: './connexion.css',
})
export class Connexion {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);

    loading = signal(false);
    errorMessage = signal('');

    loginForm= this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
   });

    seConnecter(){
      this.errorMessage.set('');

      if (this.loginForm.invalid) {
        this.loginForm.markAllAsTouched();
        return;
      }

      if (this.loading()) {
        return;
      }

      this.loading.set(true);
      const credentials = this.loginForm.getRawValue();

      this.authService.login(credentials).subscribe({
        next: () => {
          this.loadCurrentUser();
        },
        error: (error) => {
          this.loading.set(false);
          this.handleLoginError(error);
        }
      });
  }

  private loadCurrentUser(): void {

  this.authService.getProfil().subscribe({
      next: (user) => {
        this.loading.set(false);
        this.redirectByRole(user.role);
      },

      error: (error) => {
        this.loading.set(false);
        console.error('Impossible de récupérer le profil',error);

        this.errorMessage.set(
          'Impossible de récupérer les informations de votre compte.'
        );

        this.authService.logout();
      }
    });
}

private redirectByRole(role: UserRole): void {
  switch (role) {
    case 'citoyen':
      this.router.navigate(['/']);
      break;

    case 'agent':
      this.router.navigate(['/agent/dashboard']);
      break;

    default:
      this.errorMessage.set('Le rôle de votre compte est invalide.');
      this.authService.logout();

  }
}

  // Gestion des erreurs
  private handleLoginError(error: any): void {
    console.error('Erreur connexion :', error);
    if (error.status === 0) {
      this.errorMessage.set(
        'Impossible de contacter le serveur. Vérifiez votre connexion.'
      );

      return;
    }
    if (error.status === 401 || error.status === 400) {
      this.errorMessage.set('Email ou mot de passe incorrect.');
      return;
    }
    if (error.status >= 500) {
      this.errorMessage.set(
        'Le serveur rencontre un problème. Veuillez réessayer plus tard.'
      );
      return;
    }

    this.errorMessage.set('Une erreur est survenue lors de la connexion.');
  }
}
