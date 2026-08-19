import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AgentService } from '../../../Services/creation-agent.service';

@Component({
  selector: 'app-ajouter-membre',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ajouter-membre.html',
  styleUrl: './ajouter-membre.css',
})
export class AjouterMembre {

  /** Contrôlé par le parent : true = popup visible */
  @Input() ouvert = false;
  /** Émis au clic sur le fond, la croix, ou (plus tard) après création réussie */
  @Output() fermer = new EventEmitter<void>();
  // Émis après création réussie pour que le parent recharge la liste
  @Output() agentCree = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private agentService = inject(AgentService)

  agentForm = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', [Validators.required, Validators.pattern(/^(77|78|71|76|70|75)[0-9]{7}$/)]]
  })

  get nom() {
  return this.agentForm.get('nom');
    }

  get prenom() {
      return this.agentForm.get('prenom');
    }

  get role() {
      return this.agentForm.get('role');
    }

  get email() {
      return this.agentForm.get('email');
    }

  get telephone() {
      return this.agentForm.get('telephone');
    }

  fermerModal() {
    this.agentForm.reset();
    this.fermer.emit();
  }

  creerAgent() {

      console.log('BOUTON CLIQUÉ');

      console.log('Formulaire:', this.agentForm.value);
      console.log('Valide:', this.agentForm.valid);

    if (this.agentForm.invalid) {
      this.agentForm.markAllAsTouched();
      return;
    }

    const agent = {
      first_name: this.agentForm.value.prenom ?? '',
      last_name: this.agentForm.value.nom ?? '',
      email: this.agentForm.value.email ?? '',
      telephone: this.agentForm.value.telephone ?? '',

    };
    console.log('AGENT:', agent);

    this.agentService.addAgent(agent).subscribe({
      next: (response) => {
        console.log('Agent créé avec succès', response);

        this.agentCree.emit(); // Émettre l'événement pour informer le parent que l'agent a été créé
        this.agentForm.reset();

        this.fermerModal();
      },

      error: (error) => {
        console.error('Erreur lors de la création de l’agent', error);
      }
    })
  }




}
