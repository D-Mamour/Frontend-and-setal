import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { AdminprofilService } from '../../../Services/admin-dashboard-service';
import { Incident } from '../../../Models/incident.model';
import { AdminIntervention } from '../admin-intervention/admin-intervention';

type StatutFiltre = 'tous' | 'en_attente' | 'en_cours' | 'resolu';

@Component({
  selector: 'app-gestion-signalement',
  standalone: true,
  imports: [RouterLink, DatePipe, NgClass, CommonModule, AdminIntervention],
  templateUrl: './gestion-signalement.html',
  styleUrl: './gestion-signalement.css',
})
export class GestionSignalement implements OnInit {
  incidentService = inject(AdminprofilService);

  // Signaux réactifs pour les données et le chargement
  signalements = signal<Incident[]>([]);
  utilisateurConnecte = this.incidentService.adminuser;
  loading = signal(false);
  errorMessage = signal('');

  // États des filtres actifs
  statutActif = signal<StatutFiltre>('tous');
  categorieSelectionnee = signal<string>('tous');
  termeRecherche = signal<string>('');
  prioriteFiltre = signal<string>('tous'); // Le seul signal qu'on va utiliser pour la priorité

  // Configuration de la pagination
  pageActuelle = signal<number>(1);
  elementsParPage = signal<number>(3); // 3 éléments par page

  // Signal computed sécurisé pour le prénom de l'admin connecté
  prenomCitoyen = computed(() => {
    const user = this.utilisateurConnecte();
    if (user && user.first_name) {
      return user.first_name;
    }
    return user?.username || 'Utilisateur';
  });

  // Signal computed pour savoir si l'utilisateur possède un compte valide
  estConnecte = computed(() => {
    const user = this.utilisateurConnecte();
    return user !== null && user !== undefined && !!user.id;
  });

  ngOnInit(): void {
    this.chargerSignalement();
    this.chargerProfilUtilisateur();
  }

  chargerSignalement() {
    this.loading.set(true);
    this.errorMessage.set('');

    this.incidentService.incidents().subscribe({
      next: (donnees) => {
        console.log("signalements recuperer", donnees);
        // FIX IMPORTANT : On enregistre enfin les données reçues de l'API pour remplir le tableau
        this.signalements.set(donnees);
        this.loading.set(false);
      },
      error: (error) => {
        console.log("erreur API", error);
        this.errorMessage.set('Impossible de charger les signalements.');
        this.loading.set(false);
      }
    });
  }

  chargerProfilUtilisateur() {
    if (!this.utilisateurConnecte()) {
      this.incidentService.profil().subscribe({
        next: (user) => console.log("Profil utilisateur chargé :", user),
        error: (err) => console.error("Erreur lors du chargement du profil :", err)
      });
    }
  }

  // Actions de changement de filtres (remettent systématiquement à la page 1)
  changerStatut(statut: StatutFiltre): void {
    this.statutActif.set(statut);
    this.pageActuelle.set(1);
  }

  selectionneCategorie(categorie: string): void {
    this.categorieSelectionnee.set(categorie);
    this.pageActuelle.set(1);
  }

  selectionnePriorite(priorite: string): void {
    // FIX CONFLIT VARIABLE : Met à jour le bon signal lu par votre filtre de liste
    this.prioriteFiltre.set(priorite);
    this.pageActuelle.set(1);
  }

  onRecherche(valeur: string): void {
    this.termeRecherche.set(valeur);
    this.pageActuelle.set(1);
  }

  // Extraire la liste des catégories dynamiques depuis l'API
  readonly categorie = computed(() => {
    const types = this.signalements().map(s => s.type_incident).filter((t): t is string => !!t);
    return ['tous', ...new Set(types)];
  });

  // Extraire la liste des priorités dynamiques depuis l'API
  readonly priorite = computed(() => {
    const priorites = this.signalements().map(s => s.priorite).filter((p): p is string => !!p);
    return ['tous', ...new Set(priorites)];
  });

  // LOGIQUE DE FILTRAGE ULTRA-CUMULATIVE (Statut + Catégorie + Priorité + Recherche)
  readonly listeTotaleFiltree = computed(() => {
    const statut = this.statutActif();
    const categorie = this.categorieSelectionnee();
    const priorite = this.prioriteFiltre();
    const terme = this.termeRecherche().toLowerCase().trim();
    let liste = this.signalements() || [];

    if (statut !== 'tous') {
      liste = liste.filter(incident => incident.statut === statut);
    }
    if (categorie !== 'tous') {
      liste = liste.filter(incident => incident.type_incident === categorie);
    }
    if (priorite !== 'tous') {
      liste = liste.filter(incident =>
        incident.priorite?.toLowerCase() === priorite.toLowerCase()
      );
    }
    if (terme) {
      liste = liste.filter(incident =>
        incident.description?.toLowerCase().includes(terme) ||
        incident.type_incident?.toLowerCase().includes(terme) ||
        incident.citoyen?.toString().includes(terme)
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
    return this.signalements().filter(i => i.statut === 'en_attente').length;
  }

  get nombreEnCours(): number {
    return this.signalements().filter(i => i.statut === 'en_cours').length;
  }

  get nombreResolus(): number {
    return this.signalements().filter(i => i.statut === 'resolu').length;
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

  getPrioriteClasses(priorite?: string): string {
    switch (priorite?.toLowerCase()) {
      case 'haute': return 'bg-red-50 text-red-500';
      case 'moyenne': return 'bg-orange-50 text-orange-500';
      case 'basse': return 'bg-green-50 text-green-600';
      default: return 'bg-slate-100 text-slate-500';
    }
  }
}
