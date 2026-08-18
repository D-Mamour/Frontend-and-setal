import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IncidentService } from '../../../../Services/incident.service';

@Component({
  selector: 'app-signaler-probleme',
  imports: [FormsModule, CommonModule],
  templateUrl: './signaler-probleme.html',
  styleUrl: './signaler-probleme.css',
})
export class SignalerProbleme implements OnInit {
  router = inject(Router);
  incidentService = inject(IncidentService);

  description = signal('');
  selectedImage = signal<File | null>(null);
  imagePreview = signal<string | null>(null);

  latitude = signal<number | null>(null);
  longitude = signal<number | null>(null);
  locationLoading = signal(false);
  locationError = signal<string | null>(null);

  isSubmitting = signal(false);
  submitError = signal<string | null>(null);

  // INITIALISATION
  ngOnInit(): void {
    // On demande automatiquement la position lors de l'ouverture de la page.
    this.getLocation();

  }

  goBack(): void {
    this.router.navigate(['/']);
  }


  // SELECTION DE L'IMAGE
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    // Vérifier que c'est bien une image
    if (!file.type.startsWith('image/')) {
      this.submitError.set('Veuillez sélectionner une image valide.');
      return;
    }

    // Vérifier la taille Ici : maximum 5 Mo
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      this.submitError.set('L’image ne doit pas dépasser 5 Mo.');
      return;
    }

    // Stocker le fichier
    this.selectedImage.set(file);

    // Supprimer une éventuelle erreur
    this.submitError.set(null);

    // Générer l'aperçu
    const reader = new FileReader();

    reader.onload = () => {

      this.imagePreview.set(reader.result as string);

    };
    reader.readAsDataURL(file);

  }


  // GEOLOCALISATION
  getLocation(): void {

    this.locationLoading.set(true);
    this.locationError.set(null);

    // Vérifier si le navigateur supporte la géolocalisation
    if (!navigator.geolocation) {

      this.locationLoading.set(false);

      this.locationError.set(
        'La géolocalisation n’est pas supportée par votre navigateur.'
      );

      return;
    }


    navigator.geolocation.getCurrentPosition(

      // SUCCESS
      (position) => {
        this.latitude.set(position.coords.latitude);
        this.longitude.set(position.coords.longitude);
        this.locationLoading.set(false);
      },
      // ERROR
      (error) => {
        this.locationLoading.set(false);
        this.locationError.set(
          this.getLocationErrorMessage(error)
        );

      },
      // OPTIONS
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }

    );

  }


  // MESSAGE D'ERREUR GEOLOCALISATION
  private getLocationErrorMessage(error: GeolocationPositionError): string {

    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Vous devez autoriser la localisation pour envoyer un signalement.';
      case error.POSITION_UNAVAILABLE:
        return 'Votre position est actuellement indisponible.';
      case error.TIMEOUT:
        return 'La récupération de votre position a pris trop de temps.';
      default:
        return 'Impossible de récupérer votre position.';
    }

  }

  // VALIDATION AVANT ENVOI
  canSubmit(): boolean {

    return (
      this.selectedImage() !== null &&
      this.latitude() !== null &&
      this.longitude() !== null &&
      !this.isSubmitting()
    );

  }


  onSubmit(): void {

    this.submitError.set(null);

    // Vérification image
    const image = this.selectedImage();
    if (!image) {
      this.submitError.set('Veuillez ajouter une photo du problème.');
      return;
    }

    // Vérification position
    const latitude = this.latitude();
    const longitude = this.longitude();

    if (latitude === null || longitude === null) {
      this.submitError.set(
        'Veuillez activer votre localisation avant d’envoyer le signalement.'
      );

      return;
    }

    // Éviter plusieurs clics
    if (this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);

    // Création du FormData
    const formData = new FormData();

    // Image
    formData.append('urlImage',image);

    // Arrondissement des coordonnées
    const latitudeRounded = Number(latitude.toFixed(6));
    const longitudeRounded = Number(longitude.toFixed(6));

    // Latitude
    formData.append('latitude',latitudeRounded.toString());

    // Longitude
    formData.append('longitude',longitudeRounded.toString());

    // Description facultative
    const description = this.description().trim();
    if (description) {
      formData.append('description',description);
    }

    // Appel API
    this.incidentService.createIncident(formData).subscribe({
        next: (incident) => {
          console.log('Signalement créé :',incident);

          this.isSubmitting.set(false);

          // Redirection
          this.router.navigate(['/signalement-success']);

        },
        error: (error) => {
          console.log('Erreur backend :', error.error);
          this.isSubmitting.set(false);

        }

      });

  }
}
