import {
  Component, inject, AfterViewInit, OnDestroy, ViewChild, ElementRef,
  computed, effect, signal
} from '@angular/core';

import { Router } from '@angular/router';
import * as L from 'leaflet';
import { Chart, registerables } from 'chart.js';

import { AdminprofilService } from '../../../Services/admin-dashboard-service';
import { Incident } from '../../../Models/incident.model';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements AfterViewInit, OnDestroy {

  // ============================================================
  // SERVICES
  // ============================================================
  readonly adminService = inject(AdminprofilService);
  private readonly router = inject(Router);

  // ============================================================
  // SIGNALS
  // ============================================================
  readonly adminuser = this.adminService.adminuser;
  readonly signalements = this.adminService.listeSignalements;
  readonly profil = signal('');

  // ============================================================
  // LEAFLET
  // ============================================================
  private map!: L.Map;
  private markerGroup!: L.LayerGroup;

  // ============================================================
  // RÉFÉRENCES HTML
  // ============================================================
  @ViewChild('statistiquesChart') statistiquesChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('evolutionChart') evolutionChart!: ElementRef<HTMLCanvasElement>;

  // ============================================================
  // CHART.JS
  // ============================================================
  private lineChartInstance!: Chart;
  private doughnutChartInstance!: Chart;

  // ============================================================
  // CONSTRUCTOR
  // ============================================================
  constructor() {
    // Mise à jour automatique des marqueurs de la carte
    effect(() => {
      const data = this.signalements();
      if (this.map) {
        this.mettreAJourMarqueurs(data);
      }
    });

    // Mise à jour automatique des graphiques
    effect(() => {
      const donneesHebdo = this.signalementsParJour();
      const dechets = this.typeDechets();

      if (this.lineChartInstance) {
        this.lineChartInstance.data.datasets[0].data = donneesHebdo;
        this.lineChartInstance.update();
      }

      if (this.doughnutChartInstance) {
        this.doughnutChartInstance.data.datasets[0].data = [
          dechets.verre, dechets.plastique, dechets.metalCanettes, dechets.divers
        ];
        this.doughnutChartInstance.update();
      }
    });
  }

  // ============================================================
  // INITIALISATION
  // ============================================================
  ngAfterViewInit(): void {
    this.initMap();
    this.initCharts();

    // Récupération du profil administrateur
    this.adminService.profil().subscribe({
      next: (data) => this.adminService.adminuser.set(data),
      error: (err) => console.error('Erreur de récupération du profil', err)
    });

    // Déclenchement de l'appel des signalements
    this.adminService.incidents().subscribe({
      error: (err: any) => console.error("Erreur de récupération des signalements", err)
    });
  }

  // ============================================================
  // CARTE LEAFLET
  // ============================================================
  private initMap(): void {
    this.map = L.map('map-container').setView([14.7167, -17.4677], 12);

    // Fond de carte OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Groupe de marqueurs
    this.markerGroup = L.layerGroup().addTo(this.map);

    // Permet à Leaflet de recalculer la taille
    const container = document.getElementById('map-container');
    if (container) {
      const resizeObserver = new ResizeObserver(() => this.map.invalidateSize());
      resizeObserver.observe(container);
    }
  }

  // ============================================================
  // GRAPHIQUES CHART.JS
  // ============================================================
  private initCharts(): void {
    // 1. GRAPHIQUE D'ÉVOLUTION
    this.lineChartInstance = new Chart(this.evolutionChart.nativeElement, {
      type: 'line',
      data: {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        datasets: [{
          label: 'Signalements',
          data: this.signalementsParJour(),
          borderColor: '#2E7D32',
          backgroundColor: 'rgba(46, 125, 50, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, min: 0, max: 200, ticks: { stepSize: 50 } }
        }
      }
    });

    // 2. GRAPHIQUE DOUGHNUT
    this.doughnutChartInstance = new Chart(this.statistiquesChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Verre', 'Plastique', 'Métal et Canettes', 'Déchets Divers'],
        datasets: [{
          data: [
            this.typeDechets().verre,
            this.typeDechets().plastique,
            this.typeDechets().metalCanettes,
            this.typeDechets().divers
          ],
          backgroundColor: ['#2E7D32', '#F59E0B', '#EF4444', '#3B82F6'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '55%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { usePointStyle: false, boxWidth: 14, boxHeight: 14, padding: 15 }
          }
        }
      }
    });
  }

  // ============================================================
  // MARQUEURS LEAFLET
  // ============================================================
  private mettreAJourMarqueurs(incidents: Incident[]): void {
    this.markerGroup.clearLayers();

    incidents.forEach((s) => {
      let couleur = 'yellow';

      if (s.statut === 'resolu') {
        couleur = 'green';
      }

      if (s.statut === 'en_cours' || s.priorite === 'haute') {
        couleur = 'red';
      }

      const customIcon = L.divIcon({
        className: 'custom-pin',
        html: `<div style="background-color: ${couleur}; width: 18px; height: 18px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      L.marker([s.latitude, s.longitude], { icon: customIcon })
        .bindPopup(`<b>Statut :</b> ${s.statut}<br><b>Description :</b> ${s.description}`)
        .addTo(this.markerGroup);
    });
  }

  // ============================================================
  // STATISTIQUES
  // ============================================================
  readonly totalSignalements = computed(() => this.signalements().length);

  readonly enAttenteCount = computed(() =>
    this.signalements().filter(s => s.statut === 'en_attente').length
  );

  readonly critiqueCount = computed(() =>
    this.signalements().filter(s => s.statut === 'en_cours').length
  );

  readonly resolu = computed(() =>
    this.signalements().filter(s => s.statut === 'resolu').length
  );

  // ============================================================
  // RÉPARTITION DES DÉCHETS
  // ============================================================
  readonly typeDechets = computed(() => {
    const signalements = this.signalements();

    return {
      verre: signalements.filter(s => s.type_incident === 'Verre').length,
      plastique: signalements.filter(s => s.type_incident === 'Plastique').length,
      metalCanettes: signalements.filter(s => s.type_incident === 'Métal et Canettes').length,
      divers: signalements.filter(s => s.type_incident === 'Déchets Divers').length
    };
  });

  // ============================================================
  // ÉVOLUTION DES SIGNALEMENTS PAR JOUR
  // ============================================================
  readonly signalementsParJour = computed(() => {
    const comptes = [0, 0, 0, 0, 0, 0, 0];
    const listeSignalements = this.signalements();

    listeSignalements.forEach((s) => {
      if (s.dateCreation) {
        const date = new Date(s.dateCreation);
        let indexJour = date.getDay() - 1;

        if (indexJour === -1) {
          indexJour = 6; // Dimanche
        }

        comptes[indexJour]++;
      }
    });

    return comptes;
  });

  // ============================================================
  // DESTRUCTION
  // ============================================================
  ngOnDestroy(): void {
    if (this.lineChartInstance) {
      this.lineChartInstance.destroy();
    }

    if (this.doughnutChartInstance) {
      this.doughnutChartInstance.destroy();
    }

    if (this.map) {
      this.map.remove();
    }
  }
}
