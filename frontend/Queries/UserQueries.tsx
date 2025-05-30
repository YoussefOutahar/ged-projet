import { useQuery } from "@tanstack/react-query";
import useConnectedUserStore from "Stores/Users/ConnectedUserStore";
import useUtilisateurStore from "Stores/Users/UtilsateursStore";
import axiosInstance from "app/axiosInterceptor";
import { UtilisateurCriteria } from "app/controller/criteria/UtilisateurCriteria.model";
import { UtilisateurAdminService } from "app/controller/service/admin/UtilisateurAdminService.service";
import { AuthService } from "app/zynerator/security/Auth.service";


const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const userQueries = () => {
    const authService = new AuthService();
    const utilisateurCriteria = new UtilisateurCriteria();
    const utilisateurAdminService = new UtilisateurAdminService();

    const { setUtilisateurs } = useUtilisateurStore();
    const { connectedUser, setConnectedUser,setProfilePicture } = useConnectedUserStore();

    useQuery({
        queryKey: ["Utilisateurs"],
        queryFn: async () => {
            const response = await utilisateurAdminService.getList();
            setUtilisateurs(response.data);
            return response;
        },
    });

    useQuery({
        queryKey: ["ConnectedUser"],
        queryFn: async () => {
            const utilisateurAdminService = new UtilisateurAdminService();
            const connectedUserName = authService.getUsername();
            utilisateurCriteria.username = connectedUserName;

            const { data } = await utilisateurAdminService.findPaginatedByCriteria(utilisateurCriteria);
            const user = data?.list[0];
            setConnectedUser(user);
            return user;
        },
    });

    useQuery({
        queryKey: ["profilePic", connectedUser?.id],
        queryFn: () => axiosInstance
            .get(`${API_URL}/admin/utilisateur/${connectedUser?.id}/profile-picture`, {
                responseType: 'blob',
            })
            .then((response) => {
                const objectUrl =  URL.createObjectURL(response.data);
                setProfilePicture(objectUrl);
                return objectUrl;
            }),
        enabled: !!connectedUser?.id,
        retry: 0,
    });

    return {};
};