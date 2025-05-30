import { create } from 'zustand';

type State = {
  models: any[];
  setDocModels: (docModels: any[]) => void;
  createDocModel: (docModel: any) => void;
  updateDocModel: (docModel: any) => void;
  deleteDocModel: (id: number) => void;
};

const useDocModelsStore = create<State>((set) => ({
  models: [],
  setDocModels: (models: any[]) => set({ models }),
  createDocModel: async (docModel: any) => {
    set(state => ({ models: [...state.models, docModel] }));
  },
  updateDocModel: async (docModel: any) => {
    set(state => ({ models: state.models.map(model => model.id === docModel.id ? docModel : model) }));
  },
  deleteDocModel: async (id: number) => {
    set(state => ({ models: state.models.filter(model => model.id !== id) }));
  },
}));

export default useDocModelsStore;