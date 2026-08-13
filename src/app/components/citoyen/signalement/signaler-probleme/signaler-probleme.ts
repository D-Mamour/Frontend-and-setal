import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signaler-probleme',
  imports: [FormsModule, CommonModule],
  templateUrl: './signaler-probleme.html',
  styleUrl: './signaler-probleme.css',
})
export class SignalerProbleme {
  router = inject(Router);

  goBack(): void {
    this.router.navigate(['/'])
  }

  onSubmit(): void {

    setTimeout(() => {
      this.router.navigate(['/signalement-success']);
    }, 800);
  }
}
