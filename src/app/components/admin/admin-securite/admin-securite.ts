import { Component, computed, inject, OnInit, signal} from '@angular/core';
import { AjouterMembre } from '../ajouter-membre/ajouter-membre';
import { UtilisateurService } from '../../../Services/admin-parametres.service';
import { User } from '../../../Models/auth/utilisateur';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-securite',
  imports: [AjouterMembre, CommonModule],
  templateUrl: './admin-securite.html',
  styleUrl: './admin-securite.css',
})
export class AdminSecurite implements OnInit {
  afficherModalAjout = false; // modal d'ajout d'un agent fermé par défaut
  dateAujourdHui = new Date()

  private readonly utilisateurService = inject(UtilisateurService);

  utilisateurs= signal<User[]>([]);


  nombreUtilisateurs = computed(() => this.utilisateurs().length);

  nombreAgents = computed(() =>
    this.utilisateurs().filter(u => u.role === 'agent').length
  );

  nombreCitoyens = computed(() =>
    this.utilisateurs().filter(u => u.role === 'citoyen').length
  );

  ngOnInit(): void {
    this.chargerUtilisateurs();
  }

  chargerUtilisateurs() {
    this.utilisateurService.getUtilisateurs().subscribe({
      next: (data) => {
        this.utilisateurs.set(data);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs', err);
      }
    });
  }

  // Getters pour les compteurs (calculés à partir de la liste, pas d'appel API séparé)
 // get nombreAgents(): number {
   // return this.utilisateurs().filter(u => u.role === 'agent').length; // retourne le nombre d'agents dans la liste des utilisateurs
 // }

 // get nombreCitoyens(): number {
   // return this.utilisateurs().filter(u => u.role === 'citoyen').length; // retourne le nombre de citoyens dans la liste des utilisateurs
  //}

  //get nombreUtilisateurs(): number{
  //  return this.utilisateurs().length
  //}
}
