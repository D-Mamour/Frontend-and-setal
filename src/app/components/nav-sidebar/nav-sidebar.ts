import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faMagnifyingGlass,
  faBell
} from '@fortawesome/free-solid-svg-icons';
import { AdminprofilService } from '../../Services/admin-dashboard-service';
import { inject } from '@angular/core';

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

    // On injecte le service pour récupérer directement son Signal
  private readonly adminService = inject(AdminprofilService);

  // On crée un raccourci public pour le fichier HTML
  readonly userConnecte = this.adminService.adminuser;

}

