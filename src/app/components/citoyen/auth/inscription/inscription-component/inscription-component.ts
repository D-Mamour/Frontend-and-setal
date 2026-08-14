import { Component, inject } from '@angular/core';
import { InscriptionInfos } from '../inscription-infos/inscription-infos';
import { InscriptionVerification } from '../inscription-verification/inscription-verification';
import { InscriptionPermissions } from '../inscription-permissions/inscription-permissions';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../../Services/auth-citoyen-service';

@Component({
  selector: 'app-inscription-component',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InscriptionInfos,
    InscriptionVerification,
    InscriptionPermissions
  ],
  templateUrl: './inscription-component.html',
  styleUrl: './inscription-component.css',
})
export class InscriptionComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly totalSteps = 3;

  currentStep = 1;

  loading = false;
  errorMessage = '';

  //Formulaire principal d'inscription
  inscriptionForm = this.fb.nonNullable.group({

    username: ['', Validators.required],
    first_name: ['',Validators.required],
    last_name: ['',Validators.required],
    telephone: ['',Validators.required],
    email: ['',[Validators.required,Validators.email]],
    password: ['',[Validators.required,Validators.minLength(8)]]

  });


  // Code OTP
  otpCode = '';

  /**
   * Passage étape suivante
   */
  suivant(): void {

    if (this.currentStep === 1) {

      this.inscription();

      return;
    }

    if (this.currentStep === 2) {

      this.verifierOtp();

      return;
    }

    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }


  /**
   * Retour étape précédente
   */
  precedent(): void {

    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }


  /**
   * Appel API inscription
   */
  inscription(): void {

    this.errorMessage = '';

    if (this.inscriptionForm.invalid) {

      this.inscriptionForm.markAllAsTouched();

      return;
    }

    this.loading = true;

    this.authService.register(this.inscriptionForm.getRawValue()).subscribe({
        next: () => {
          this.loading = false;
          this.currentStep = 2;
        },

        error: (error) => {

          this.loading = false;

          console.error(
            'Erreur inscription :',
            error
          );

          this.errorMessage =
            error?.error?.detail ??
            'Impossible de créer votre compte.';
        }

      });
  }


  /**
   * Vérification OTP
   */
  verifierOtp(): void {

    if (!this.otpCode) {
      return;
    }

    this.loading = true;

    this.authService.verifyOtp({
        email: this.inscriptionForm.controls.email.value,
        code: this.otpCode

      }).subscribe({

        next: () => {

          this.loading = false;

          this.currentStep = 3;

        },

        error: (error) => {

          this.loading = false;

          console.error('Erreur OTP :',error);

          this.errorMessage = error?.error?.detail ?? 'Le code OTP est incorrect.';
        }

      });
  }


  /**
   * Fin de l'inscription
   */
  terminerInscription(): void {

    this.router.navigate(['/connexion']);
  }
}
