
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

}



