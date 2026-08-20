import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Navbar } from "../../navbar/navbar";
import { AuthService } from '../../../Services/auth-citoyen.service';
import { AgentService } from '../../../Services/agent.service';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AnalyseAI, Incident } from '../../../Models/incident.model';

@Component({
  selector: 'app-signalement-details',
  standalone: true,
  templateUrl: 'signalement-details.html',
  imports: [Navbar, FontAwesomeModule, CommonModule]

})

export class SignalementDetails implements OnInit{

  signalement= signal<Incident | null>(null)
  estEnChargement=signal<boolean>(false);
  messageErreur=signal<string>('');


  // état spécifique à l'action "confirmer la résolution"
  confirmationEnCours = signal<boolean>(false);
  confirmationErreur = signal<string>('');

  //Injection des services
  authService = inject(AuthService);
  agentService = inject(AgentService);
  router = inject(Router);
  route = inject(ActivatedRoute);


  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if(!idParam){
      this.messageErreur.set('Identifiant de signalement manquand');
      this.estEnChargement.set(false);
      return;
    }

    const id =Number(idParam);
    if(Number.isNaN(id)){
      this.messageErreur.set('Identifiant de signalement invalide');
      this.estEnChargement.set(false);
      return;
    }

    this.estEnChargement.set(true);
    this.agentService.getIncidentById(id).subscribe({
      next: (incident) =>{
        this.signalement.set(incident);
        this.estEnChargement.set(false);
      },
      error: ()=>{
        this.messageErreur.set('Erreur lors du chargement du signalement.');
        this.estEnChargement.set(false);
      }
    });


  }
  timeline = computed(() => {
    const s = this.signalement();
    const statutActuel = (s?.statut ?? '').toLowerCase();

    const etapes = [
      { cle: 'recu', titre: 'Signalement reçu', statut: 'termine', date: s?.dateCreation ?? '' },
      { cle: 'en_cours', titre: 'Prise en charge', statut: 'attente', date: '', description: '' },
      { cle: 'resolu', titre: 'Résolu', statut: 'attente', label: '' }
    ];

    const ordre = ['recu', 'en_cours', 'resolu'];
    const indexActuel = statutActuel.includes('resolu') || statutActuel.includes('résolu')
      ? 2
      : statutActuel.includes('cours')
      ? 1
      : 0;

    return etapes.map((e, i) => ({
      ...e,
      statut: i < indexActuel ? 'termine' : i === indexActuel ? 'actuel' : 'attente'
    }));
  });


  goBack(): void {
    window.history.back();
  }


  share(): void {
    const current = this.signalement();
    if (current && navigator.share) {
      const ia = current.AnalyseAI as AnalyseAI | undefined;

      const texte = [
        current.description,
        `Date : ${current.dateCreation}`,
        `Priorité : ${current.priorite}`,
        `Statut : ${current.statut}`,
        current.urlImage ? `Image : ${current.urlImage}` : '',
        `latidute : ${current.latitude}`,
        `longitude : ${current.longitude}`,
        ia ? `Score IA : ${ia.type_incident}%` : '',
        ia ? `Niveau IA : ${ia.niveau_urgence}` : ''
      ]
        .filter(Boolean)
        .join('\n');

      navigator.share({
        text: texte,

      });
    }
  }


  toggleFavorite(): void {
    console.log('Signalement ajouté aux favoris');
  }


  comment(): void {
    console.log('Ouverture des commentaires');
  }



  confirmResolution(): void {
    const current = this.signalement();

    if (!current) {
      this.confirmationErreur.set('Signalement introuvable.');
      return;
    }

    if (this.confirmationEnCours()) {
      return; // évite les double-clics pendant l'appel
    }

    this.confirmationEnCours.set(true);
    this.confirmationErreur.set('');

    this.agentService.demarrerIntervention(current.id).subscribe({
      next: (res) => {
        // Met à jour le statut localement (en-cours) sans refaire un GET
        this.signalement.set({
          ...current,
          statut: res.statut ?? 'en-cours'
        });

        this.confirmationEnCours.set(false);
        console.log('Intervention démarrée, statut mis à jour :', res);

        this.router.navigateByUrl('/agent/interventions');
      },
      error: (err) => {
        this.confirmationEnCours.set(false);
        this.confirmationErreur.set("Impossible de démarrer l'intervention. Réessayez.");
        console.error('Erreur lors du démarrage de l\'intervention', err);
      }
    });
  }

  Finaly(){
    this.router.navigateByUrl('agent/interventions');
  }

}
