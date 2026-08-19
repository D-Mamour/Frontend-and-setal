import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inscription-infos',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
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
