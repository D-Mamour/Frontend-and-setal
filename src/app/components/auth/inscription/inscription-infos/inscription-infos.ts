import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inscription-infos',
  imports: [RouterLink],
  templateUrl: './inscription-infos.html',
  styleUrl: './inscription-infos.css',
})
export class InscriptionInfos {
  @Input() step = 1;
  @Input() totalSteps = 3;

  @Output() continuer = new EventEmitter<void>();
  @Output() retour = new EventEmitter<void>();
}
