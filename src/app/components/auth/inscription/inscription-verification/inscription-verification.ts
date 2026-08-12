import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-inscription-verification',
  imports: [],
  templateUrl: './inscription-verification.html',
  styleUrl: './inscription-verification.css',
})
export class InscriptionVerification {
  @Input() step = 2;
  @Input() totalSteps = 3;

  @Output() verifier = new EventEmitter<void>();
  @Output() renvoyer = new EventEmitter<void>();
  @Output() retour = new EventEmitter<void>();
}
