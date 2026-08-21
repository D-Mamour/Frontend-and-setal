import { inject, Injectable, signal } from '@angular/core';
import { User } from '../Models/auth/utilisateur';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Incident } from '../Models/incident.model';
import { Intervention } from '../Models/infos/incident';


@Injectable ({
  providedIn: 'root'
})

export class AdminprofilService {
  private readonly httpclient = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  readonly adminuser = signal<User |null>(null)

  readonly interventions = signal<Intervention[]>([])

  readonly nombreSignalement = signal(0);

    //  Définition du Signal pour stocker la liste complète (utile pour filtrer)
  readonly listeSignalements = signal<Incident[]>([]);

  //Recuperer le profil
profil(): Observable<User> {
  return this.httpclient.get<User>(`${this.baseUrl}/comptes/me/`) // Mettez le chemin exact de comptes.urls s'il diffère de /me/
    .pipe(
      tap(user => this.adminuser.set(user))
    );
}


incidents(): Observable<Incident[]> {
  return this.httpclient.get<Incident[]>(`${this.baseUrl}/incidents/tous`) // Interroge votre incident.urls
    .pipe(
      tap(signalements => this.listeSignalements.set(signalements))
    );
}
  getIncident(id: number): Observable<Incident>{
    return this.httpclient.get<Incident>(`${this.baseUrl}/incidents/${id}`)
  }

  intervention(): Observable<Intervention[]> {
    return this.httpclient.get<Intervention[]>(`${this.baseUrl}/interventions/toutes/`)
    .pipe(tap(donnee => this.interventions.set(donnee)));
  }

}
