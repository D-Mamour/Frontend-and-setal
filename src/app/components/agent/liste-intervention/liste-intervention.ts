import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Incident, Intervention } from '../../../Models/infos/incident';
import { AgentService } from '../../../Services/agent.service';
import { environment } from '../../../../environments/environment';
import { Navbar } from "../../navbar/navbar";

type StatutFiltre = 'tous' | 'en_attente' | 'en_cours' | 'resolu';

// Vue combinée : un incident + son intervention associée (si elle existe)
interface InterventionAffichage {
  incident: Incident;
  interventionId: number | null;
  statut: string;
}

@Component({
  selector: 'app-liste-intervention',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './liste-intervention.html',
  styleUrl: './liste-intervention.css'
})
export class ListeIntervention implements OnInit {

  private agentService = inject(AgentService);
  private router = inject(Router);

  private _items = signal<InterventionAffichage[]>([]);

  chargement = signal(false);
  erreur = signal<string | null>(null);


  ongletActif = signal<StatutFiltre>('tous');

  interventionSelectionnee = signal<InterventionAffichage | null>(null);
  actionEnCours = signal(false);
  actionErreur = signal<string | null>(null);

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.chargement.set(true);
    this.erreur.set(null);

    forkJoin({
      incidents: this.agentService.getIncident(),
      interventions: this.agentService.getInterventions()
    }).subscribe({
      next: ({ incidents, interventions }) => {
        const items: InterventionAffichage[] = incidents.map(incident => {
          const interventionLiee = interventions.find(
            iv => Number(iv.signalement) === incident.id
          );
          return {
            incident,
            interventionId: interventionLiee?.id ?? null,
            statut: interventionLiee?.statut ?? incident.statut ?? 'en_attente'
          };
        });
        this._items.set(items);
        this.chargement.set(false);
      },
      error: (err) => {
        this.chargement.set(false);
        this.erreur.set("Impossible de charger les interventions.");
        console.error(err);
      }
    });
  }

  itemsFiltres = computed(() => {
    const onglet = this.ongletActif();
    const liste = this._items();
    if (onglet === 'tous') return liste;
    return liste.filter(i => i.statut === onglet);
  });

  changerOnglet(statut: StatutFiltre): void {
    this.ongletActif.set(statut);
  }

  badgeInfo(statut: string): { label: string; classe: string } {
    switch (statut) {
      case 'resolu':
        return { label: 'RESOLUS', classe: 'bg-green-100 text-green-700' };
      case 'en_cours':
        return { label: 'EN COURS', classe: 'bg-blue-100 text-blue-700' };
      case 'en_attente':
        return { label: 'EN ATTENTE', classe: 'bg-orange-100 text-orange-700' };
      default:
        return { label: statut.toUpperCase(), classe: 'bg-gray-100 text-gray-700' };
    }
  }

  localisationTexte(incident: Incident): string {
    const lat = Number(incident.latitude);
    const lng = Number(incident.longitude);
    if (isNaN(lat) || isNaN(lng)) {
      return 'Position non disponible';
    }
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }

  dateFormatee(dateIso: string | null | undefined): string {
    if (!dateIso) return 'Date inconnue';
    const date = new Date(dateIso);
    if (isNaN(date.getTime())) return 'Date inconnue';
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) +
      ', ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  imageUrlValide(incident: Incident): string | null {
    if (!incident.urlImage) return null;
    return incident.urlImage.startsWith('http')
      ? incident.urlImage
      : `${environment.apiUrl}${incident.urlImage}`;
  }

  voirDetails(incident: Incident): void {
    this.router.navigate(['/agent/signalements', incident.id]);
  }

  goBack(): void {
    window.history.back();
  }

  // --- Popup Terminer / Annuler ---

  ouvrirPopup(item: InterventionAffichage): void {
    if (item.statut == 'resolu') {
      return; // rien ne se passe si déja resolu
    }
    if (item.interventionId == null){
      this.voirDetails(item.incident);
      return
    }
    this.actionErreur.set(null);
    this.interventionSelectionnee.set(item);
  }

  fermerPopup(): void {
    if (this.actionEnCours()) return;
    this.interventionSelectionnee.set(null);
    this.actionErreur.set(null);
  }

  terminer(): void {
    const item = this.interventionSelectionnee();
    if (!item || item.interventionId == null || this.actionEnCours()) return;

    this.actionEnCours.set(true);
    this.actionErreur.set(null);

    this.agentService.terminerIntervention(item.interventionId).subscribe({
      next: () => {
        this._items.update(liste =>
          liste.map(i => i.interventionId === item.interventionId ? { ...i, statut: 'resolu' } : i)
        );
        this.actionEnCours.set(false);
        this.interventionSelectionnee.set(null);
      },
      error: (err) => {
        this.actionEnCours.set(false);
        this.actionErreur.set("Impossible de terminer l'intervention. Réessayez.");
        console.error(err);
      }
    });
  }

  annuler(): void {
    const item = this.interventionSelectionnee();
    if (!item || item.interventionId == null || this.actionEnCours()) return;

    this.actionEnCours.set(true);
    this.actionErreur.set(null);

    this.agentService.annulerIntervention(item.interventionId).subscribe({
      next: () => {
        this._items.update(liste =>
          liste.map(i => i.interventionId === item.interventionId ? { ...i, statut: 'en_attente' } : i)
        );
        this.actionEnCours.set(false);
        this.interventionSelectionnee.set(null);
      },
      error: (err) => {
        this.actionEnCours.set(false);
        this.actionErreur.set("Impossible d'annuler l'intervention. Réessayez.");
        console.error(err);
      }
    });
  }
}
