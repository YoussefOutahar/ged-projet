package ma.sir.ged.service.facade.admin.organigramme;

import ma.sir.ged.bean.core.organigramme.PlanClassementModel;
import ma.sir.ged.bean.core.organigramme.PlanClassementModelIndex;
import ma.sir.ged.dao.criteria.core.PlanClassementModelCriteria;
import ma.sir.ged.dao.criteria.history.PlanClassementModelHistoryCriteria;
import ma.sir.ged.ws.dto.PlanClassementIndexDto;
import ma.sir.ged.ws.dto.PlanClassementModelDto;
import ma.sir.ged.ws.dto.PlanClassementModelIndexDto;
import ma.sir.ged.zynerator.service.IService;

import java.util.List;


public interface PlanClassementModelService extends IService<PlanClassementModel, PlanClassementModelCriteria, PlanClassementModelHistoryCriteria> {

    PlanClassementModel findByLibelle (String libelle);

    PlanClassementModelDto createWithIndexs (PlanClassementModelDto dto);

    PlanClassementModelDto upddateWithIndexs(PlanClassementModelDto dto);


    Boolean deleteModelAndAssociatedList(Long id);
}

