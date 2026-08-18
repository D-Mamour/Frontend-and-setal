import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { AdminprofilService } from '../../../Services/admin-dashboard-service';
import { User } from '../../../Models/auth/utilisateur';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [], // N'oubliez pas d'importer CommonModule si vous utilisez les pipes ou l'ancienne syntaxe
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  private readonly adminService = inject(AdminprofilService);
  private readonly router = inject(Router);

  readonly adminuser = signal<User | null>(null);
  readonly profil = signal('');

  // Raccourci vers la liste stockée dans le service
  readonly signalements = this.adminService.listeSignalements;

  ngOnInit(): void {
    // 1. Récupération du profil de l'administrateur
    this.adminService.profil().subscribe({
      next: (data) => this.adminuser.set(data),
      error: () => console.error("Erreur de récupération du profil")
    });

    // 2. CORRECTION : On déclenche l'appel des signalements dès le chargement du composant !
    this.adminService.statistique().subscribe({
      error: (err) => console.error("Erreur de récupération des signalements", err)
    });
  }

  // --- Calculs Frontend 100% réactifs ---

  // Nombre total
  readonly totalSignalements = computed(() => this.signalements().length);

  // Compteur : En Attente
  readonly enAttenteCount = computed(() => {
    return this.signalements().filter(s => s.statut === 'en_attente').length;
  });


  readonly critiqueCount = computed(() => {
    return this.signalements().filter(s => s.statut === 'en_cours').length;
  });

  // Compteur : Résolu
  // CORRECTION : Changement de 'en_cours' par 'resolu' pour filtrer correctement
  readonly resolu = computed(() => {
    return this.signalements().filter(s => s.statut === 'resolu').length;
  });
}
