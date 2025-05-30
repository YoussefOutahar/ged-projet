package ma.sir.ged.service.facade.admin.doc;

import ma.sir.ged.bean.core.doc.Model;

import java.util.List;

public interface ModelAdminService {
    Model saveModel(Model model);
    List<Model> getAll();
    Model findModelByLibelle(String libelle);
    void deleteModelById(Long id);
}
