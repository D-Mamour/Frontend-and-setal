import { Component, inject } from '@angular/core';
import { InscriptionInfos } from '../inscription-infos/inscription-infos';
import { InscriptionVerification } from '../inscription-verification/inscription-verification';
import { InscriptionPermissions } from '../inscription-permissions/inscription-permissions';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscription-component',
  standalone: true,
  imports: [CommonModule, InscriptionInfos, InscriptionVerification, InscriptionPermissions],
  templateUrl: './inscription-component.html',
  styleUrl: './inscription-component.css',
})
export class InscriptionComponent {
  readonly totalSteps = 3;
  currentStep = 1;

  router = inject(Router);

  suivant(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  precedent(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  /** Appelé une fois la 3e étape validée ou passée — branche ici la redirection réelle */
  terminerInscription(): void {
    this.router.navigateByUrl('/');
  }
}
