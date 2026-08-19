import { Component, inject, OnInit } from '@angular/core';
import { AdminprofilService } from '../../../Services/admin-dashboard-service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-profil',
  imports: [FormsModule],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil implements OnInit{
  private readonly adminService = inject(AdminprofilService);

    userConnecte = this.adminService.adminuser;
    ngOnInit(): void {

      this.adminService.profil().subscribe({
        next: (data) => console.log("Profil chargé avec succès dans le Header :", data),
        error: (err) => console.error("Le Header n'a pas pu récupérer l'utilisateur", err)
      });
    }

}
