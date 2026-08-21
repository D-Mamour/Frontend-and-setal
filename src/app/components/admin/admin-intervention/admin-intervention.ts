import { IncidentService } from './../../../Services/incident.service';
import { Observable } from 'rxjs';
import { User } from '../../../Models/auth/utilisateur';
import { AdminprofilService } from './../../../Services/admin-dashboard-service';
import { Component, EventEmitter, inject, OnInit, Output, input, signal, computed } from '@angular/core';
import { Incident } from '../../../Models/incident.model';
import { Intervention } from '../../../Models/infos/incident';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

type StatutFiltre = 'tous' | 'en_attente' | 'en_cours' | 'resolu';

@Component({
  selector: 'app-admin-intervention',
  imports: [DatePipe, NgClass, RouterLink],
  templateUrl: './admin-intervention.html',
  styleUrl: './admin-intervention.css',
})
export class AdminIntervention implements OnInit{

  private readonly incidentService = inject(AdminprofilService)

  readonly agentUser = signal<User | null>(null)

  incident = signal<Intervention[]>([])

  loading = signal(false);
  errorMessage = signal('');

  // États des filtres actifs
  statutActif = signal<StatutFiltre>('tous');
  termeRecherche = signal<string>('');
  utilisateurConnecte = this.incidentService.adminuser;

  // Configuration de la pagination
  pageActuelle = signal<number>(1);
  elementsParPage = signal<number>(3); // 3 éléments par page

    ngOnInit(): void {
    this.chargerIntervention();

  }


  chargerIntervention() {
    this.loading.set(true);
    this.errorMessage.set('');


    this.incidentService.intervention().subscribe({
      next: (data) => { console.log("intervention recuperer", data)
        this.incident.set(data)
        this.loading.set(false);
      },
      error: (error) => {
        console.log("erreur API", error);
        this.errorMessage.set('Impossible de charger les signalements.');
        this.loading.set(false);
      }
    })

  }

  chargerProfilUtilisateur() {
    if (!this.utilisateurConnecte()) {
      this.incidentService.profil().subscribe({
        next: (user) => console.log("Profil utilisateur chargé :", user),
        error: (err) => console.error("Erreur lors du chargement du profil :", err)
      });
    }
  }

  changerStatut(statut: StatutFiltre): void{
    this.statutActif.set(statut)
  }

  onRecherche(valeur: string): void{
    this.termeRecherche.set(valeur)
  }

    // LOGIQUE DE FILTRAGE ULTRA-CUMULATIVE (Statut + Catégorie + Priorité + Recherche)
  readonly listeTotaleFiltree = computed(() => {
    const statut = this.statutActif();
      let liste = this.incident() || [];
    const terme = this.termeRecherche().toLowerCase().trim();


    if (statut !== 'tous') {
      liste = liste.filter(incident => incident.statut === statut);
    }

    if (terme) {
      liste = liste.filter(incident =>
        incident.agent?.prenom?.toLowerCase().includes(terme) ||
        incident.signalement?.type_incident?.toLowerCase().includes(terme) ||
        incident.statut?.toString().includes(terme)
      );
    }
    return liste;
  });

    // DÉCOUPE DE PAGINATION POUR LE RENDU HTML
  readonly signalementsPagine = computed(() => {
    const debut = (this.pageActuelle() - 1) * this.elementsParPage();
    const fin = debut + this.elementsParPage();
    return this.listeTotaleFiltree().slice(debut, fin);
  });

  readonly totalPages = computed(() => {
    const totalElements = this.listeTotaleFiltree().length;
    return Math.ceil(totalElements / this.elementsParPage()) || 1;
  });

  // NAVIGATION DE PAGINATION
  pageSuivante(): void {
    if (this.pageActuelle() < this.totalPages()) {
      this.pageActuelle.update(p => p + 1);
    }
  }

  pagePrecedente(): void {
    if (this.pageActuelle() > 1) {
      this.pageActuelle.update(p => p - 1);
    }
  }

    // COMPTEURS SUR LES ONGLETS (Toujours basés sur la liste brute d'origine)
  get nombreEnAttente(): number {
    return this.incident().filter(i => i.statut === 'en_attente').length;
  }

  get nombreEnCours(): number {
    return this.incident().filter(i => i.statut === 'en_cours').length;
  }

  get nombreResolus(): number {
    return this.incident().filter(i => i.statut === 'resolu').length;
  }

    // CLASSES DE RENDU VISUEL TAILWIND
  getStatutClasses(statut: string): string {
    switch (statut) {
      case 'resolu': return 'bg-green-50 text-green-600';
      case 'en_cours': return 'bg-blue-50 text-blue-600';
      case 'en_attente': return 'bg-slate-100 text-slate-500';
      default: return 'bg-gray-100 text-gray-500';
    }
  }

  getStatutIcon(statut: string): string {
    switch (statut) {
      case 'resolu': return 'fa-circle-check';
      case 'en_cours': return 'fa-spinner animate-spin';
      case 'en_attente': return 'fa-clock';
      default: return 'fa-circle';
    }
  }



}
