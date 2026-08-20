import { AfterViewInit, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Navbar } from "../../navbar/navbar";
import { Incident } from '../../../Models/incident.model';
import { GeolocalisationError, GeolocalisationService, PositionGeo } from '../../../Services/geolocalisation.service';
import { AgentService } from '../../../Services/agent.service';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet'; // Importation de Leaflet pour la carte
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signalement-map',
  imports: [Navbar, CommonModule, RouterLink],
  templateUrl: './signalement-map.html',
  styleUrl: './signalement-map.css',
})
export class SignalementMap implements OnInit, AfterViewInit {

  // Déclaration de la variable pour la carte Leaflet
  private map!: L.Map;

  // Déclaration de la variable pour le groupe de marqueurs
  private markersLayer!: L.LayerGroup;

  // Signal pour le filtre de priorité
  filtrePriorite = signal<string>('toutes');

  private readonly agentService = inject(AgentService);
  private readonly geolocalisationService = inject(GeolocalisationService);

  positionAgent = signal<PositionGeo | null>(null);
  incidents = signal<Incident[]>([]);
  erreurLocalisation = signal<string | null>(null);

  // Computed property pour obtenir les incidents proches de l'agent
  incidentsProches = computed(() => {
  const position = this.positionAgent();
  const priorite = this.filtrePriorite();

  if (!position) {
    return [];
  }

  return [...this.incidents()]
    .filter((incident) => {
      // Seulement les signalements en attente
      if (incident.statut !== 'en_attente') {
        return false;
      }

      // Filtrage par priorité
      if (
        priorite !== 'toutes' &&
        incident.priorite !== priorite
      ) {
        return false;
      }

      // Calcul de la distance
      const distance = this.calculerDistance(incident);

      // Seulement les signalements à moins de 5 km
      return distance !== null && distance <= 5;
    })
    .sort((a, b) => {
      const distanceA = this.calculerDistance(a) ?? Infinity;
      const distanceB = this.calculerDistance(b) ?? Infinity;

      return distanceA - distanceB;
    })
    .slice(0, 3);
  });

  // Initialisation de la carte Leaflet
  private initialiserCarte(): void {

  this.map = L.map('map').setView(
    [14.7167, -17.4677],
    13
  );

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; OpenStreetMap contributors'
    }
  ).addTo(this.map);

  this.markersLayer = L.layerGroup().addTo(this.map);
  }
  // Affichage des signalements sur la carte
  private afficherSignalementsSurCarte(): void {

  if (!this.markersLayer) {
    return;
  }

  this.markersLayer.clearLayers();

  for (const incident of this.incidentsProches()) {

    const marker = L.circleMarker([
      incident.latitude,
      incident.longitude
    ],
     {
        radius: 10,
        color: '#ffffff',
        weight: 3,
        fillColor: this.getCouleurPriorite(incident.priorite),
        fillOpacity: 1
      }
  );

    marker.addTo(this.markersLayer);
  }
  }

  // Détermine la couleur du marqueur en fonction de la priorité de l'incident
  private getCouleurPriorite(priorite: string): string {
  this.getClasseFiltre
  switch (priorite) {

    case 'haute':
      return '#d62828';

    case 'moyenne':
      return '#f97316';

    case 'faible':
      return '#2e7d32';

    default:
      return '#64748b';
  }
}

  // Détermine la classe CSS du bouton de filtre en fonction de la priorité sélectionnée
  getClasseFiltre(priorite: string): string {
  const actif = this.filtrePriorite() === priorite;

  if (!actif) {
    return 'bg-white text-[#64748b]';
  }

  switch (priorite) {
    case 'haute':
      return 'bg-[#d62828] text-white';

    case 'moyenne':
      return 'bg-orange-500 text-white';

    case 'faible':
      return 'bg-[#2e7d32] text-white';

    case 'toutes':
      return 'bg-[#2e7d32] text-white';

    default:
      return 'bg-white text-[#64748b]';
  }
}

  // Change la priorité du filtre et met à jour l'affichage des signalements sur la carte
  changerPriorite(priorite: string): void {
  this.filtrePriorite.set(priorite);
  this.afficherSignalementsSurCarte();
}

  // Mise à jour de la carte lorsque les incidents proches changent
  ngAfterViewInit(): void {
    this.initialiserCarte(); //appel de la fonction d'initialisation de la carte après que la vue soit initialisée
    this.afficherSignalementsSurCarte() //appel de la fonction d'affichage des signalements sur la carte après que la vue soit initialisée
  }

  ngOnInit(): void {

    // Obtenir la position de l'agent et charger les incidents
    this.geolocalisationService.obtenirPosition().subscribe({
      next: (position) => {
        this.positionAgent.set(position);
        this.chargerIncidents();
      },
      error: (err: GeolocalisationError) => {
        this.erreurLocalisation.set(err.message);
      }
    });
  }

  // Chargement des incidents depuis le service AgentService
  chargerIncidents(): void {
    this.agentService.getIncident().subscribe({
      next: (data) => {
        this.incidents.set(data);
        this.afficherSignalementsSurCarte(); // Mettre à jour la carte après le chargement des incidents
      },
      error: (err) => {
        console.error('Erreur chargement incidents', err);
      }
    });
  }

  // Calcul de la distance entre l'agent et un incident en kilomètres
  calculerDistance(incident: Incident): number | null {
    const position = this.positionAgent();
    if (!position) return null;

    return this.distanceKm(
      position.latitude, position.longitude,
      incident.latitude, incident.longitude
    );
  }

  // Calcul de la distance entre deux points géographiques en kilomètres
  private distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const rayonTerre = 6371;
    const dLat = this.versRadians(lat2 - lat1);
    const dLon = this.versRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.versRadians(lat1)) * Math.cos(this.versRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return rayonTerre * c;
  }

  // Conversion des degrés en radians
  private versRadians(degres: number): number {
    return degres * (Math.PI / 180);
  }
}
