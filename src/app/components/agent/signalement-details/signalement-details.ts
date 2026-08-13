import { Component } from '@angular/core';
import { Navbar } from "../../navbar/navbar";

@Component({
  selector: 'app-signalement-details',
  standalone: true,
  templateUrl: 'signalement-details.html',
  imports: [Navbar]
})
export class SignalementDetails {

  signalement = {
    titre: 'Dépôt sauvage - Rue 22',
    statut: 'EN COURS DE TRAITEMENT',
    localisation: 'Médina, Dakar',

    description:
      "Important tas d'ordures ménagères bloquant partiellement le trottoir depuis 3 jours. Présence d'odeurs fortes et risques sanitaires pour les commerces adjacents.",

    date: '12 Avril. 2026',
    auteur: 'Anonyme',

    analyseIA: {
      score: 98,
      niveau: 'Urgent'
    },

    image: 'assets/images/signalements/depot-sauvage.jpg'
  };


  timeline = [
    {
      titre: 'demande prise en compte',
      date: '12 Octobre, 09:15',
      description: '',
      statut: 'termine',
      icon: 'fa-solid fa-check'
    },

    {
      titre: 'Équipe en route',
      date: '',
      description: "Une équipe de l'UCG a été dépêchée sur les lieux.",
      statut: 'actuel',
      label: 'ÉTAPE ACTUELLE',
      icon: 'fa-solid fa-truck'
    },

    {
      titre: 'Résolution confirmée',
      date: '',
      description: "En attente de l'intervention terminée.",
      statut: 'attente',
      icon: 'fa-solid fa-flag-checkered'
    }
  ];


  goBack(): void {
    window.history.back();
  }


  share(): void {
    if (navigator.share) {
      navigator.share({
        title: this.signalement.titre,
        text: this.signalement.description
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
    console.log('Résolution confirmée');
  }

}
