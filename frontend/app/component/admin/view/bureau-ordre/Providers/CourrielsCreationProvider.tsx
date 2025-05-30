import { TypeCourriel, VoieEnvoi } from "app/controller/model/BureauOrdre/CourrielBureauOrdre";
import { EtablissementBureauOrdre } from "app/controller/model/BureauOrdre/EtablissementBureauOrdre";
import { PlanClassementBO } from "app/controller/model/BureauOrdre/PlanClassementBo";
import { DocumentDto } from "app/controller/model/Document.model";
import { EntiteAdministrativeDto } from "app/controller/model/EntiteAdministrative.model";
import { after } from "lodash";
import React, { useState } from "react";

const CourrielCreationContext = React.createContext(
    {
        showCreateCourriel: false,
        setShowCreateCourriel: (show: boolean) => { },
        typeCourriel: TypeCourriel.ENTRANT,
        setTypeCourriel: (type: TypeCourriel) => { },
        operationType: '',
        setOperationType: (operationType: string) => { },
        selectedDocuments: [] as DocumentDto[],
        setSelectedDocument: (documents: DocumentDto[]) => { },
        entiteExterne: null as EtablissementBureauOrdre | null,
        setEntiteExterne: (etablissement: EtablissementBureauOrdre | null) => { },
        entiteInterne: null as EntiteAdministrativeDto | null,
        setEntiteInterne: (entite: EntiteAdministrativeDto | null) => { },
        voieEnvoi: VoieEnvoi.AUTRE,
        setVoieEnvoi: (voieEnvoi: VoieEnvoi) => { },
        numeroRegistre : "",
        setNumeroRegistre: (numero: string) => { },
        planClassementCourriel : null as PlanClassementBO | null,
        setPlanClassementCourriel : (planClassement: PlanClassementBO) => { },
        launchAfterCreateSuccess: ()=>{},
        setLaunchAfterCreateSuccess: (callback: any) =>{()=>{}} ,
    }
);

type CourrielCreationProviderProps = {
    children: React.ReactNode;
};

type afterSaveFunctionType = () => void;


export function CourrielCreationProvider({ children }: CourrielCreationProviderProps) {

    const [showCreateCourriel, setShowCreateCourriel] = useState<boolean>(false);

    const [typeCourriel, setTypeCourriel] = useState<TypeCourriel>(TypeCourriel.ENTRANT);
    const [operationType, setOperationType] = useState<string>('');
    const [selectedDocuments, setSelectedDocument] = useState<DocumentDto[]>([]);
    const [entiteExterne, setEntiteExterne] = useState<EtablissementBureauOrdre | null>(null);
    const [entiteInterne, setEntiteInterne] = useState<EntiteAdministrativeDto | null>(null);
    const [voieEnvoi, setVoieEnvoi] = useState<VoieEnvoi>(VoieEnvoi.AUTRE);
    const [numeroRegistre, setNumeroRegistre] = useState<string>("");
    const [planClassementCourriel, setPlanClassementCourriel] = useState<PlanClassementBO | null>(null);



    // how to use set : setMyFunc(() => callback);
    const [launchAfterCreateSuccess, setLaunchAfterCreateSuccess] = useState<afterSaveFunctionType>(()=>{})

    return (<CourrielCreationContext.Provider value={{
        showCreateCourriel,
        setShowCreateCourriel,
        typeCourriel,
        setTypeCourriel,
        operationType,
        setOperationType,
        selectedDocuments,
        setSelectedDocument,
        entiteExterne,
        setEntiteExterne,
        entiteInterne,
        setEntiteInterne,
        voieEnvoi,
        setVoieEnvoi,
        numeroRegistre,
        setNumeroRegistre,
        planClassementCourriel,
        setPlanClassementCourriel,
        launchAfterCreateSuccess,
        setLaunchAfterCreateSuccess
    }}>
        {children}
    </CourrielCreationContext.Provider>)
};

export function useCourrielCreationContext() {
    return React.useContext(CourrielCreationContext);
}