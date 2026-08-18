import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AdminprofilService } from '../../../Services/admin-dashboard-service';

@Component({
  selector: 'app-gestion-signalement',
  imports: [RouterLink],
  templateUrl: './gestion-signalement.html',
  styleUrl: './gestion-signalement.css',
})
export class GestionSignalement implements OnInit{
  incidentService = inject(AdminprofilService);
  signalements = this.incidentService.listeSignalements;
  loading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.chargerSignalement();
  }

  chargerSignalement(){
    this.loading.set(true);
    this.errorMessage.set('');

    this.incidentService.incidents().subscribe({
      next: (signalement) =>{
        console.log("signalements recuperer", signalement);
      },
      error: (error) => {
        console.log("erreur API", error);
      }
    })
  }



}
