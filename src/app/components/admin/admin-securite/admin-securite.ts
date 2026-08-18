import { Component } from '@angular/core';
import { AjouterMembre } from '../ajouter-membre/ajouter-membre';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-securite',
  standalone: true,
  imports: [AjouterMembre, CommonModule],
  templateUrl: './admin-securite.html',
  styleUrl: './admin-securite.css',
})
export class AdminSecurite {
  afficherModalAjout = false; // ← seule nouvelle propriété
}
