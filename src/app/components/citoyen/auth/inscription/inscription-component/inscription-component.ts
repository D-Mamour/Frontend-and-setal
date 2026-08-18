import { Component, inject, signal } from '@angular/core';
import { InscriptionInfos } from '../inscription-infos/inscription-infos';
import { InscriptionVerification } from '../inscription-verification/inscription-verification';
import { InscriptionPermissions } from '../inscription-permissions/inscription-permissions';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../../Services/auth-citoyen.service';

@Component({
  selector: 'app-inscription-component',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InscriptionInfos,
    InscriptionVerification,
    InscriptionPermissions,
  ],
  templateUrl: './inscription-component.html',
  styleUrl: './inscription-component.css',
})
export class InscriptionComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly totalSteps = 3;

  currentStep = signal(1);
  loading = signal(false);
  errorMessage = signal('');
  otpCode = signal('');

  //Formulaire principal d'inscription
  inscriptionForm = this.fb.nonNullable.group({
      username: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
  });

  // ÉTAPE 1
  inscription(): void {
    this.clearError();

    if (this.inscriptionForm.invalid) {
      this.inscriptionForm.markAllAsTouched();
      this.errorMessage.set('Veuillez corriger les champs obligatoires.');
      return;
    }
    if (this.loading()) {
      return;
    }

    this.loading.set(true);

    this.authService.register(this.inscriptionForm.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        // Passage direct à l'étape 2
        this.currentStep.set(2);
      },

      error: (error) => {
        this.loading.set(false);
        this.handleApiError(error);
      },
    });
  }

  // ÉTAPE 2
  verifierOtp(code: string): void {
    this.clearError();

    if (!code) {
      this.errorMessage.set('Veuillez saisir le code de vérification.');
      return;
    }

    if (this.loading()) {
      return;
    }

    this.otpCode.set(code);
    this.loading.set(true);

    this.authService.verifyOtp({email: this.inscriptionForm.controls.email.value, code})
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.currentStep.set(3);
        },

        error: (error) => {
          this.loading.set(false);
          this.handleApiError(error);
        },
      });
  }

  //ÉTAPE 3
  terminerInscription(): void {
    this.router.navigate(['/']);
  }

  // Retour
  precedent(): void {
    this.clearError();

    if (this.currentStep() > 1) {
      this.currentStep.update((step) => step - 1);
    }
  }

  // Nettoyer l'erreur
  clearError(): void {
    this.errorMessage.set('');
  }

  // Gestion centralisée des erreurs API
  private handleApiError(error: any): void {
    console.error('Erreur API :', error);

    //Erreur réseau
    if (error.status === 0) {
      this.errorMessage.set('Impossible de contacter le serveur. Vérifiez votre connexion.');
      return;
    }

    // Erreur 400
    if (error.status === 400) {
      const data = error.error;

      // detail
      if (data?.detail) {
        this.errorMessage.set(data.detail);
        return;
      }

      // message
      if (data?.message) {
        this.errorMessage.set(data.message);
        return;
      }

      // Erreurs de validation Django
      if (data && typeof data === 'object') {
        const messages: string[] = [];

        Object.entries(data).forEach(([field, value]: [string, any]) => {
          if (Array.isArray(value)) {
            value.forEach((message) => {
              messages.push(`${this.translateField(field)} : ${message}`);
            });
          } else if (typeof value === 'string') {
            messages.push(`${this.translateField(field)} : ${value}`);
          }
        });

        if (messages.length > 0) {
          this.errorMessage.set(messages.join(' '));

          return;
        }
      }
    }

    // Erreur serveur
    if (error.status >= 500) {
      this.errorMessage.set('Une erreur interne est survenue. Veuillez réessayer plus tard.');

      return;
    }

    // Message générique
    this.errorMessage.set('Une erreur est survenue. Veuillez réessayer.');
  }

  /**
   * Traduction des noms des champs
   */
  private translateField(field: string): string {
    const fields: Record<string, string> = {
      username: 'Nom d’utilisateur',

      first_name: 'Prénom',

      last_name: 'Nom',

      telephone: 'Téléphone',

      email: 'Email',

      password: 'Mot de passe',

      code: 'Code OTP',
    };

    return fields[field] ?? field;
  }
}
