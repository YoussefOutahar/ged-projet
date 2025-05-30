package  ma.sir.ged.dao.specification.history;

import ma.sir.ged.zynerator.specification.AbstractHistorySpecification;
import ma.sir.ged.dao.criteria.history.EtatUtilisateurHistoryCriteria;
import ma.sir.ged.bean.history.EtatUtilisateurHistory;


public class EtatUtilisateurHistorySpecification extends AbstractHistorySpecification<EtatUtilisateurHistoryCriteria, EtatUtilisateurHistory> {

    public EtatUtilisateurHistorySpecification(EtatUtilisateurHistoryCriteria criteria) {
        super(criteria);
    }

    public EtatUtilisateurHistorySpecification(EtatUtilisateurHistoryCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
