import { Component, inject, OnInit } from '@angular/core';
import { AdminprofilService } from '../../../Services/admin-dashboard-service';

@Component({
  selector: 'app-admin-agent-profil',
  imports: [],
  templateUrl: './admin-agent-profil.html',
  styleUrl: './admin-agent-profil.css',
})
export class AdminAgentProfil implements OnInit{

  private readonly agentProfil = inject(AdminprofilService)

  readonly userconnecte = this.agentProfil.adminuser

  ngOnInit(): void {
    this.agentProfil.profil().subscribe({
      next: (data) => console.log("profil bien charger", data),
      error: (err) => console.log("erreur lors de la recuperation du profil", err)
    })
  }


}
