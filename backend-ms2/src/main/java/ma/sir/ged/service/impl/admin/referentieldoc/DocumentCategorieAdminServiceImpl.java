package ma.sir.ged.service.impl.admin.referentieldoc;


import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.referentieldoc.DocumentCategorie;
import ma.sir.ged.bean.core.referentieldoc.DocumentCategorieIndex;
import ma.sir.ged.bean.core.referentieldoc.DocumentCategorieModel;
import ma.sir.ged.bean.history.DocumentCategorieHistory;
import ma.sir.ged.dao.criteria.core.DocumentCategorieCriteria;
import ma.sir.ged.dao.criteria.history.DocumentCategorieHistoryCriteria;
import ma.sir.ged.dao.facade.core.referentieldoc.DocumentCategorieDao;
import ma.sir.ged.dao.facade.history.DocumentCategorieHistoryDao;
import ma.sir.ged.dao.specification.core.DocumentCategorieSpecification;
import ma.sir.ged.service.facade.admin.doc.DocumentAdminService;
import ma.sir.ged.service.facade.admin.referentieldoc.DocumentCategorieAdminService;
import ma.sir.ged.service.facade.admin.referentieldoc.DocumentCategorieIndexAdminService;
import ma.sir.ged.service.facade.admin.referentieldoc.DocumentCategorieModelAdminService;
import ma.sir.ged.ws.converter.DocumentCategorieConverter;
import ma.sir.ged.ws.dto.DocumentCategorieDto;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import ma.sir.ged.zynerator.util.ListUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DocumentCategorieAdminServiceImpl extends AbstractServiceImpl<DocumentCategorie, DocumentCategorieHistory, DocumentCategorieCriteria, DocumentCategorieHistoryCriteria, DocumentCategorieDao,
        DocumentCategorieHistoryDao> implements DocumentCategorieAdminService {


    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class, readOnly = false)
    public DocumentCategorie create(DocumentCategorie t) {
        DocumentCategorie documentCategorie = super.create(t);
        if (documentCategorie != null) {
            if (t.getDocumentCategorieIndexs() != null) {
                t.getDocumentCategorieIndexs().forEach(element -> {
                    element.setDocumentCategorie(t);
                    documentCategorieIndexService.create(element);
                });
            }
            if (t.getDocumentCategorieModels() != null) {
                t.getDocumentCategorieModels().forEach(element -> {
                    element.setDocumentCategorie(t);
                    documentCategorieModelService.create(element);
                });
            }
            return t;
        } else {
            return null;
        }

    }

    @Override
    public boolean deleteByIdCheckCondition(Long id) {
        return documentService.countByDocumentCategorieId(id) == 0;
    }
    public DocumentCategorie findWithAssociatedLists(Long id) {
        DocumentCategorie result = dao.findById(id).orElse(null);
        if (result != null && result.getId() != null) {
            result.setDocumentCategorieIndexs(documentCategorieIndexService.findByDocumentCategorieId(id));
            result.setDocumentCategorieModels(documentCategorieModelService.findByDocumentCategorieId(id));
        }
        return result;
    }

    @Transactional
    public void deleteAssociatedLists(Long id) {
        documentCategorieIndexService.deleteByDocumentCategorieId(id);
        documentCategorieModelService.deleteByDocumentCategorieId(id);
    }


    public void updateWithAssociatedLists(DocumentCategorie documentCategorie) {
        if (documentCategorie != null && documentCategorie.getId() != null) {
            List<List<DocumentCategorieIndex>> resultDocumentCategorieIndexs = documentCategorieIndexService.getToBeSavedAndToBeDeleted(documentCategorieIndexService.findByDocumentCategorieId(documentCategorie.getId()), documentCategorie.getDocumentCategorieIndexs());
            documentCategorieIndexService.delete(resultDocumentCategorieIndexs.get(1));
            ListUtil.emptyIfNull(resultDocumentCategorieIndexs.get(0)).forEach(e -> e.setDocumentCategorie(documentCategorie));
            documentCategorieIndexService.update(resultDocumentCategorieIndexs.get(0), true);
            List<List<DocumentCategorieModel>> resultDocumentCategorieModels = documentCategorieModelService.getToBeSavedAndToBeDeleted(documentCategorieModelService.findByDocumentCategorieId(documentCategorie.getId()), documentCategorie.getDocumentCategorieModels());
            documentCategorieModelService.delete(resultDocumentCategorieModels.get(1));
            ListUtil.emptyIfNull(resultDocumentCategorieModels.get(0)).forEach(e -> e.setDocumentCategorie(documentCategorie));
            documentCategorieModelService.update(resultDocumentCategorieModels.get(0), true);
        }
    }

    public DocumentCategorie findByReferenceEntity(DocumentCategorie t) {
        DocumentCategorie byCode = dao.findByCode(t.getCode());
        if (byCode == null) {
            DocumentCategorie byLibelle = dao.findByLibelle(t.getLibelle());
            return byLibelle;
        }
        return byCode;
    }


    public void configure() {
        super.configure(DocumentCategorie.class, DocumentCategorieHistory.class, DocumentCategorieHistoryCriteria.class, DocumentCategorieSpecification.class);
    }


    @Autowired
    private DocumentAdminService documentService;
    @Autowired
    private DocumentCategorieConverter documentCategorieConverter;
    @Autowired
    private DocumentCategorieIndexAdminService documentCategorieIndexService;
    @Autowired
    private DocumentCategorieModelAdminService documentCategorieModelService;

    public DocumentCategorieAdminServiceImpl(DocumentCategorieDao dao, DocumentCategorieHistoryDao historyDao) {
        super(dao, historyDao);
    }

    @Override
    public DocumentCategorieDto findByLibelle(String libelle) {
        return documentCategorieConverter.toDto(dao.findByLibelle(libelle));
    }
}
