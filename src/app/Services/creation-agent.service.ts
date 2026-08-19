import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface CreationAgent {
  first_name: string;
  last_name: string;
  email: string;
  telephone: string;
}

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  private readonly http = inject(HttpClient)
  private readonly baseUrl = `${environment.apiUrl}/comptes/agents/`;



  addAgent(agent: CreationAgent): Observable<any> {
    return this.http.post<any>(this.baseUrl, agent);
  }
}
