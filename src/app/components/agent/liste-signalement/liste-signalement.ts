import { AgentService } from './../../../Services/agent.service';
import { AuthService } from './../../../Services/auth-citoyen.service';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowTrendUp,
  faCircleCheck,
  faTriangleExclamation,
  faChartColumn
} from '@fortawesome/free-solid-svg-icons';
import { Navbar } from "../../navbar/navbar";
import { Router, RouterLink } from '@angular/router';
import { Incident } from '../../../Models/infos/incident';

@Component({
  selector: 'app-liste-signalement',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, Navbar, RouterLink],
  templateUrl: 'liste-signalement.html'
})
export class ListeSignalement implements OnInit {

  faArrowTrendUp = faArrowTrendUp;
  faCircleCheck = faCircleCheck;
  faTriangleExclamation = faTriangleExclamation;
  faChartColumn = faChartColumn;

  // ===== Signals =====
  signalements = signal<Incident[]>([]);
  estEnChargement = signal<boolean>(false);
  messageErreur = signal<string>('');

  quartiers = [
    { nom: 'Médina', valeur: 450 },
    { nom: 'Plateau', valeur: 320 },
    { nom: 'Yoff', valeur: 210 },
    { nom: 'Fann', valeur: 180 },
    { nom: 'Mermoz', valeur: 150 }
  ];

  // ===== Computed =====

  hauteurMax = computed(() =>
    Math.max(...this.quartiers.map(q => q.valeur))
  );

  totalSignalements = computed(() => this.signalements().length);

  tauxResolution = computed(() => {
    const liste = this.signalements();
    if (liste.length === 0) {
      return 0;
    }
    const resolus = liste.filter(s =>
      ['resolu', 'résolu', 'traite', 'traité', 'termine', 'terminé'].includes(
        (s.statut ?? '').toLowerCase()
      )
    ).length;
    return Math.round((resolus / liste.length) * 1000) / 10;
  });

  dernierSignalement = computed<Incident | null>(() => {
    const liste = this.signalements();
    if (liste.length === 0) {
      return null;
    }
    return [...liste].sort(
      (a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
    )[0];
  });

  // Injection des services
  authService = inject(AuthService);
  agentService = inject(AgentService);
  router = inject(Router);

  ngOnInit(): void {
    this.chargerProfil();
    this.chargerSignalements();
  }

  chargerProfil(): void {
    if (this.authService.currentUser()) {
      return;
    }

    this.authService.getProfil().subscribe({
      next: (user) => {
        console.log('Agent connecté :', user);
      },
      error: (error) => {
        console.error('Erreur récupération profil :', error);
      }
    });
  }

  chargerSignalements(): void {
    this.estEnChargement.set(true);
    this.messageErreur.set('');

    this.agentService.getIncident().subscribe({
      next: (data) => {
        console.log('Incidents reçus :', data);
        this.signalements.set(data);
        this.estEnChargement.set(false);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des incidents:', err);
        this.messageErreur.set('Impossible de charger la liste des signalements.');
        this.estEnChargement.set(false);
      }
    });
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

  deconnexion(): void {
    this.authService.logout();
    this.router.navigate(['/connexion']);
  }
}
