import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "app/axiosInterceptor";
import { PlanClassementIndexDto } from "app/controller/model/PlanClassementIndex.model";
import { PlanClassementModelDto } from "app/controller/model/PlanClassementModel.model";
import { queryClient } from "pages/_app";
import { create } from "zustand";

type Store = {
    planClassements: any[];
    planClassementsTree: any[];
    fetchPlanClassementsChildren: (parentId: number) => Promise<void>;
    loading: boolean,
    setLoading: (loading: boolean) => void;
    planClassementsNoArchive: any[];
    planClassementsIndex: PlanClassementIndexDto[];
    planClassementsModel: PlanClassementModelDto[];
    setPlanClassements: (planClassements: any[]) => void;
    setPlanClassementsTree: (planClassementsTree: any[]) => void;
    setPlanClassementsNoArchive: (planClassements: any[]) => void;
    setPlanClassementsIndex: (planClassementsIndex: PlanClassementIndexDto[]) => void;
    setPlanClassementsModel: (planClassementsModel: PlanClassementModelDto[]) => void;
    createPlanClassement: (planClassement: any) => void;
    updatePlanClassement: (planClassement: any) => void;
    deletePlanClassement: (planClassement: any) => void;
};

const usePlanClassementStore = create<Store>((set) => ({
    planClassements: [],
    planClassementsTree: [],
    loading: true,
    setLoading: (loading: boolean) => set({ loading }),
    fetchPlanClassementsChildren: async (parentId: number) => {
        await queryClient.fetchQuery(
            {
                queryKey: ["PlanClassementsChildren", parentId],
                queryFn: async () => {
                    set(() => ({ loading: true }));
                    try {
                        const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_ADMIN_URL}plan-classement/children/${parentId}`);

                        const data = response.data;

                        set((state) => {
                            const updateTree = (nodes: any) => {
                                return nodes.map((node: any) => {
                                    if (node.id === parentId) {
                                        return { ...node, children: data };
                                    } else if (node.children) {
                                        return { ...node, children: updateTree(node.children) };
                                    }
                                    return node;
                                });
                            };

                            return { planClassementsTree: updateTree(state.planClassementsTree) };
                        });

                        return response.data;
                    } finally {
                        set(() => ({ loading: false }));
                    }
                }
            },
        );

        await queryClient.invalidateQueries({queryKey: ["PlanClassementsChildren", parentId],});
        await queryClient.refetchQueries({queryKey: ["PlanClassementsChildren", parentId]});
    },
    planClassementsNoArchive: [],
    planClassementsIndex: [],
    planClassementsModel: [],
    setPlanClassements: (planClassements: any[]) => set({ planClassements }),
    setPlanClassementsTree: (planClassementsTree: any[]) => set({ planClassementsTree }),
    setPlanClassementsNoArchive: (planClassements: any[]) => set({ planClassementsNoArchive: planClassements }),
    setPlanClassementsIndex: (planClassementsIndex: PlanClassementIndexDto[]) => set({ planClassementsIndex }),
    setPlanClassementsModel: (planClassementsModel: PlanClassementModelDto[]) => set({ planClassementsModel }),
    createPlanClassement: (planClassement: any) => set((state) => ({ planClassementsNoArchive: [...state.planClassementsNoArchive, planClassement] })),
    updatePlanClassement: (planClassement: any) => set((state) => ({ planClassementsNoArchive: state.planClassementsNoArchive.map((element) => element.id === planClassement.id ? planClassement : element) })),
    deletePlanClassement: (planClassement: any) => set((state) => ({ planClassementsNoArchive: state.planClassementsNoArchive.filter((element) => element.id !== planClassement.id) })),
}));

export default usePlanClassementStore;