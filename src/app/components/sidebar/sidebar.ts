import { Component } from '@angular/core';
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

@Component({
  selector: 'app-sidebar',
  imports: [FontAwesomeModule],
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
}
