import { Component, computed, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { Navbar } from '../../navbar/navbar';
import { Incident } from '../../../Models/incident.model';
import { AuthService } from '../../../Services/auth-citoyen.service';
import { IncidentService } from '../../../Services/incident.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-citoyen',
  standalone: true,
  imports: [RouterLink, Navbar, CommonModule],
  templateUrl: './dashboard-citoyen.html',
  styleUrl: './dashboard-citoyen.css',
})
export class DashboardCitoyen implements OnInit{
  authService = inject(AuthService);
  router = inject(Router);
  incidentService = inject(IncidentService);


  // Signal partagé
  incidents = this.incidentService.incidents;

  // Nombre total
  nombreSignalements = computed(() => {
    return this.incidents().length;
  });


  // Nombre de problèmes résolus
  nombreProblemesResolus = computed(() => {
    return this.incidents().filter((incident: Incident) => incident.statut === 'resolu').length;
  });

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
