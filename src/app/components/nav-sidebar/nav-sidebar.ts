import { Component, } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faMagnifyingGlass,
  faBell
} from '@fortawesome/free-solid-svg-icons';
import { AdminprofilService } from '../../Services/admin-dashboard-service';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-sidebar',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
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
    ngOnInit(): void {
    // 🚀 ON CHARGE LE PROFIL ICI ! Dès que l'application s'ouvre, le Header appelle Django
    this.adminService.profil().subscribe({
      next: (data) => console.log("Profil chargé avec succès dans le Header :", data),
      error: (err) => console.error("Le Header n'a pas pu récupérer l'utilisateur", err)
    });
  }

}

