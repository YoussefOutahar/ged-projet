import axiosInstance from "app/axiosInterceptor";
import { EtablissementBureauOrdre } from "app/controller/model/BureauOrdre/EtablissementBureauOrdre";
import React, { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

const EtablissementsBOContext = React.createContext(
    {
        EtablissementsBO: [] as EtablissementBureauOrdre[],
        setEtablissementsBO: (etablissements: EtablissementBureauOrdre[]) => { },
    }
);

type EtablissementProviderProps = {
    children: React.ReactNode;
};

export function EtablissementProvider({ children }: EtablissementProviderProps) {
    const [EtablissementsBO, setEtablissementsBO] = useState<EtablissementBureauOrdre[]>([]);

    const fetchEtablissementsBO = async () => {
        return await axiosInstance.get(`${API_URL}/etablissements`).then((res) => {
            setEtablissementsBO(res.data);
        }).catch((err) => {
            console.log('err:', err);
        });
    }

    useEffect(() => {
        fetchEtablissementsBO();
    }, []);

    return <EtablissementsBOContext.Provider value={{
        EtablissementsBO,
        setEtablissementsBO,
    }}>
        {children}
    </EtablissementsBOContext.Provider>
}

export function useEtablissementsBOContext() {
    return React.useContext(EtablissementsBOContext);
}