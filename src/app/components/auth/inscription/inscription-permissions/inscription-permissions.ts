import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-inscription-permissions',
  imports: [],
  templateUrl: './inscription-permissions.html',
  styleUrl: './inscription-permissions.css',
})
export class InscriptionPermissions {
  @Input() step = 3;
  @Input() totalSteps = 3;

  @Output() autoriser = new EventEmitter<void>();
  @Output() plusTard = new EventEmitter<void>();
}
