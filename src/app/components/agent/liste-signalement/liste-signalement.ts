import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowTrendUp,
  faCircleCheck,
  faTriangleExclamation,
  faChartColumn
} from '@fortawesome/free-solid-svg-icons';
import { Navbar } from "../../navbar/navbar";

@Component({
  selector: 'app-liste-signalement',
  standalone: true,
  imports: [FontAwesomeModule, Navbar],
  templateUrl: 'liste-signalement.html'
})
export class ListeSignalement {

  faArrowTrendUp = faArrowTrendUp;
  faCircleCheck = faCircleCheck;
  faTriangleExclamation = faTriangleExclamation;
  faChartColumn = faChartColumn;

  quartiers = [
    {
      nom: 'Médina',
      valeur: 450
    },
    {
      nom: 'Plateau',
      valeur: 320
    },
    {
      nom: 'Yoff',
      valeur: 210
    },
    {
      nom: 'Fann',
      valeur: 180
    },
    {
      nom: 'Mermoz',
      valeur: 150
    }
  ];

  signalements = [
    {
      titre: 'Bac de tri saturé',
      quartier: 'Plateau',
      temps: 'Il y a 5h',
      priorite: 'PRIORITÉ',
      image: 'images/telechargement.jpeg',
      type: 'priorite'
    },
    {
      titre: 'Dépôt sauvage Rue 22',
      quartier: 'Médina',
      temps: 'Il y a 2h',
      priorite: 'CRITIQUE',
      image: 'images/telechargement.jpeg  ',
      type: 'critique'
    }
  ];

  get hauteurMax(): number {
    return Math.max(...this.quartiers.map(q => q.valeur));
  }

}
