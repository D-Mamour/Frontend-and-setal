import { inject, Injectable, signal } from '@angular/core';
import { User } from '../Models/auth/utilisateur';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export type Status = 'en_attente' | 'en_cours' | 'resolu';

export interface Signalement {
    // ID unique du signalement (généralement généré par Django)
    id?: number;

    // L'ID du citoyen ou l'objet User complet selon votre sérialiseur
    citoyen: number | string;

    // Utilisation de votre type personnalisé pour restreindre les statuts
    statut: Status;

    description: string;

    // L'URL du fichier audio (optionnel car blank=True, null=True en Django)
    messageVocal?: string | null;

    // Les coordonnées géographiques (nombres décimaux)
    longitude: number;
    latitude: number;

    // Dates stockées sous forme de chaînes de caractères (format ISO)
    dateCreation: string;
    dateModification: string;

    // Niveau de priorité (ex: 'haute', 'moyenne', 'basse')
    priorite: 'basse' | 'moyenne' | 'haute' | string;

    // L'URL de l'image téléversée (optionnel)
    urlImage?: string | null;
}

@Injectable ({
  providedIn: 'root'
})

export class AdminprofilService {
  private readonly httpclient = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  readonly adminuser = signal<User |null>(null)

  readonly nombreSignalement = signal(0);

    // 1. Définition du Signal pour stocker la liste complète (utile pour filtrer)
  readonly listeSignalements = signal<Signalement[]>([]);

  //Recuperer le profil
  profil(): Observable<User> {
    return this.httpclient.get<User>(`${this.baseUrl}/dashboard`)
      .pipe(
        tap(user => {
          this.adminuser.set(user);
        })
      );
  }

  statistique(): Observable<Signalement[]> {
    return this.httpclient.get<Signalement[]>(`${this.baseUrl}/dashboard`)
    .pipe(
      tap(signalements => this.listeSignalements.set(signalements)

      )
    )
  }

  


}
