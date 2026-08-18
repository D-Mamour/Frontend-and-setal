import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { Incident } from '../Models/infos/incident';


@Injectable({providedIn:'root'})

export class AgentService  {

  private readonly baseUrl = `${environment.apiUrl}/incidents/`;
  constructor(private http: HttpClient){}

  // Récupérer la liste des incident (GET)
  getIncident(): Observable<Incident[]> {
    return this.http.get<Incident[]>(this.baseUrl);
  }
}
