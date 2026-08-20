export interface Notification {
  id: number;
  utilisateur: number;
  titre: string;
  message: string;
  lu: boolean;
  date_fin: string;
  date_creation: string;
}
