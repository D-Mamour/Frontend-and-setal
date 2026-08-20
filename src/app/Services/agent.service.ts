
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../environments/environment';
import { Intervention } from '../Models/infos/incident';
import { Incident } from '../Models/incident.model';

// Réponse renvoyée par le backend au démarrage d'une intervention.
// Ajuste les champs selon ce que ta vue Django renvoie réellement.
// export interface DemarrerInterventionResponse {
//   message: string;
//   id_intervention?: number;
//   incident?: Incident;
//   status?: string;
// }

@Injectable({ providedIn: 'root' })
export class AgentService {

  private readonly baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getIncident(): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${this.baseUrl}/incidents/tous/`).pipe(
      map((incidents) => incidents.map(i => ({
        ...i,
        latitude: Number(i.latitude),
        longitude: Number(i.longitude)
      })))
    );
  }

  getIncidentById(id: number): Observable<Incident> {
    const url = `${this.baseUrl}/incidents/${id}/`;
    console.log('GET incident by id URL =', url);
    return this.http.get<Incident>(url).pipe(
      map((incident) => ({
        ...incident,
        latitude: Number(incident.latitude),
        longitude: Number(incident.longitude)
      }))
    );
  }

  /**
   * Démarre l'intervention liée à un incident : le backend récupère l'id
   * de l'incident dans l'URL et fait passer son statut à "en-cours".
   * Correspond à POST /api/interventions/demarrer/{id_incident}/
   */
 demarrerIntervention(idIncident: number): Observable<Intervention> {
  return this.http.post<Intervention>(`${this.baseUrl}/interventions/demarrer/${idIncident}/`, {});
}

  getInterventions(): Observable<Intervention[]> {
  return this.http.get<Intervention[]>(`${this.baseUrl}/interventions/mes-interventions/`);
}

  /**
   * Termine une intervention en cours.
   * Correspond à POST /api/interventions/terminer/{id_intervention}/
   */
  terminerIntervention(idIntervention: number): Observable<any> {
  return this.http.post(`${this.baseUrl}/interventions/terminer/${idIntervention}/`, null);
}
  /**
   * Annule une intervention.
   * Correspond à POST /api/interventions/annuler/{id_intervention}/
   */
 annulerIntervention(idIntervention: number): Observable<any> {
  return this.http.post(`${this.baseUrl}/interventions/annuler/${idIntervention}/`, null);
}
}
