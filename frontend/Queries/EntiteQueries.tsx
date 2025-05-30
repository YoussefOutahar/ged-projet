import { useQuery } from "@tanstack/react-query";
import useEntiteAdministrativesStore from "Stores/EntiteAdministrativesStore";
import { EntiteAdministrativeAdminService } from "app/controller/service/admin/EntiteAdministrativeAdminService.service";
import { EntiteAdministrativeTypeAdminService } from "app/controller/service/admin/EntiteAdministrativeTypeAdminService.service";

export const entiteQueries = () => {
    const entiteAdminService = new EntiteAdministrativeAdminService();
    const entiteAdministrativeTypeAdminService = new EntiteAdministrativeTypeAdminService();
    
    const { setEntiteAdministratives,setEntiteTypes,setOrganigrame } = useEntiteAdministrativesStore();

    useQuery({
        queryKey: ["EntiteAdministratives"],
        queryFn: async () => {
            const response = await entiteAdminService.getList();
            setEntiteAdministratives(response.data);
            return response;
        },
    });

    useQuery({
        queryKey: ["EntiteTypes"],
        queryFn: async () => {
            const response = await entiteAdministrativeTypeAdminService.getList();
            setEntiteTypes(response.data);
            return response;
        },
    });

    // useQuery({
    //     queryKey: ["Organigrame"],
    //     queryFn: async () => {
    //         const response = await entiteAdminService.getOrganigrame();
    //         setOrganigrame(response.data);
    //         return response;
    //     },
    // });
};