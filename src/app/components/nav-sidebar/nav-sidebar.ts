import { Notification } from './../../Models/infos/notification';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faMagnifyingGlass,
  faBell
} from '@fortawesome/free-solid-svg-icons';
import { AdminprofilService } from '../../Services/admin-dashboard-service';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { NotificationService } from '../../Services/notification.service';

@Component({
  selector: 'app-nav-sidebar',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, RouterLink],
  templateUrl: './nav-sidebar.html',
  styleUrl: './nav-sidebar.css',
})
export class NavSidebar implements OnDestroy, OnInit{

  faMagnifyingGlass = faMagnifyingGlass;
  faBell = faBell;

  today = new Date();

  get currentDate(): string {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(this.today);
  }

    // On injecte le service pour récupérer directement son Signal
  private readonly adminService = inject(AdminprofilService);

  private notificationService = inject(NotificationService);
  private intervalId: any


  popupOvert = signal(false);
  chargement = signal(false);

  nombreNonLues = this.notificationService.nombreNonLues;
  notification = this.notificationService.notifications;

  // On crée un raccourci public pour le fichier HTML
  readonly userConnecte = this.adminService.adminuser;
    ngOnInit(): void {
      this.rafraichirCompteur();
      //polling toutes les 30 secondes
      this.intervalId = setInterval(()=> this.rafraichirCompteur(), 90000)

    //  ON CHARGE LE PROFIL ICI ! Dès que l'application s'ouvre, le Header appelle Django
    this.adminService.profil().subscribe({
      next: (data) => console.log("Profil chargé avec succès dans le Header :", data),
      error: (err) => console.error("Le Header n'a pas pu récupérer l'utilisateur", err)
    });
  }

  ngOnDestroy(): void {
    if(this.intervalId) clearInterval(this.intervalId);
  }


  rafraichirCompteur(): void {
  this.notificationService.getNotification().subscribe({
    next: (data) => {
      console.log('NOTIFICATIONS DANS LE COMPOSANT :', data);
    },
    error: (err) => console.error(err)
  });
}

  toggleCloche():void {
    this.popupOvert.update(v => !v);
    if(this.popupOvert()){
      this.chargerListe();
    }
  }

  fermerPopup(): void {
    this.popupOvert.set(false);
  }

  chargerListe(): void {
  this.chargement.set(true);

  this.notificationService.getNotification().subscribe({
    next: (data) => {
      this.chargement.set(false);

      console.log('NOTIFICATIONS POPUP :', data);
    },
    error: (err) => {
      this.chargement.set(false);
      console.error(err);
    }
  });
}
  clicNotification(notif: Notification): void {
    if(notif.lu) return;
    this.notificationService.marquerLue(notif.id).subscribe({
      next: ()=>{
        this.notificationService.notifications.update(liste =>
          liste.map(n => n.id === notif.id ? {...n, lu: true}: n)
        );
        this.rafraichirCompteur();
      },
      error: (err)=> console.error(err)
    });
  }
  toutMarquerLu(): void {
    this.notificationService.marquerToutLu().subscribe({
      next: () => {
        this.notificationService.notifications.update(liste =>
          liste.map(n => ({ ...n, lu: true }))
        );
        this.notificationService.nombreNonLues.set(0);
      },
      error: (err) => console.error(err)
    });
  }

  formatTemps(dateIso: string): string {
    const date = new Date(dateIso);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) +
      ', ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

}

