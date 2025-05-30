import { DocumentCategorieDto } from 'app/controller/model/DocumentCategorie.model';
import { create } from 'zustand';

type State = {
  categories: DocumentCategorieDto[];
  setCategories: (categories: DocumentCategorieDto[]) => void;
  createDocumentCategorie: (documentCategorie: DocumentCategorieDto) => void;
  updateDocumentCategorie: (documentCategorie: DocumentCategorieDto) => void;
  deleteDocumentCategorie: (id: number) => void;
};

const useDocCategorieStore = create<State>((set) => ({
  categories: [],
  setCategories: (categories: DocumentCategorieDto[]) => set({ categories }),
  createDocumentCategorie: async (documentCategorie: DocumentCategorieDto) => {
    set(state => ({ categories: [...state.categories, documentCategorie] }));
  },
  updateDocumentCategorie: async (documentCategorie: DocumentCategorieDto) => {
    set(state => ({ categories: state.categories.map(cat => cat.id === documentCategorie.id ? documentCategorie : cat) }));
  },
  deleteDocumentCategorie: async (id: number) => {
    set(state => ({ categories: state.categories.filter(cat => cat.id !== id) }));
  },
}));

export default useDocCategorieStore;