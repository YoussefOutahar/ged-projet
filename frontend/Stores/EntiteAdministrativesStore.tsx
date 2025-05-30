import { EntiteAdministrativeDto } from "app/controller/model/EntiteAdministrative.model";
import { EntiteAdministrativeTypeDto } from "app/controller/model/EntiteAdministrativeType.model";
import { types } from "util";
import { create } from "zustand";

type Store ={
    entites: EntiteAdministrativeDto[];
    entiteTypes: EntiteAdministrativeTypeDto[];
    organigrame: any;
    setEntiteAdministratives: (entites: EntiteAdministrativeDto[]) => void,
    setEntiteTypes: (types: EntiteAdministrativeTypeDto[]) => void;
    setOrganigrame: (organigrame: any) => void,
};

const useEntiteAdministrativesStore = create<Store>((set) => ({
    entites: [],
    entiteTypes: [],
    organigrame: null,
    setEntiteAdministratives: (entites: EntiteAdministrativeDto[]) => set({entites}),
    setEntiteTypes: (entiteTypes: EntiteAdministrativeTypeDto[]) => set({entiteTypes}),
    setOrganigrame: (organigrame: any) => set({organigrame}),
})) 

export default useEntiteAdministrativesStore;