import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { Incident } from '../Models/incident.model';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {

  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  // État partagé des signalements
  incidents = signal<Incident[]>([]);

  createIncident(formData: FormData): Observable<Incident> {
    return this.httpClient.post<Incident>(`${this.baseUrl}/incidents/`, formData);
  }

  getMyIncidents(): Observable<Incident[]> {

    return this.httpClient.get<Incident[]>(`${this.baseUrl}/incidents/`).pipe(
        tap((incidents) => {
          // On met à jour le Signal partagé
          this.incidents.set(incidents);
        })
      );
  }

  getIncidentById(id: number): Observable<Incident>{
    return this.httpClient.get<Incident>(`${this.baseUrl}/incidents/${id}/`);
  }
}
