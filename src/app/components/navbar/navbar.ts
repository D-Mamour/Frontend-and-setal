<<<<<<< HEAD
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
=======
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
>>>>>>> 1506128e49c9bbe3b86783c4ac04c2cf4f915834
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faHouse,
  faUsers,
  faCamera,
  faChartPie,
  faCircleUser
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: 'navbar.html'
})
export class Navbar{

  faHouse = faHouse;
  faUsers = faUsers;
  faCamera = faCamera;
  faChartPie = faChartPie;
  faCircleUser = faCircleUser;
  router = inject(Router)

  signalementPage(){
    this.router.navigateByUrl('signaler-probleme')
  }


  homePage(){
    this.router.navigateByUrl('signalements')
  }

  profilPage(){
    this.router.navigateByUrl('signalements')
  }


}
