import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminprofilService } from '../../../Services/admin-dashboard-service';
import { Incident } from '../../../Models/incident.model';

@Component({
  selector: 'app-signalement-detail-admin',
  imports: [],
  templateUrl: './signalement-detail-admin.html',
  styleUrl: './signalement-detail-admin.css',
})
export class SignalementDetailAdmin implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  incidentService = inject(AdminprofilService);

  incident: Incident | null = null;

  ngOnInit(): void {

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

        this.incident = incident;
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
