package ma.sir.ged.service.impl.admin.doc;

import ma.sir.ged.bean.core.doc.Model;
import ma.sir.ged.dao.facade.core.doc.ModelDao;
import ma.sir.ged.service.facade.admin.doc.ModelAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ModelAdminServiceImpl implements ModelAdminService {
    @Autowired
    ModelDao dao;

    @Override
    public Model saveModel(Model model) {
        return dao.save(model);
    }

    @Override
    public List<Model> getAll() {
        return dao.findAll();
    }

    @Override
    public Model findModelByLibelle(String libelle) {
        return dao.findByLibelle(libelle);
    }

    @Override
    public void deleteModelById(Long id) {
        Optional<Model> modelOptional = dao.findById(id);
        if (modelOptional.isPresent()) {
            dao.deleteById(id);
        } else {
            throw new IllegalArgumentException("Model" + id + " not found");
        }
    }
}
