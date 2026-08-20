import { Component, inject, OnInit, signal, input  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminprofilService } from '../../../Services/admin-dashboard-service';
import { Incident } from '../../../Models/incident.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signalement-detail-admin',
  imports: [CommonModule],
  templateUrl: './signalement-detail-admin.html',
  styleUrl: './signalement-detail-admin.css',
})
export class SignalementDetailAdmin implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  incidentService = inject(AdminprofilService);


  incident = signal<Incident | null>(null);
  // On injecte le service pour récupérer directement son Signal
  private readonly adminService = inject(AdminprofilService);

  // On crée un raccourci public pour le fichier HTML
  readonly userConnecte = this.adminService.adminuser;

  ngOnInit(): void {
    this.adminService.profil().subscribe({
      next: (data) => console.log("Profil chargé avec succès dans le Header :", data),
      error: (err) => console.error("Le Header n'a pas pu récupérer l'utilisateur", err)
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID du signalement :', id);

    if (!id) {
      console.log('ID du signalement invalide');
      return;
    }

    this.chargerSignalement(id);
  }

  chargerSignalement(id: number): void {

    this.incidentService.getIncident(id).subscribe({
      next: (incident) => {
        console.log('detail charge', incident);

        this.incident.set(incident);
      },

      error: (error) => {
        console.log('Erreur lors de la récupération du signalement :',error);
      }

    });

  }

  retour(): void {
    this.router.navigate(['/admin/signalements']);
  }




}
