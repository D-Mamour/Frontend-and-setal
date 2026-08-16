import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PositionGeo {
  latitude: number;
  longitude: number;
}

export type CodeErreurGeolocalisation = | 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE'| 'TIMEOUT' | 'NON_SUPPORTE';

export class GeolocalisationError extends Error {
  constructor(
    public code: CodeErreurGeolocalisation,
    message: string,
  ) {
    super(message);
  }
}

@Injectable({
  providedIn: 'root',
})
export class GeolocalisationService {
  /**
   * Demande la position actuelle de l'utilisateur.
   * Émet une seule fois puis complète (pas de suivi continu ici).
   */
  obtenirPosition(): Observable<PositionGeo> {
    return new Observable<PositionGeo>((observer) => {
      if (!('geolocation' in navigator)) {
        observer.error(
          new GeolocalisationError(
            'NON_SUPPORTE',
            "La géolocalisation n'est pas supportée par ce navigateur.",
          ),
        );
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          observer.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          observer.complete();
        },
        (error: GeolocationPositionError) => {
          observer.error(this.mapErreur(error));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    });
  }

  private mapErreur(error: GeolocationPositionError): GeolocalisationError {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return new GeolocalisationError(
          'PERMISSION_DENIED',
          "Vous avez refusé l'accès à votre position.",
        );
      case error.POSITION_UNAVAILABLE:
        return new GeolocalisationError(
          'POSITION_UNAVAILABLE',
          'Position indisponible pour le moment.',
        );
      case error.TIMEOUT:
        return new GeolocalisationError(
          'TIMEOUT',
          'La demande de localisation a expiré.',
        );
      default:
        return new GeolocalisationError(
          'POSITION_UNAVAILABLE',
          'Erreur de géolocalisation inconnue.',
        );
    }
  }
}
