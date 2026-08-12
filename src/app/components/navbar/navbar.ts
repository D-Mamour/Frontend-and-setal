import { Component } from '@angular/core';
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
  imports: [FontAwesomeModule],
  templateUrl: 'navbar.html'
})
export class Navbar{

  faHouse = faHouse;
  faUsers = faUsers;
  faCamera = faCamera;
  faChartPie = faChartPie;
  faCircleUser = faCircleUser;

}