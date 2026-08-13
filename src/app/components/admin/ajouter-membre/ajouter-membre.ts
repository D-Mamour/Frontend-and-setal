<<<<<<< HEAD
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ajouter-membre',
  imports: [CommonModule],
  templateUrl: './ajouter-membre.html',
  styleUrl: './ajouter-membre.css',
})
export class AjouterMembre {
  /** Contrôlé par le parent : true = popup visible */
  @Input() ouvert = false;

  /** Émis au clic sur le fond, la croix, ou (plus tard) après création réussie */
  @Output() fermer = new EventEmitter<void>();
}
=======
import { Component } from '@angular/core';

@Component({
  selector: 'app-ajouter-membre',
  imports: [],
  templateUrl: './ajouter-membre.html',
  styleUrl: './ajouter-membre.css',
})
export class AjouterMembre {}
>>>>>>> d6687ad59663af7dbfe8ed4c7823f8d569acc84e
