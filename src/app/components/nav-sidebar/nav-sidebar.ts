import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faMagnifyingGlass,
  faBell
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav-sidebar',
  imports: [FontAwesomeModule],
  templateUrl: './nav-sidebar.html',
  styleUrl: './nav-sidebar.css',
})
export class NavSidebar {

  faMagnifyingGlass = faMagnifyingGlass;
  faBell = faBell;

  today = new Date();

  get currentDate(): string {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(this.today);
  }

}

