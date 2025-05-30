
import { UtilisateurDto } from "app/controller/model/Utilisateur.model";
import { create } from "zustand";

type Store = {
    connectedUser: UtilisateurDto | null;
    profilePicture: string | null;
    setConnectedUser: (connectedUser: UtilisateurDto | null) => void;
    setProfilePicture: (profilePicture: string) => void;
}

const useConnectedUserStore = create<Store>((set) => ({
    connectedUser: null,
    profilePicture: null,
    setConnectedUser: (connectedUser: UtilisateurDto | null) => set({ connectedUser }),
    setProfilePicture: (profilePicture: string) => set({ profilePicture }),
}));

export default useConnectedUserStore;