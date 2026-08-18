import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inscription-verification',
  imports: [FormsModule],
  templateUrl: './inscription-verification.html',
  styleUrl: './inscription-verification.css',
})
export class InscriptionVerification {

  @Input() step = 2;
  @Input() totalSteps = 3;
  @Input() email = '';
  @Input() loading = false;
  @Input() errorMessage = '';
  @Output() verifier = new EventEmitter<string>();
  @Output() renvoyer = new EventEmitter<void>();
  @Output() retour = new EventEmitter<void>();
  code = '';


  verifierCode(): void {

    if (!this.code || this.code.length < 4) {
      return;
    }

    this.verifier.emit(this.code);
  }
}
