import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { Navbar } from '../../navbar/navbar';
import { AuthService } from '../../../Services/auth-citoyen.service';

@Component({
  selector: 'app-dashboard-citoyen',
  imports: [RouterLink, Navbar],
  templateUrl: './dashboard-citoyen.html',
  styleUrl: './dashboard-citoyen.css',
})
export class DashboardCitoyen implements OnInit{
  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit(): void {
    this.chargerProfil();
  }


  chargerProfil(): void {

    /**
     * Si le profil est déjà chargé,
     * inutile de refaire la requête.
     */
    if (this.authService.currentUser()) {
      return;
    }

    this.authService.getProfil().subscribe({
      next: (user) => {
        console.log('Citoyen connecté :', user);
      },

      error: (error) => {
        console.error('Erreur récupération profil :',error);
      }

    });
  }

  deconnexion(): void {
    this.authService.logout();
    this.router.navigate(['/connexion']);
  }
}
