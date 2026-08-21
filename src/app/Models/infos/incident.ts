


export interface Intervention {

    id: number;
    signalement?:{
      type_incident: string;
    }
    agent?: {
      prenom?: string;
      nom?: string;
    }
    statut?: string;
    photo?: string;
    commentaire?: string;
    date_creation?: string;
    date_fin?: string;
}

