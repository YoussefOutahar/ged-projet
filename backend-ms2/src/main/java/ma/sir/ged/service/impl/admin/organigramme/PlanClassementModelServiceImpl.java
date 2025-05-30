package ma.sir.ged.service.impl.admin.organigramme;

import ma.sir.ged.bean.core.organigramme.PlanClassementModel;
import ma.sir.ged.bean.core.organigramme.PlanClassementModelIndex;
import ma.sir.ged.bean.history.PlanClassementModelHistory;
import ma.sir.ged.dao.criteria.core.PlanClassementModelCriteria;
import ma.sir.ged.dao.criteria.history.PlanClassementModelHistoryCriteria;
import ma.sir.ged.dao.facade.core.organigramme.PlanClassementModelDao;
import ma.sir.ged.dao.facade.core.organigramme.PlanClassementModelIndexDao;
import ma.sir.ged.dao.facade.core.organigramme.PlanClassementRepository;
import ma.sir.ged.dao.facade.history.PlanClassementModelHistoryDao;
import ma.sir.ged.dao.specification.core.PlanClassementModelSpecification;
import ma.sir.ged.service.facade.admin.organigramme.PlanClassementModelIndexService;
import ma.sir.ged.service.facade.admin.organigramme.PlanClassementModelService;
import ma.sir.ged.ws.converter.PlanClassementIndexConverter;
import ma.sir.ged.ws.converter.PlanClassementModelConverter;
import ma.sir.ged.ws.dto.PlanClassementModelDto;
import ma.sir.ged.zynerator.exception.EntityNotFoundException;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PlanClassementModelServiceImpl extends AbstractServiceImpl<PlanClassementModel, PlanClassementModelHistory, PlanClassementModelCriteria, PlanClassementModelHistoryCriteria, PlanClassementModelDao,
        PlanClassementModelHistoryDao> implements PlanClassementModelService {

    private final PlanClassementModelConverter planClassementModelConverter;
    private final PlanClassementModelDao planClassementModelDao;
    private final PlanClassementModelIndexDao planClassementModelIndexDao;
    private final PlanClassementRepository planClassementRepository;

    public PlanClassementModelServiceImpl(PlanClassementModelDao dao, PlanClassementModelHistoryDao historyRepository, PlanClassementModelConverter planClassementModelConverter, PlanClassementIndexConverter planClassementIndexConverter, PlanClassementModelIndexService planClassementModelIndexService,
                                          PlanClassementModelDao planClassementModelDao,
                                          PlanClassementModelIndexDao planClassementModelIndexDao,
                                          PlanClassementRepository planClassementRepository) {
        super(dao, historyRepository);
        this.planClassementModelConverter = planClassementModelConverter;
        this.planClassementModelDao = planClassementModelDao;
        this.planClassementModelIndexDao = planClassementModelIndexDao;
        this.planClassementRepository = planClassementRepository;
    }

    @Override
    public PlanClassementModel findByLibelle(String libelle) {
        return null;
    }

    @Override
    @Transactional
    public PlanClassementModelDto createWithIndexs (PlanClassementModelDto modelDto){

        PlanClassementModel model = planClassementModelConverter.toItem(modelDto);
        List<PlanClassementModelIndex> modelIndexList = model.getPlanClassementIndexs();

        PlanClassementModel savedModel = planClassementModelDao.save(model);
        modelIndexList.forEach(modelIndex -> {
            modelIndex.setPlanClassementModel(savedModel);
            planClassementModelIndexDao.save(modelIndex);
        });

        savedModel.setPlanClassementIndexs(modelIndexList);
        planClassementModelDao.save(savedModel);

        return planClassementModelConverter.toDto(savedModel);
    }

    @Override
    @Transactional
    public PlanClassementModelDto upddateWithIndexs(PlanClassementModelDto dto) {
        PlanClassementModel model = planClassementModelConverter.toItem(dto);
        if(model.getPlanClassementIndexs() != null && !model.getPlanClassementIndexs().isEmpty()) {

            List<Long> indexsLinkedToModel = CollectionUtils.emptyIfNull(planClassementModelIndexDao.findIndexsByPlanClassementModelId(model.getId()))
                    .stream().map(index -> index.getId())
                    .collect(Collectors.toList());

            List<PlanClassementModelIndex> indexsToAdd = model.getPlanClassementIndexs()
                    .stream().filter(index -> !indexsLinkedToModel.contains(index.getPlanClassementIndex().getId()))
                    .collect(Collectors.toList());

            indexsToAdd.forEach(index -> {
                index.setPlanClassementModel(model);
                planClassementModelIndexDao.save(index);
                model.getPlanClassementIndexs().add(index);
            });
        }
        dao.save(model);
        return planClassementModelConverter.toDto(model);
    }

    @Override
    public Boolean deleteModelAndAssociatedList(Long id) {
        int countUsage = planClassementRepository.countModelUsage(id);
        if(countUsage > 0) {
            return false;
        }else {
            List<PlanClassementModelIndex> linkedIndexs = planClassementModelIndexDao.findAllByPlanClassementModelId(id);
            linkedIndexs.forEach(index -> planClassementModelIndexDao.deleteById(index.getId()));
            dao.deleteById(id);
            return true;
        }
    }

    @Override
    public void configure() {
        super.configure(PlanClassementModel.class, PlanClassementModelHistory.class, PlanClassementModelHistoryCriteria.class, PlanClassementModelSpecification.class);
    }
}
