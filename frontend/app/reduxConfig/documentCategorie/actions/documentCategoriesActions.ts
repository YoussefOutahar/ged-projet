import { DocumentCategorieDto } from "app/controller/model/DocumentCategorie.model";
import { DocumentCategorieAdminService } from "app/controller/service/admin/DocumentCategorieAdminService.service";
import { RootState } from "app/reduxConfig/ConfigureStore";
import { Dispatch } from "redux";

export const setDocumentCategories = (documentCategories : DocumentCategorieDto[]) => ({
    type: 'SET_DOCUMENT_CATEGORIES',
    payload: documentCategories,
  });
  
  // Exportez une fonction pour effectuer l'appel API si nécessaire
  export const fetchDocumentCategories = () => {
    return (dispatch : Dispatch, getState :() => RootState) => {
      const { documentCategories } = getState();
      const documentCategorieAdminService = new DocumentCategorieAdminService();
      // Vérifiez si les données existent déjà dans le store
      if (!documentCategories.documentCategories.length) {
        // Si non, faites l'appel API et mettez à jour le store
        documentCategorieAdminService.getList()
          .then(({ data }) => dispatch(setDocumentCategories(data)))
          .catch(error => console.log(error));
      }
    };
  };