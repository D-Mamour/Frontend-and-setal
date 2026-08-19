import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IncidentService } from '../../../Services/incident.service';
import { Navbar } from '../../navbar/navbar';
import { Incident } from '../../../Models/incident.model';

interface StatutMeta {
  label: string;
  badge: string;   // classes de fond + texte du badge
  dot: string;      // classe de couleur du point
}

@Component({
  selector: 'app-detail-signalement',
  imports: [Navbar],
  templateUrl: './detail-signalement.html',
  styleUrl: './detail-signalement.css',
})
export class DetailSignalement implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  incidentService = inject(IncidentService);
  incident = signal<Incident | null>(null);
  chargement = signal(true);
  erreur = signal(false);

  statutInfo = computed<StatutMeta>(() => this.resoudreStatut(this.incident()?.statut));

  prioriteLabel = computed(() => {
    const p = this.incident()?.priorite;
    if (!p) return 'Non définie';
    return { basse: 'Basse', moyenne: 'Moyenne', haute: 'Haute' }[p] ?? p;
  });

  typeLabel = computed(() => this.incident()?.type_incident ?? 'Non catégorisé');

  dateCreationFmt = computed(() => this.formaterDate(this.incident()?.dateCreation));
  dateModifFmt = computed(() => this.formaterDate(this.incident()?.dateModification));

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.erreur.set(true);
      this.chargement.set(false);
      return;
    }

    this.chargerSignalement(id);
  }

  chargerSignalement(id: number): void {
    this.incidentService.getIncidentById(id).subscribe({
      next: (incident) => {
        this.incident.set(incident);
        this.chargement.set(false);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du signalement :', error);
        this.erreur.set(true);
        this.chargement.set(false);
      }
    });
  }

  private resoudreStatut(statut?: string): StatutMeta {
    switch (statut) {
      case 'en_attente':
        return { label: 'En attente', badge: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500' };
      case 'en_cours':
        return { label: 'En cours de traitement', badge: 'bg-sky-100 text-sky-800', dot: 'bg-sky-500' };
      case 'traite':
      case 'resolu':
        return { label: 'Résolu', badge: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500' };
      case 'rejete':
        return { label: 'Rejeté', badge: 'bg-rose-100 text-rose-800', dot: 'bg-rose-500' };
      default:
        return { label: 'Statut inconnu', badge: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' };
    }
  }

  private formaterDate(iso?: string): string {
    if (!iso) return '—';
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(new Date(iso));
  }

  retour(): void {
    this.router.navigate(['/signalements']);
  }
}
