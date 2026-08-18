import { Component, inject, OnInit, computed, effect} from '@angular/core';
import { AdminprofilService } from '../../../Services/admin-dashboard-service';
import { Router } from '@angular/router';
import * as L from 'leaflet'; // Importation de Leaflet

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  // On passe le service en "public" pour pouvoir l'utiliser directement si besoin
  readonly adminService = inject(AdminprofilService);
  private readonly router = inject(Router);


  // on crée un raccourci vers le signal UNIQUE du service
  readonly adminuser = this.adminService.adminuser;

  // Raccourci vers la liste stockée dans le service
  readonly signalements = this.adminService.listeSignalements;

    // Référence locale pour la carte Leaflet
  private map!: L.Map;
  private markerGroup!: L.LayerGroup;

  constructor() {
    effect(() => {
      const data = this.signalements();
      if (this.map && data.length > 0){
        this.mettreAjourMarqueurs(data);
      }
    }
  )
  }

  ngOnInit(): void {
    // 1. Récupération du profil de l'administrateur
    this.adminService.profil().subscribe({
      next: (data) => {
        // Enregistre les données directement dans le service global !
        this.adminService.adminuser.set(data);
      },
      error: () => console.error("Erreur de récupération du profil")
    });

    // Déclenchement de l'appel des signalements
    this.adminService.incidents().subscribe({
      error: (err: any) => console.error("Erreur de récupération des signalements", err)
    });
  }


private initMap(): void {
  // 1. Initialisation de la carte sur Dakar
  this.map = L.map('map-container').setView([14.7167, -17.4677], 12);

  // 2. Chargement des tuiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(this.map);

  this.markerGroup = L.layerGroup().addTo(this.map);

  // 🚀 LA CORRECTION : Force Leaflet à recalculer sa taille après 100ms
  setTimeout(() => {
    if (this.map) {
      this.map.invalidateSize();
    }
  }, 100);
}


  private mettreAjourMarqueurs(incidents: any[]): void {
    // On vide les anciens marqueurs pour éviter les doublons
    this.markerGroup.clearLayers();

    incidents.forEach(s => {
      // Choix de la couleur selon votre logique
      let couleur = 'yellow'; // En attente
      if (s.statut === 'resolu') couleur = 'green';
      if (s.statut === 'en_cours' || s.priorite === 'haute') couleur = 'red';

      // Création d'un icône de couleur personnalisé en SVG
      const customIcon = L.divIcon({
        className: 'custom-pin',
        html: `<div style="background-color: ${couleur}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      // Ajout du marqueur sur la carte avec un popup explicatif
      L.marker([s.latitude, s.longitude], { icon: customIcon })
        .bindPopup(`<b>Statut:</b> ${s.statut}<br><b>Description:</b> ${s.description}`)
        .addTo(this.markerGroup);
    });
  }


   // --- Calculs Frontend 100% réactifs ---

  readonly totalSignalements = computed(() => this.signalements().length);

  readonly enAttenteCount = computed(() => {
    return this.signalements().filter(s => s.statut === 'en_attente').length;
  });

  readonly critiqueCount = computed(() => {
    return this.signalements().filter(s => s.statut === 'en_cours').length;
  });

  readonly resolu = computed(() => {
    return this.signalements().filter(s => s.statut === 'resolu').length;
  });
}
