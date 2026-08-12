import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mes-signalement',
  imports: [],
  templateUrl: './mes-signalement.html',
  styleUrl: './mes-signalement.css',
})
export class MesSignalement {
  router = inject(Router)

  goHome(){
    this.router.navigate(['/']);
  }

}
