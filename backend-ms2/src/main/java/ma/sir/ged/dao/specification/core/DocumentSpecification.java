package  ma.sir.ged.dao.specification.core;

import ma.sir.ged.dao.criteria.core.EchantillonCriteria;
import ma.sir.ged.zynerator.specification.AbstractSpecification;
import ma.sir.ged.dao.criteria.core.DocumentCriteria;
import ma.sir.ged.bean.core.doc.Document;

public class DocumentSpecification extends  AbstractSpecification<DocumentCriteria, Document>  {

    @Override
    public void constructPredicates() {
        addPredicateId("id", criteria);
        addPredicate("reference", criteria.getReference(),criteria.getReferenceLike());
        addPredicate("referenceGed", criteria.getReferenceGed(),criteria.getReferenceGedLike());
        addPredicate("elasticId", criteria.getElasticId());
        addPredicate("uploadDate", criteria.getUploadDate(), criteria.getUploadDateFrom(), criteria.getUploadDateTo());
        addPredicateLong("annee", criteria.getAnnee(), criteria.getAnneeMin(), criteria.getAnneeMax());
        addPredicateLong("semstre", criteria.getSemstre(), criteria.getSemstreMin(), criteria.getSemstreMax());
        addPredicateLong("mois", criteria.getMois(), criteria.getMoisMin(), criteria.getMoisMax());
        addPredicateLong("jour", criteria.getJour(), criteria.getJourMin(), criteria.getJourMax());
        addPredicateLong("ligne", criteria.getLigne());
        addPredicateLong("colonne", criteria.getColonne());
        addPredicateLong("numBoite", criteria.getNumBoite());
        addPredicateBool("ocr", criteria.getOcr());
        addPredicateBigDecimal("size", criteria.getSize(), criteria.getSizeMin(), criteria.getSizeMax());
        addPredicateBool("archive", criteria.getArchive());
        addPredicateBool("versionne", criteria.getVersionne());
        addPredicateBool("deleted", criteria.getDeleted());
        addPredicateBool("locked", criteria.getLocked());
        addPredicateBool("archivable", criteria.getArchivable());
        addPredicateBool("qualityStatus", criteria.getQualityStatus());
        addPredicateBool("qualityFlag", criteria.getQualityFlag());
        addPredicateFk("documentType","id", criteria.getDocumentType()==null?null:criteria.getDocumentType().getId());
        addPredicateFk("documentType","id", criteria.getDocumentTypes());
        addPredicateFk("documentType","code", criteria.getDocumentType()==null?null:criteria.getDocumentType().getCode());
        addPredicateFk("documentState","id", criteria.getDocumentState()==null?null:criteria.getDocumentState().getId());
        addPredicateFk("documentState","id", criteria.getDocumentStates());
        addPredicateFk("documentState","code", criteria.getDocumentState()==null?null:criteria.getDocumentState().getCode());
        addPredicateFk("documentCategorie","id", criteria.getDocumentCategorie()==null?null:criteria.getDocumentCategorie().getId());
        addPredicateFk("documentCategorie","id", criteria.getDocumentCategories());
        addPredicateFk("documentCategorie","code", criteria.getDocumentCategorie()==null?null:criteria.getDocumentCategorie().getCode());
        addPredicateFk("utilisateur","id", criteria.getUtilisateur()==null?null:criteria.getUtilisateur().getId());
        addPredicateFk("utilisateur","id", criteria.getUtilisateurs());
        addPredicateFk("utilisateur","email", criteria.getUtilisateur()==null?null:criteria.getUtilisateur().getEmail());
        addPredicateFk("utilisateur","username", criteria.getUtilisateur()==null?null:criteria.getUtilisateur().getUsername());
        addPredicateFk("entiteAdministrative","id", criteria.getEntiteAdministrative()==null?null:criteria.getEntiteAdministrative().getId());
        addPredicateFk("entiteAdministrative","id", criteria.getEntiteAdministratives());
        addPredicateFk("entiteAdministrative","code", criteria.getEntiteAdministrative()==null?null:criteria.getEntiteAdministrative().getCode());
        addPredicateFk("planClassement","id", criteria.getPlanClassement()==null?null:criteria.getPlanClassement().getId());
        addPredicateFk("planClassement","id", criteria.getPlanClassements());
        addPredicateFk("planClassement","code", criteria.getPlanClassement()==null?null:criteria.getPlanClassement().getCode());
        addPredicateFk("documentCategorieModel","id", criteria.getDocumentCategorieModel()==null?null:criteria.getDocumentCategorieModel().getId());
        addPredicateFk("documentCategorieModel","id", criteria.getDocumentCategorieModels());
        addPredicateFk("documentCategorieModel","code", criteria.getDocumentCategorieModel()==null?null:criteria.getDocumentCategorieModel().getCode());
        //addPredicateFk("echantillons","id", criteria.getEchantillons());
        if (criteria.getEchantillons() != null) {
            for (EchantillonCriteria echantillonCriteria : criteria.getEchantillons()) {
                if (echantillonCriteria.getNomEchantillon() != null) {
                    addPredicateFk("echantillons","nomEchantillon", criteria.getEchantillons()==null?null:criteria.getEchantillons());
                }
            }
        }
    }

    public DocumentSpecification(DocumentCriteria criteria) {
        super(criteria);
    }

    public DocumentSpecification(DocumentCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
