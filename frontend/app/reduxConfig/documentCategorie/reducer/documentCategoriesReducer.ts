import { DocumentCategorieDto } from "app/controller/model/DocumentCategorie.model";

interface DocumentCategorieState {
    documentCategories: DocumentCategorieDto[];
  }
  
  const initialState: DocumentCategorieState = {
    documentCategories: [],
  };

const documentCategoriesReducer = (state = initialState, action:any) => {
    switch (action.type) {
        case 'SET_DOCUMENT_CATEGORIES':
          return {
            ...state, 
            documentCategories: action.payload,
          };
        default:
          return state;
        };
};
export default documentCategoriesReducer;