import { AgentService } from './../../../Services/agent.service';
import { AuthService } from './../../../Services/auth-citoyen.service';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
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
import { IncidentService } from '../../../Services/incident.service';
import { ListeIntervention } from "../liste-intervention/liste-intervention";
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface RepartitionStatut {
  label: string;
  valeur: number;
  couleur: string;
}

@Component({
  selector: 'app-liste-signalement',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, Navbar, RouterLink],
  templateUrl: 'liste-signalement.html'
})
export class ListeSignalement implements OnInit, AfterViewInit, OnDestroy {

  faArrowTrendUp = faArrowTrendUp;
  faCircleCheck = faCircleCheck;
  faTriangleExclamation = faTriangleExclamation;
  faChartColumn = faChartColumn;

  // ===== Signals =====
  signalements = signal<Incident[]>([]);
  estEnChargement = signal<boolean>(false);
  messageErreur = signal<string>('');



  // ===== Chart.js (donut statuts) =====
  @ViewChild('donutChart') donutChartRef!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;


  repartitionStatuts = computed<RepartitionStatut[]>(() => {
    const liste = this.signalements();
    const compte = (statut: string) =>
      liste.filter(s => (s.statut ?? '').toLowerCase() === statut).length;

    return [
      { label: 'Résolus', valeur: compte('resolu'), couleur: '#16a34a' },      // vert
      { label: 'En cours', valeur: compte('en_cours'), couleur: '#eab308' },   // jaune
      { label: 'En attente', valeur: compte('en_attente'), couleur: '#dc2626' }, // rouge
      { label: 'Annulés', valeur: 0, couleur: '#9ca3af' }                       // gris
    ];
  });

  // ===== Computed =====
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
  incidentService = inject(IncidentService);


  ngOnInit(): void {
    this.chargerProfil();
    this.chargerSignalements();
    this.incidentService.getMyIncidents().subscribe();
  }

  ngAfterViewInit(): void {
    // Crée le donut dès que le canvas existe (même vide, il sera mis à jour
    // dès que les signalements arrivent).
    this.renderChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
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
        this.renderChart();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des incidents:', err);
        this.messageErreur.set('Impossible de charger la liste des signalements.');
        this.estEnChargement.set(false);
      }
    });
  }

  private renderChart(): void {
    const canvas = this.donutChartRef?.nativeElement;
    if (!canvas) {
      return;
    }

    const data = this.repartitionStatuts();

    if (this.chart) {
      this.chart.data.labels = data.map(d => d.label);
      this.chart.data.datasets[0].data = data.map(d => d.valeur);
      this.chart.data.datasets[0].backgroundColor = data.map(d => d.couleur);
      this.chart.update();
      return;
    }

    this.chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.label),
        datasets: [{
          data: data.map(d => d.valeur),
          backgroundColor: data.map(d => d.couleur),
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        cutout: '72%',
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        }
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
  AllSignalements(){
    this.router.navigateByUrl('agent/interventions')
  }

  deconnexion(): void {
    this.authService.logout();
    this.router.navigate(['/connexion']);
  }

}
