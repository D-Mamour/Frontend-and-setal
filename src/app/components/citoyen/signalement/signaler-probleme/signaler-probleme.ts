import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GeolocalisationError, GeolocalisationService, PositionGeo } from '../../../../Services/geolocalisation.service';

type EtatLocalisation = 'chargement' | 'obtenue' | 'refusee' | 'indisponible';

@Component({
  selector: 'app-signaler-probleme',
  imports: [FormsModule, CommonModule],
  templateUrl: './signaler-probleme.html',
  styleUrl: './signaler-probleme.css',
})
export class SignalerProbleme implements OnInit {
  router = inject(Router);
  private geolocalisationService = inject(GeolocalisationService);

  etatLocalisation: EtatLocalisation = 'chargement';
  position: PositionGeo | null = null;
  messageErreurLocalisation = '';

  ngOnInit(): void {
    this.demanderPosition();
  }

  demanderPosition(): void {
    this.etatLocalisation = 'chargement';
    this.messageErreurLocalisation = '';

    this.geolocalisationService.obtenirPosition().subscribe({
      next: (position) => {
        this.position = position;
        this.etatLocalisation = 'obtenue';
      },
      error: (erreur: GeolocalisationError) => {
        this.position = null;
        this.etatLocalisation =
          erreur.code === 'PERMISSION_DENIED' ? 'refusee' : 'indisponible';
        this.messageErreurLocalisation = erreur.message;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  onSubmit(): void {
    // Garde bloquante : pas de position => pas d'envoi
    if (!this.position) {
      return;
    }

    const payload = {
      latitude: this.position.latitude,
      longitude: this.position.longitude,
      // TODO: ajouter description, image, résultat de l'analyse IA une fois branchés
    };

    // TODO: remplacer par l'appel réel au service de création de signalement
    // this.signalementService.creer(payload).subscribe(() => this.router.navigate(['/signalement-success']));

    setTimeout(() => {
      this.router.navigate(['/signalement-success']);
    }, 800);
  }
}
