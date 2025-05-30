package ma.sir.ged.service.facade.bo;

import ma.sir.ged.bean.core.bureauOrdre.PlanClassementBO;
import ma.sir.ged.dao.facade.core.bureauOrdre.PlanClassementBORepository;
import ma.sir.ged.zynerator.exception.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PlanClassementBoService {
    @Autowired
    private PlanClassementBORepository planClassementBORepository;

    public List<PlanClassementBO> findAll() {
        return planClassementBORepository.findAll();
    }

    public List<PlanClassementBO> findAllParents() {
        List<PlanClassementBO> planClassementBO = planClassementBORepository.findAll();
        List<PlanClassementBO> parents = new ArrayList<>();

        for (PlanClassementBO plan : planClassementBO) {
            if (plan.getParent() == null) {
                parents.add(plan);
            }
        }

        return parents;
    }

    public PlanClassementBO findById(Long id) {
        return planClassementBORepository.findById(id).orElse(null);
    }

    public PlanClassementBO findByCode(String code) {
        return planClassementBORepository.findByCode(code).orElse(null);
    }

    public PlanClassementBO save(PlanClassementBO planClassementBO) {
        planClassementBO.setCode("code-" + generateDefaultCode(planClassementBO.getLibelle()));
        if(planClassementBO.getParent() != null) {
            PlanClassementBO parent = planClassementBORepository.findById(planClassementBO.getParent().getId()).orElseThrow(() -> new EntityNotFoundException("Parent not found"));
            planClassementBO.setParent(parent);
            parent.getChildren().add(planClassementBO);
        }

        planClassementBORepository.save(planClassementBO);
        return planClassementBO;
    }

    public PlanClassementBO update(PlanClassementBO planClassementBO) {
        if (planClassementBO.getId() == null) {
            throw new IllegalArgumentException("Cannot update entity with null ID");
        }

        PlanClassementBO existingPlanClassementBO = planClassementBORepository.findById(planClassementBO.getId())
                .orElseThrow(() -> new EntityNotFoundException("PlanClassementBO with id " + planClassementBO.getId() + " not found"));

        existingPlanClassementBO.setCode(planClassementBO.getCode());
        existingPlanClassementBO.setLibelle(planClassementBO.getLibelle());
        existingPlanClassementBO.setDescription(planClassementBO.getDescription());
        existingPlanClassementBO.setParent(planClassementBO.getParent());
        existingPlanClassementBO.setChildren(planClassementBO.getChildren());

        return planClassementBORepository.save(existingPlanClassementBO);
    }

    public void delete(Long id) {
        PlanClassementBO planToDelete = planClassementBORepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Plan not found"));

        if (!planToDelete.getChildren().isEmpty()) {
            throw new IllegalStateException("Impossible de supprimer un plan avec des enfants");
        } else if (!planToDelete.getCourriels().isEmpty()) {
            throw new IllegalStateException("Impossible de supprimer un plan avec des courriels");
        } else {
            planClassementBORepository.deleteById(id);
        }
    }

    private String generateDefaultCode(String libelle) {
        // Transformation du libellé en minuscules et remplacement des espaces par des tirets
        String formattedLibelle = libelle.toLowerCase().replaceAll(" ", "-");
        String fin = UUID.randomUUID().toString();
        String generatedCode = formattedLibelle + "-" + fin;

        return generatedCode;
    }
}
