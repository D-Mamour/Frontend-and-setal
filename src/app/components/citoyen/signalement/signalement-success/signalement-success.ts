import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signalement-success',
  imports: [],
  templateUrl: './signalement-success.html',
  styleUrl: './signalement-success.css',
})
export class SignalementSuccess {
  router = inject(Router)

  goHome(){
    this.router.navigate(['/']);
  }
}
