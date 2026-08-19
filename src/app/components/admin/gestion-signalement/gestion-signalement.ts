import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { AdminprofilService } from '../../../Services/admin-dashboard-service';
import { DatePipe, NgClass } from '@angular/common';
import { Incident } from '../../../Models/incident.model';

type StatutFiltre = 'tous' | 'en_attente' | 'en_cours' | 'resolu';

@Component({
  selector: 'app-gestion-signalement',
  imports: [RouterLink, DatePipe, NgClass,CommonModule],
  templateUrl: './gestion-signalement.html',
  styleUrl: './gestion-signalement.css',
})

export class GestionSignalement implements OnInit{
  incidentService = inject(AdminprofilService);
  signalements = this.incidentService.listeSignalements;
  loading = signal(false);
  errorMessage = signal('');


 // Onglet actuellement sélectionné
  statutActif = signal<StatutFiltre>('tous');

  ngOnInit(): void {
    this.chargerSignalement();
  }

  chargerSignalement(){
    this.loading.set(true);
    this.errorMessage.set('');

    this.incidentService.incidents().subscribe({
      next: (signalement) =>{
        console.log("signalements recuperer", signalement);
      },
      error: (error) => {
        console.log("erreur API", error);
        this.loading.set(false);
      }
    })
  }

  //Changement d'onglet
  changerStatut(statut: StatutFiltre): void {
    this.statutActif.set(statut);
  }

  // Signalements affichés dans le tableau
  signalementsFiltres(): Incident[] {

    const statut = this.statutActif();

    if (statut === 'tous') {
      return this.signalements();
    }

    return this.signalements().filter(
      incident => incident.statut === statut
    );
  }

  get nombreEnAttente(): number {

    return this.signalements().filter(
      incident => incident.statut === 'en_attente'
    ).length;

  }


  get nombreEnCours(): number {

    return this.signalements().filter(
      incident => incident.statut === 'en_cours'
    ).length;

  }


  get nombreResolus(): number {

    return this.signalements().filter(
      incident => incident.statut === 'resolu'
    ).length;

  }


  getStatutClasses(statut: string): string {

  switch (statut) {

    case 'resolu':
      return 'bg-green-50 text-green-600';

    case 'en_cours':
      return 'bg-blue-50 text-blue-600';

    case 'en_attente':
      return 'bg-slate-100 text-slate-500';

    default:
      return 'bg-gray-100 text-gray-500';

  }

}
getStatutIcon(statut: string): string {

  switch (statut) {

    case 'resolu':
      return 'fa-circle-check';

    case 'en_cours':
      return 'fa-spinner';

    case 'en_attente':
      return 'fa-clock';

    default:
      return 'fa-circle';

  }

}

getPrioriteClasses(priorite?: string): string {

  switch (priorite?.toLowerCase()) {

    case 'haute':
      return 'bg-red-50 text-red-500';

    case 'moyenne':
      return 'bg-orange-50 text-orange-500';

    case 'basse':
      return 'bg-green-50 text-green-600';

    default:
      return 'bg-slate-100 text-slate-500';

  }

}



}
