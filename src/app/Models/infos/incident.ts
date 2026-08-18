// Interface représentant la structure des données Django
export interface Incident {
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

