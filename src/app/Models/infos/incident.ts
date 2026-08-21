
export interface AnalyseAI {
    type_incident: string
    niveau_urgence: string
}

// Interface représentant la structure des données Django
export interface Incident {
    AnalyseAI: AnalyseAI | undefined
    id:number,
    statut: string,
    description?: string,
    messageVocal?: string,
    longitude?: number,
    latitude?: number,
    dateCreation: string,
    dateModification?: string,
    priorite:string,
    urlImage? :string,
    type_incident?:string,
    adresse?:string,

}

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

