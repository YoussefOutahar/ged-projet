import axiosInstance from "app/axiosInterceptor";
import { RegistreDto } from "app/controller/model/BureauOrdre/Registre";
import React, { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

type RegistreProviderProps = {
    children: React.ReactNode;
};

const RegistresContext = React.createContext(
    {
        registres: [] as RegistreDto[],
        setRegistres: (registres: RegistreDto[]) => { },
    }
);

export function RegistreProvider({ children }: RegistreProviderProps) {

    const [registres, setRegistres] = useState<RegistreDto[]>([]);

    const fetchRegistres = async () => {
        return await axiosInstance.get(`${API_URL}/courriel/registre`).then((res) => {
            setRegistres(res.data);
        }).catch((err) => {
            console.log('err:', err);
        });
    };

    useEffect(() => {
        fetchRegistres();
    }, []);

    return <RegistresContext.Provider value={{
        registres,
        setRegistres,
    }}>
        {children}
    </RegistresContext.Provider>;
}

export function useRegistresContext() {
    return React.useContext(RegistresContext);
}