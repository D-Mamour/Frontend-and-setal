import { Component } from '@angular/core';
import { AjouterMembre } from '../ajouter-membre/ajouter-membre';

@Component({
  selector: 'app-admin-securite',
  imports: [AjouterMembre],
  templateUrl: './admin-securite.html',
  styleUrl: './admin-securite.css',
})
export class AdminSecurite {
  afficherModalAjout = false; // ← seule nouvelle propriété
}
