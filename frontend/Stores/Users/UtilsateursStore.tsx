import { UtilisateurDto } from "app/controller/model/Utilisateur.model";
import { create } from "zustand";

type Store = {
    utilisateurs: UtilisateurDto[];
    setUtilisateurs: (utilisateurs: UtilisateurDto[]) => void;
    createUtilisateur: (utilisateur: UtilisateurDto) => void;
    updateUtilisateur: (utilisateur: UtilisateurDto) => void;
    deleteUtilisateur: (id: number) => void;
}

const useUtilisateurStore = create<Store>((set) => ({
    utilisateurs: [],
    setUtilisateurs: (utilisateurs: UtilisateurDto[]) => set({ utilisateurs }),
    createUtilisateur: async (utilisateur: UtilisateurDto) => {
        set(state => ({ utilisateurs: [...state.utilisateurs, utilisateur] }));
    },
    updateUtilisateur: async (utilisateur: UtilisateurDto) => {
        set(state => ({ utilisateurs: state.utilisateurs.map(user => user.id === utilisateur.id ? utilisateur : user) }));
    },
    deleteUtilisateur: async (id: number) => {
        set(state => ({ utilisateurs: state.utilisateurs.filter(user => user.id !== id) }));
    },
}));

export default useUtilisateurStore;