export interface CreateIncident {
  description?: string;
  messageVocal?: string;
  latitude: number;
  longitude: number;
  urlImage: File;
}

export interface Incident {
  id: number;
  statut: string;
  description?: string;
  messageVocal?: string;
  latitude: number;
  longitude: number;
  dateCreation: string;
  dateModification: string;
  priorite: string;
  urlImage: string;
  type_incident: string | null; // Ajout du champ provenant du Serializer Django
    citoyen?: {
    id: number;
    prenom?: string;
    nom?: string;
    email?: string;
  };
  adresse?: string;
}
