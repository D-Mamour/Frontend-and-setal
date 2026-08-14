import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inscription-infos',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './inscription-infos.html',
  styleUrl: './inscription-infos.css',
})
export class InscriptionInfos {
  @Input() step = 1;
  @Input() totalSteps = 3;

  @Input({ required: true })
  form!: FormGroup;

  @Input() loading = false;

  @Output() continuer = new EventEmitter<void>();
}
