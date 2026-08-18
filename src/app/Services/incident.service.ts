import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Incident } from '../Models/incident.model';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {

  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  createIncident(formData: FormData): Observable<Incident> {
    return this.httpClient.post<Incident>(`${this.baseUrl}/incidents/`, formData);
  }

  getMyIncidents(): Observable<Incident[]> {

    return this.httpClient.get<Incident[]>(`${this.baseUrl}/incidents/`);

  }
}
