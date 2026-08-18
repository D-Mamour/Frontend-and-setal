import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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
  @Input() errorMessage = '';

  @Output() continuer = new EventEmitter<void>();
  router = inject(Router);


  goHome(){
    this.router.navigate(['/']);
  }
}
