import { DocumentTypeDto } from "app/controller/model/DocumentType.model";
import { create } from "zustand";

type Store = {
  types: DocumentTypeDto[];
  type: DocumentTypeDto | null;
  setTypes: (types: DocumentTypeDto[]) => void;
  setType: (type: DocumentTypeDto | null) => void;
  createDocumentType: (documentType: DocumentTypeDto) => void;
  updateDocumentType: (documentType: DocumentTypeDto) => void;
  deleteDocumentType: (id: number) => void;
};

const useDocTypeStore = create<Store>((set) => ({
  types: [],
  type: null,
  setTypes: (types: DocumentTypeDto[]) => set({ types }),
  setType: (type: DocumentTypeDto | null) => set({ type }),
  createDocumentType: (documentType: DocumentTypeDto) => {
    set((store: Store) => ({ types: [...store.types, documentType] }));
  },
  updateDocumentType: (documentType: DocumentTypeDto) => {
    set((store: Store) => ({ types: store.types.map(t => t.id === documentType.id ? documentType : t) }));
  },
  deleteDocumentType: (id: number) => {
    set((store: Store) => ({ types: store.types.filter(t => t.id !== id) }));
  },
}));

export default useDocTypeStore;