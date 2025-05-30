package ma.sir.ged.service.impl.admin.referentieldoc;


import ma.sir.ged.bean.core.referentieldoc.DocumentCategorie;
import ma.sir.ged.bean.core.referentieldoc.DocumentCategorieModel;
import ma.sir.ged.bean.history.DocumentCategorieModelHistory;
import ma.sir.ged.dao.criteria.core.DocumentCategorieModelCriteria;
import ma.sir.ged.dao.criteria.history.DocumentCategorieModelHistoryCriteria;
import ma.sir.ged.dao.facade.core.referentieldoc.DocumentCategorieModelDao;
import ma.sir.ged.dao.facade.history.DocumentCategorieModelHistoryDao;
import ma.sir.ged.dao.specification.core.DocumentCategorieModelSpecification;
import ma.sir.ged.service.facade.admin.doc.DocumentAdminService;
import ma.sir.ged.service.facade.admin.referentieldoc.DocumentCategorieAdminService;
import ma.sir.ged.service.facade.admin.referentieldoc.DocumentCategorieModelAdminService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocumentCategorieModelAdminServiceImpl extends AbstractServiceImpl<DocumentCategorieModel, DocumentCategorieModelHistory, DocumentCategorieModelCriteria, DocumentCategorieModelHistoryCriteria, DocumentCategorieModelDao,
        DocumentCategorieModelHistoryDao> implements DocumentCategorieModelAdminService {


    @Override
    public boolean deleteByIdCheckCondition(Long id) {
        return documentService.countByDocumentCategorieModelId(id) == 0;
    }

    public DocumentCategorieModel findByReferenceEntity(DocumentCategorie t) {
        DocumentCategorieModel byCode = dao.findByCode(t.getCode());
        if (byCode == null) {
            DocumentCategorieModel byLibelle = dao.findByLibelle(t.getLibelle());
            return byLibelle;
        }
        return byCode;
    }


    public List<DocumentCategorieModel> findByDocumentCategorieId(Long id) {
        return dao.findByDocumentCategorieId(id);
    }

    public int deleteByDocumentCategorieId(Long id) {
        return dao.deleteByDocumentCategorieId(id);
    }


    public void configure() {
        super.configure(DocumentCategorieModel.class, DocumentCategorieModelHistory.class, DocumentCategorieModelHistoryCriteria.class, DocumentCategorieModelSpecification.class);
    }


    @Autowired
    private DocumentCategorieAdminService documentCategorieService;

    public DocumentCategorieModelAdminServiceImpl(DocumentCategorieModelDao dao, DocumentCategorieModelHistoryDao historyDao) {
        super(dao, historyDao);
    }


    @Autowired
    private DocumentAdminService documentService;
}
