import { AgentService } from './../../../Services/agent.service';
import { AuthService } from './../../../Services/auth-citoyen.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowTrendUp,
  faCircleCheck,
  faTriangleExclamation,
  faChartColumn
} from '@fortawesome/free-solid-svg-icons';
import { Navbar } from "../../navbar/navbar";
import { Router } from '@angular/router';
import { Incident } from '../../../Models/infos/incident';

@Component({
  selector: 'app-liste-signalement',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, Navbar],
  templateUrl: 'liste-signalement.html'
})
export class ListeSignalement  implements OnInit{

  faArrowTrendUp = faArrowTrendUp;
  faCircleCheck = faCircleCheck;
  faTriangleExclamation = faTriangleExclamation;
  faChartColumn = faChartColumn;

  signalements : Incident[] = [];
  estEnChargement: boolean = true;
  messageErreur: string= '';

  quartiers = [
    {
      nom: 'Médina',
      valeur: 450
    },
    {
      nom: 'Plateau',
      valeur: 320
    },
    {
      nom: 'Yoff',
      valeur: 210
    },
    {
      nom: 'Fann',
      valeur: 180
    },
    {
      nom: 'Mermoz',
      valeur: 150
    }
  ];


get hauteurMax(): number {
  return Math.max(...this.quartiers.map(q => q.valeur));
}

// ===== Statistiques dynamiques basées sur les signalements =====

get totalSignalements(): number {
  return this.signalements.length;
}

get tauxResolution(): number {
  if (this.signalements.length === 0) {
    return 0;
  }
  const resolus = this.signalements.filter(s =>
    ['resolu', 'résolu', 'traite', 'traité', 'termine', 'terminé'].includes(
      (s.statut ?? '').toLowerCase()
    )
  ).length;
  return Math.round((resolus / this.signalements.length) * 1000) / 10;
}

get dernierSignalement(): Incident | null {
  if (this.signalements.length === 0) {
    return null;
  }
  return [...this.signalements].sort(
    (a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
  )[0];
}

// Formate la date de création en "Il y a Xh" / "Il y a X jours"
formatTemps(dateCreation: string): string {
  const date = new Date(dateCreation);
  const maintenant = new Date();
  const diffMs = maintenant.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHeures = Math.floor(diffMinutes / 60);
  const diffJours = Math.floor(diffHeures / 24);

  if (diffMinutes < 1) return "À l'instant";
  if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
  if (diffHeures < 24) return `Il y a ${diffHeures}h`;
  if (diffJours === 1) return 'Il y a 1 jour';
  return `Il y a ${diffJours} jours`;
}

// Retourne les classes de couleur du badge selon la priorité
classePriorite(priorite: string): { bg: string; text: string } {
  const p = (priorite ?? '').toLowerCase();
  if (p === 'critique') {
    return { bg: 'bg-red-50', text: 'text-red-600' };
  }
  if (p === 'priorite' || p === 'prioritaire' || p === 'haute') {
    return { bg: 'bg-orange-50', text: 'text-orange-600' };
  }
  return { bg: 'bg-slate-50', text: 'text-slate-600' };
}
  //Injection des services
  authService = inject(AuthService);
  agentService = inject(AgentService);
  router = inject(Router);


  ngOnInit(): void {
    this.chargerProfil();
    this.chargerSignalements();
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
        console.log('Agent connecté :', user);
      },

      error: (error) => {
        console.error('Erreur récupération profil :',error);
      }

    });
  }

  chargerSignalements(){
    this.estEnChargement = true;
    this.agentService.getIncident().subscribe({
      next:(data) =>{
        this.signalements = data;
        this.estEnChargement = false;
      },
      error: (err)=>{
        console.error('Erreur lors du chargement des incidents:', err);
        this.messageErreur = 'Impossible de charger la liste des signalemnts.';
        this.estEnChargement = false;
      }
    })
  }

  deconnexion(): void {
    this.authService.logout();
    this.router.navigate(['/connexion']);
  }

}
