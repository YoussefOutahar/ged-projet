import { CourrielBureauOrdre } from "app/controller/model/BureauOrdre/CourrielBureauOrdre";
import React, { useState } from "react";

const CourrielSelectionContext = React.createContext(
    {
        selectedCourriels: [] as CourrielBureauOrdre[],
        setSelectedCourriels: (courriels: CourrielBureauOrdre[]) => { },
        select: (courriel: CourrielBureauOrdre) => { },
        unselect: (courriel: CourrielBureauOrdre) => { },
    }
);

export function useCourrielSelectionContext() {
    return React.useContext(CourrielSelectionContext);
}

type CourrielSelectionProviderProps = {
    children: React.ReactNode;
};

export function CourrielSelectionProvider({ children }: CourrielSelectionProviderProps) {

    const [selectedCourriels, setSelectedCourriels] = useState<CourrielBureauOrdre[]>([]);
    const select = (courriel: CourrielBureauOrdre) => {
        setSelectedCourriels([...selectedCourriels, courriel]);
    };
    const unselect = (courriel: CourrielBureauOrdre) => {
        setSelectedCourriels(selectedCourriels.filter(c => c.id !== courriel.id));
    };

    return (<CourrielSelectionContext.Provider value={{
        selectedCourriels,
        setSelectedCourriels,
        select,
        unselect,
    }}>
        {children}
    </CourrielSelectionContext.Provider>)
};