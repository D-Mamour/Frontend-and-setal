import { HttpClient } from '@angular/common/http';
import { Notification } from './../Models/infos/notification';
import { inject, Injectable, signal } from "@angular/core";
import { environment } from '../../environments/environment';
import { map, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  notifications = signal<Notification[]>([]);
  notificationsNonLues = signal<Notification[]>([]);
  nombreNonLues = signal<number>(0);

  getNotification(): Observable<Notification[]> {
  return this.http.get<Notification[]>(
    `${this.baseUrl}/notifications/`
  ).pipe(
    tap((notifs) => {
      console.log('NOTIFICATIONS REÇUES :', notifs);
      this.notifications.set(notifs);
    })
  );
}

//  getNonLues(): Observable<Notification[]> {
//   return this.http.get<Notification[]>(`${this.baseUrl}/notifications/non-lues/`).pipe(
//     tap((notifs) => {
//       console.log('DATA REÇUE:', notifs, 'isArray:', Array.isArray(notifs));
//       this.notificationsNonLues.set(notifs);
//       this.nombreNonLues.set(notifs.length);
//     })
//   );
// }

  marquerLue(id: number): Observable<Notification> {
    return this.http.patch<Notification>(`${this.baseUrl}/notifications/${id}/lire/`, {});
  }

  marquerToutLu(): Observable<any> {
    return this.http.patch(`${this.baseUrl}/notifications/lire-tout/`, {});
  }
}
