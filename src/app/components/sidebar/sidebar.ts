import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
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
  standalone: true,
  imports: [FontAwesomeModule, RouterLink, RouterLinkActive, CommonModule],
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
