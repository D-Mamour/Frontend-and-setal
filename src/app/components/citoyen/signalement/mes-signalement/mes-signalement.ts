import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Navbar } from '../../../navbar/navbar';
import { IncidentService } from '../../../../Services/incident.service';
import { Incident } from '../../../../Models/incident.model';
import { DatePipe, DecimalPipe, NgClass, CommonModule } from '@angular/common';

@Component({
  selector: 'app-mes-signalement',
  standalone: true,
  imports: [Navbar, NgClass, DecimalPipe, DatePipe, CommonModule],
  templateUrl: './mes-signalement.html',
  styleUrl: './mes-signalement.css',
})
export class MesSignalement {
  incidentService = inject(IncidentService);
  router = inject(Router);

  // Liste des signalements
  incidents = this.incidentService.incidents;

  // Chargement
  loading = signal(false);

  // Erreur
  error = signal<string | null>(null);

  activeFilter = signal<'tous' | 'en_attente' | 'en_cours' | 'resolu'>('tous');

  ngOnInit(): void {
    this.loadMyIncidents();
  }

  // FILTRAGE
  filteredIncidents = computed(() => {
    const filter = this.activeFilter();
    const incidents = this.incidents();

    if (filter === 'tous') {
      return incidents;
    }

    return incidents.filter(incident => incident.statut === filter);

  });

  loadMyIncidents(): void {
    this.loading.set(true);
    this.error.set(null);

    this.incidentService.getMyIncidents().subscribe({
        next: () => {
          console.log('Mes signalements :');
          this.loading.set(false);
        },
        error: (error) => {
          console.log('Erreur récupération signalements :',error);

          console.log('Erreur backend :',error.error);
          this.loading.set(false);
          this.error.set('Impossible de récupérer vos signalements.');
        }
      });

  }

  // CHANGEMENT D'ONGLET
  setFilter(filter: 'tous' | 'en_attente' | 'en_cours' | 'resolu'): void {
    this.activeFilter.set(filter);
  }

  goHome(){
    this.router.navigate(['/']);
  }

}
