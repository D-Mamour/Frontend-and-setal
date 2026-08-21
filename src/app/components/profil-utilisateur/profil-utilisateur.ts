import { Component, inject,  } from '@angular/core';
import { AdminprofilService } from '../../Services/admin-dashboard-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profil-utilisateur',
  imports: [],
  templateUrl: './profil-utilisateur.html',
  styleUrl: './profil-utilisateur.css',
})
export class ProfilUtilisateur {

  private readonly profilService = inject(AdminprofilService)
  private readonly router = inject(Router)

    // On crée un raccourci public pour le fichier HTML
  readonly userConnecte = this.profilService.adminuser;

  ngOnInit(): void{
    this.profilService.profil().subscribe({
      next: (data) => (data),
      error: (err) => console.error("Le Header n'a pas pu récupérer l'utilisateur", err)
    })
  }

  retour(): void{
    this.router.navigate(['/agent/dashboard'])
  }


}
