import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Navbar } from '../../../navbar/navbar';

@Component({
  selector: 'app-mes-signalement',
  imports: [Navbar],
  templateUrl: './mes-signalement.html',
  styleUrl: './mes-signalement.css',
})
export class MesSignalement {
  router = inject(Router)

  goHome(){
    this.router.navigate(['/']);
  }

}
