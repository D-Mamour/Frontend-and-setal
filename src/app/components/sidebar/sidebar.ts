import { Component,inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChartPie,
  faBullhorn,
  faChartLine,
  faUsers,
  faScrewdriverWrench,
  faBoxesStacked,
  faGear
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../Services/auth-citoyen.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [FontAwesomeModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',  
})
export class Sidebar {

      faChartPie = faChartPie;
      faBullhorn = faBullhorn;
      faChartLine = faChartLine;
      faUsers = faUsers;
      faScrewdriverWrench = faScrewdriverWrench;
      faBoxesStacked = faBoxesStacked;
      faGear = faGear;

       authService = inject(AuthService);
       router = inject(Router);

  deconnexion(): void {
      this.authService.logout();
      this.router.navigate(['/admin/login']);
  }

  
}
