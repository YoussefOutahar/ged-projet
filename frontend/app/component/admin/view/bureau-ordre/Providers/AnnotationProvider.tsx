import axiosInstance from "app/axiosInterceptor";
import { createContext, useContext, useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

const AnnotationContext = createContext({ actions: [] as string[], setActions: (actions: string[]) => { } });

export const useAnnotationContext = () => {
    return useContext(AnnotationContext);
};

export const AnnotationProvider = ({ children }: { children: React.ReactNode }) => {
    const [actions, setActions] = useState<string[]>([]);

    const fetchActions = async () => {
        return await axiosInstance.get<any[]>(`${API_URL}/courriel/intervenants-courriel/actions`)
            .then(response => {
                let actionsHolder: string[] = [];
                response.data.forEach((action: any) => {
                    actionsHolder.push(action.libelle);
                });
                setActions(actionsHolder);
            }
            ).catch(error => console.error('Error loading actions', error));
    };
    useEffect(() => {
        fetchActions();
    }, []);


    return <AnnotationContext.Provider value={{ actions, setActions }}>{children}</AnnotationContext.Provider>;
};