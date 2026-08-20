import { Component, computed, inject, OnInit, signal } from '@angular/core';
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
  utilisateurConnecte = this.incidentService.adminuser; // Récupère le Signal de l'utilisateur
  loading = signal(false);
  errorMessage = signal('');


 // Onglet actuellement sélectionné
  statutActif = signal<StatutFiltre>('tous');

  // La liste complète, déjà chargée depuis l'API
    // Catégorie actuellement sélectionnée ('tous' par défaut)
  readonly categorieSelectionnee = signal('tous');
  readonly termeRecherche = signal('');
  readonly prioriteFiltre = signal('tous')

    // AJOUT DES SIGNALS POUR LA PAGINATION
  pageActuelle = signal<number>(1);
  elementsParPage = signal<number>(3); // Modifiez ce chiffre pour afficher 10, 20 lignes...


// 3. Un Signal "computed" sécurisé pour le prénom de l'admin/agent connecté
prenomCitoyen = computed(() => {
  const user = this.utilisateurConnecte();

  // On vérifie si l'utilisateur existe ET si sa propriété first_name est définie
  if (user && user.first_name) {
    return user.first_name;
  }

  // Si le champ est manquant, on regarde s'il y a un username ou on met 'Utilisateur'
  return user?.username || 'Utilisateur';
});

// 4. Un Signal "computed" pour savoir si l'utilisateur possède un compte valide
estConnecte = computed(() => {
  const user = this.utilisateurConnecte();
  return user !== null && user !== undefined && !!user.id;
});


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
    this.pageActuelle.set(1);
  }

    chargerProfilUtilisateur() {
    // Si le profil n'est pas encore chargé dans le service, on l'appelle
    if (!this.utilisateurConnecte()) {
      this.incidentService.profil().subscribe({
        next: (user) => console.log("Profil utilisateur chargé :", user),
        error: (err) => console.error("Erreur lors du chargement du profil :", err)
      });
    }
  }


  // 1. On filtre d'abord globalement (Statut + Catégorie)
  readonly listeTotaleFiltree = computed(() => {
    const statut = this.statutActif();
    const categorie = this.categorieSelectionnee();
    const terme = this.termeRecherche().toLowerCase().trim();
    let liste = this.signalements() || [];
    const priorite = this.prioriteFiltre();

    if (statut !== 'tous') {
      liste = liste.filter(incident => incident.statut === statut);
    }
    if (categorie !== 'tous') {
      liste = liste.filter(incident => incident.type_incident === categorie);
    }
    if (priorite !== 'tous'){
      liste = liste.filter(incident => incident.priorite === priorite)
    }
    if (terme){
      liste = liste.filter(incident =>
        incident.description?.toLowerCase().startsWith(terme) ||
        incident.type_incident?.toLowerCase().startsWith(terme) ||
        incident.citoyen?.prenom?.toLowerCase().startsWith(terme) ||
        incident.citoyen?.nom?.toLowerCase().includes(terme)
      )
    }
    return liste;
  });

onRecherche(valeur: string): void {
  this.termeRecherche.set(valeur);
  this.pageActuelle.set(1); // revient à la page 1 comme pour les autres filtres
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

  // Liste des catégories disponibles, calculée dynamiquement à partir des données
  readonly categorie = computed(() => {
    const types = this.signalements().map(s => s.type_incident).filter((t): t is string => !!t); // retire les null/undefined

    return ['tous', ...new Set(types)]; // Enleve les dédoublonnes
  })

  readonly signalementsSelecte = computed(() => {
    const categorie = this.categorieSelectionnee()

    if (categorie === 'tous'){
      return this.signalements()
    }
    return this.signalements().filter(s => s.type_incident === categorie)
  })

readonly prioriteSelectionnee = signal('tous');

readonly priorite = computed(() => {
  const priorites = this.signalements()
    .map(s => s.priorite)
    .filter((p): p is string => !!p);

  return ['tous', ...new Set(priorites)];
});

selectionnePriorite(priorite: string): void {
  this.prioriteSelectionnee.set(priorite);
  this.pageActuelle.set(1);
}

  selectionneCategorie(categorie: string): void {
    this.categorieSelectionnee.set(categorie);
    this.pageActuelle.set(1);
  }
  // SIGNAL POUR LA LISTE PAGINÉE (C'est elle qu'on affichera dans le HTML)
  readonly signalementsPagine = computed(() => {
    const debut = (this.pageActuelle() -1) * this.elementsParPage()
    const fin = debut + this.elementsParPage();

    return this.listeTotaleFiltree().slice(debut, fin)
  });

  readonly totalPages = computed(() => {
    const totalElements = this.listeTotaleFiltree().length
    return Math.ceil(totalElements / this.elementsParPage()) || 1;
  })

  // MÉTHODES DE NAVIGATION
  pageSuivante(): void{
    if (this.pageActuelle() < this.totalPages()){
      this.pageActuelle.update(p => p + 1)
    }
  }

  pagePrecedente(): void{
    if(this.pageActuelle() > 1) {
      this.pageActuelle.update(p => p -1)
    }
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
