import { useQuery } from "@tanstack/react-query";
import useDocModelsStore from "Stores/DocModelsStore";
import useDocCategorieStore from "Stores/DocumentCategorieStore";
import useDocumentStateStore from "Stores/DocumentStateStore";
import useDocTypeStore from "Stores/DocumentTypeStore";
import useIndexElementsStore from "Stores/IndexElementsStore";
import usePlanClassementStore from "Stores/PlanClassementStore";
import axiosInstance from "app/axiosInterceptor";
import { DocumentStateDto } from "app/controller/model/DocumentState.model";
import { DocumentCategorieAdminService } from "app/controller/service/admin/DocumentCategorieAdminService.service";
import { DocumentStateAdminService } from "app/controller/service/admin/DocumentStateAdminService.service";
import { DocumentTypeAdminService } from "app/controller/service/admin/DocumentTypeAdminService.service";
import { IndexElementAdminService } from "app/controller/service/admin/IndexElementAdminService.service";

export const docQueries = () => {

    const documentCategorieAdminService = new DocumentCategorieAdminService();
    const documentStateAdminService = new DocumentStateAdminService();
    const documentTypeAdminService = new DocumentTypeAdminService();
    const indexElementAdminService = new IndexElementAdminService();

    const { setCategories } = useDocCategorieStore();
    const { setStates, setState, setState6 } = useDocumentStateStore();
    const { setTypes, setType } = useDocTypeStore();
    const { setIndexElements } = useIndexElementsStore();

    const { setDocModels } = useDocModelsStore();


    useQuery({
        queryKey: ["DocumentCategories"],
        queryFn: async () => {
            const response = await documentCategorieAdminService.getList();
            setCategories(response.data);
            return response;

        },
    });

    useQuery({
        queryKey: ["DocumentStates"],
        queryFn: async () => {
            const response = await documentStateAdminService.getList();
            setStates(response.data);
            const state = response.data.find((state_1: DocumentStateDto) => state_1.id === 1) || null;
            const state6 = response.data.find((state_2: DocumentStateDto) => state_2.id === 6) || null;
            setState(state);
            setState6(state6);
            return response;
        },
    });

    useQuery({
        queryKey: ["DocumentTypes"],
        queryFn: async () => {
            const response = await documentTypeAdminService.getList();
            setTypes(response.data);
            setType(response.data.find((type_1) => type_1.id === 1) || null);
            return response;
        },
    });

    useQuery({
        queryKey: ["IndexElements"],
        queryFn: async () => {
            const response = await indexElementAdminService.getList();
            setIndexElements(response.data);
            return response;
        },
    });


    useQuery({
        queryKey: ["models"],
        queryFn: async () => {
            const response = await axiosInstance.get<any[]>(`${process.env.NEXT_PUBLIC_ADMIN_URL}model`);
            setDocModels(response.data);
            return response;
        },
    });

    return {};
};