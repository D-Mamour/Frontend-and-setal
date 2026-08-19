import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { Incident } from '../Models/infos/incident';


@Injectable({providedIn:'root'})

export class AgentService  {

  private readonly baseUrl = environment.apiUrl;
  constructor(private http: HttpClient){}

  // Récupérer la liste des incident (GET)
  getIncident(): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${this.baseUrl}/incidents/tous/`);
  }

  getIncidentById(id: number): Observable<Incident> {
    const url = `${this.baseUrl}/incidents/${id}/`;
    console.log('GET incident by id URL =', url);
    return this.http.get<Incident>(url);
  }


}

