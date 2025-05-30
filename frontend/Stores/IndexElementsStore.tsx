import { IndexElementDto } from "app/controller/model/IndexElement.model";
import { create } from "zustand";

type Store = {
    indexElements: IndexElementDto[];
    setIndexElements: (indexElements: IndexElementDto[]) => void;
    createIndexElement: (indexElement: IndexElementDto) => void;
    updateIndexElement: (indexElement: IndexElementDto) => void;
    deleteIndexElement: (indexElement: IndexElementDto) => void;
};

const useIndexElementsStore = create<Store>((set) => ({
    indexElements: [],
    setIndexElements: (indexElements: IndexElementDto[]) => set({ indexElements }),
    createIndexElement: (indexElement: IndexElementDto) => set((state) => ({ indexElements: [...state.indexElements, indexElement] })),
    updateIndexElement: (indexElement: IndexElementDto) => set((state) => ({ indexElements: state.indexElements.map((element) => element.id === indexElement.id ? indexElement : element) })),
    deleteIndexElement: (indexElement: IndexElementDto) => set((state) => ({ indexElements: state.indexElements.filter((element) => element.id !== indexElement.id) })),
}));

export default useIndexElementsStore;