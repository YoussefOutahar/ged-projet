import { DocumentStateDto } from "app/controller/model/DocumentState.model";
import { create } from "zustand";

type Store = {
  states: DocumentStateDto[];
  state: DocumentStateDto | null;
  state6: DocumentStateDto | null;
  setStates: (states: DocumentStateDto[]) => void;
  setState: (state: DocumentStateDto | null) => void;
  setState6: (state6: DocumentStateDto | null) => void;
  createDocumentState: (documentState: DocumentStateDto) => void;
  updateDocumentState: (documentState: DocumentStateDto) => void;
  deleteDocumentState: (id: number) => void;
};

const useDocumentStateStore = create<Store>((set) => ({
  states: [],
  state: null,
  state6: null,
  setStates: (states: DocumentStateDto[]) => set({ states }),
  setState: (state: DocumentStateDto | null) => set({ state }),
  setState6: (state6: DocumentStateDto | null) => set({ state6 }),
  createDocumentState: (documentState: DocumentStateDto) => {
    set((store: Store) => ({ states: [...store.states, documentState] }));
  },
  updateDocumentState: (documentState: DocumentStateDto) => {
    set((store: Store) => ({ states: store.states.map(s => s.id === documentState.id ? documentState : s) }));
  },
  deleteDocumentState: (id: number) => {
    set((store: Store) => ({ states: store.states.filter(s => s.id !== id) }));
  },
}));

export default useDocumentStateStore;