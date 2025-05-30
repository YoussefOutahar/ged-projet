import { useQuery } from "@tanstack/react-query";
import usePlanClassementStore from "Stores/PlanClassementStore";
import axiosInstance from "app/axiosInterceptor";
import { PlanClassementIndexAdminService } from "app/controller/service/admin/PlanClassementIndexAdminService.service";
import { PlanClassementModelAdminService } from "app/controller/service/admin/PlanClassementModelAdminService.service";

export const planClassementQueries = () => {

    const planClassementIndexAdminService = new PlanClassementIndexAdminService();
    const planClassementModelAdminService = new PlanClassementModelAdminService()

    const { setPlanClassements,setPlanClassementsTree, setLoading, setPlanClassementsNoArchive, setPlanClassementsIndex, setPlanClassementsModel } = usePlanClassementStore();


    // useQuery({
    //     queryKey: ["PlanClassements"],
    //     queryFn: async () => {
    //         try {
    //             setLoading(true);
    //             const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement`)
    //             setPlanClassements(response.data);
    //             setLoading(false);
    //             return response;
    //         } catch (error) {
    //             setLoading(false);
    //         }
    //     },
    // });

    useQuery({
        queryKey: ["PlanClassementsParent"],
        queryFn: async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/parents`)
                setPlanClassementsTree(response.data);
                setLoading(false);
                return response;
            } catch (error) {
                setLoading(false);
            }
        },
    });

    useQuery({
        queryKey: ["PlanClassementsNoArchive"],
        queryFn: async () => {
            const response = await axiosInstance.get<any[]>(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/list/no-archive`)
            setPlanClassementsNoArchive(response.data);
            return response;
        },
    });

    useQuery({
        queryKey: ["PlanClassementsIndex"],
        queryFn: async () => {
            const response = await planClassementIndexAdminService.getList();
            setPlanClassementsIndex(response.data);
            return response;
        },
    });

    useQuery({
        queryKey: ["PlanClassementsModel"],
        queryFn: async () => {
            const response = await planClassementModelAdminService.getList();
            setPlanClassementsModel(response.data);
            return response;
        },
    });
};