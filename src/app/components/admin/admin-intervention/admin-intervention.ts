import { IncidentService } from './../../../Services/incident.service';
import { Observable } from 'rxjs';
import { User } from '../../../Models/auth/utilisateur';
import { AdminprofilService } from './../../../Services/admin-dashboard-service';
import { Component, EventEmitter, inject, OnInit, Output, input, signal } from '@angular/core';
import { Incident } from '../../../Models/incident.model';
import { Intervention } from '../../../Models/infos/incident';

type StatutFiltre = 'tous' | 'en_attente' | 'en_cours' | 'resolu';

@Component({
  selector: 'app-admin-intervention',
  imports: [],
  templateUrl: './admin-intervention.html',
  styleUrl: './admin-intervention.css',
})
export class AdminIntervention  implements OnInit{

  private readonly incidentService = inject(AdminprofilService)

  readonly agentUser = signal<User | null>(null)

  readonly incident = signal<Intervention[]>([])

  // L'enfant déclare un input réactif (il se comporte comme un Signal)
  readonly statutDuParent = input<string>('tous');
  @Output() changerFiltre = new EventEmitter<StatutFiltre>();

  ngOnInit(): void {
    this.incidentService.incidents().subscribe({
      next: (data) => (data),
      error: (err) => console.log("erreur lors de la recuperations des incidents", err)
    })
  }

  profilAgent(){
    this.incidentService.profil().subscribe({
      next: (data) => console.log("Profil bien charger", data),
      error: (err) => console.log("erreur lors de le recuperation du profil")
    })
  }

  statutActif() {
    // On lit sa valeur avec des parenthèses comme un Signal classique !
    console.log("Le statut actuel du parent est :", this.statutDuParent());
  }
  changeStatut(nouveauStatut: StatutFiltre){
    this.changerFiltre.emit(nouveauStatut)
  }


}
