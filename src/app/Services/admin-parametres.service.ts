// Services/utilisateur.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment'; // path permettant d'accéder aux variables d'environnement
import { User } from '../Models/auth/utilisateur'; // path permettant d'accéder au modèle User

@Injectable({
  providedIn: 'root' // service unique partagé dans toute l'app
})
export class UtilisateurService {

  private readonly httpClient = inject(HttpClient); // la variable permettant d'accéder au client HTTP, readonly : la valeur ne peut pas être modifiée après l'initialisation

  private readonly baseUrl = environment.apiUrl; // variable permettant d'accéder à l'URL de base de l'API définie dans le fichier environment.ts

  /**
   * Récupère la liste des utilisateurs.
   * Le backend filtre déjà côté Django (admin voit tout, sinon seulement son propre profil).
   */
  getUtilisateurs(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.baseUrl}/comptes/utilisateur/`);
  }

    /**
   * Active ou désactive un compte utilisateur.
   */
  toggleActif(id: number, nouveauStatut: boolean): Observable<User> {
    return this.httpClient.patch<User>(`${this.baseUrl}/comptes/utilisateur/${id}/`, {
      is_active: nouveauStatut
    });
  }
}
