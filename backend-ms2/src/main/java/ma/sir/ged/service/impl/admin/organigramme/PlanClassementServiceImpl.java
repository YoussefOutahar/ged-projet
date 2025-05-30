package ma.sir.ged.service.impl.admin.organigramme;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import ma.sir.ged.bean.core.organigramme.PlanClassement;
import ma.sir.ged.bean.core.organigramme.PlanClassementModel;
import ma.sir.ged.bean.core.organigramme.enums.ArchivageType;
import ma.sir.ged.dao.facade.core.organigramme.PlanClassementModelDao;
import ma.sir.ged.dao.facade.core.organigramme.PlanClassementRepository;
import ma.sir.ged.service.facade.admin.doc.DocumentAdminService;
import ma.sir.ged.service.facade.admin.organigramme.PlanClassementService;
import ma.sir.ged.ws.converter.PlanClassementConverter;
import ma.sir.ged.ws.dto.DocumentDto;
import ma.sir.ged.ws.dto.PlanClassementDto;
import ma.sir.ged.ws.dto.summary.PlanClassementSummaryDto;
import ma.sir.ged.zynerator.exception.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.ContextStartedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PlanClassementServiceImpl implements PlanClassementService {

    @Autowired
    private PlanClassementRepository planClassementRepository;
    @Autowired
    private PlanClassementModelDao planClassementModelDao;
    @Autowired
    private PlanClassementConverter converter;
    @Autowired
    private DocumentAdminService documentAdminService;
    @Override
    @Caching(evict = {
            @CacheEvict(value = "TopLevelPlans", allEntries = true),
            @CacheEvict(value = "AllPlans", allEntries = true)
    })
    public PlanClassement savePlanClassement(PlanClassementDto planClassementDTO) {
        PlanClassement planClassement = new PlanClassement();
        String generatedCode = generateDefaultCode(planClassementDTO.getLibelle());
        planClassement.setCode(generatedCode);
        planClassement.setLibelle(planClassementDTO.getLibelle());
        planClassement.setDescription(planClassementDTO.getDescription());
        planClassement.setArchive(false);

        if(planClassementDTO.getArchiveFinalDuree()>planClassementDTO.getArchiveIntermidiaireDuree()){
            planClassement.setArchiveIntermidiaireDuree(planClassementDTO.getArchiveIntermidiaireDuree());
            planClassement.setArchiveFinalDuree(planClassementDTO.getArchiveFinalDuree());
        }else {
            throw new IllegalArgumentException("La durée de l'archive final doit être supérieur à celle de l'archive intermédiaire");
        }
        planClassement.setArchivageType(planClassementDTO.getArchivageType());

        if (planClassementDTO.getParentId() != null) {
            // Si parentId n'est pas null, recherche du parent et liaison
            PlanClassement parent = planClassementRepository.findById(planClassementDTO.getParentId())
                    .orElseThrow(() -> new EntityNotFoundException("Parent not found"));
            planClassement.setParent(parent);
        }

        return planClassementRepository.save(planClassement);
    }
    public PlanClassement createOrGetPlan(String libelle, PlanClassement parent) {
        PlanClassement plan = planClassementRepository.findByLibelleAndParentId(libelle, parent.getId());
        if (plan == null) {
            PlanClassementDto planClassementDTO = new PlanClassementDto();
            planClassementDTO.setLibelle(libelle);
            planClassementDTO.setParentId(parent != null ? parent.getId() : null);
            planClassementDTO.setArchivageType(ArchivageType.FINALE);
            planClassementDTO.setArchiveIntermidiaireDuree(1);
            planClassementDTO.setArchiveFinalDuree(5);
            plan = savePlanClassement(planClassementDTO);
        }
        return plan;
    }
    @Override
    public PlanClassement createYearlyAndMonthlyPlans(List<PlanClassementDto> planClassementDtoList) {
        LocalDate now = LocalDate.now();
        String currentYear = String.valueOf(now.getYear());
        String currentMonth = now.getMonth().getDisplayName(TextStyle.FULL, Locale.getDefault());

        PlanClassement espace = planClassementRepository.findByLibelle("Espace de Travail");
        PlanClassement yearlyPlan = createOrGetPlan(currentYear, espace);
        PlanClassement monthlyPlan = createOrGetPlan(currentMonth, yearlyPlan);

        PlanClassement parent = monthlyPlan;
        for (PlanClassementDto dto : planClassementDtoList) {
            PlanClassement existingPlan = planClassementRepository.findByLibelleAndParentId(dto.getLibelle(), parent.getId());
            if (existingPlan == null) {
                dto.setParentId(parent.getId());
                dto.setArchivageType(ArchivageType.FINALE);
                dto.setArchiveIntermidiaireDuree(5);
                dto.setArchiveFinalDuree(10);
                PlanClassement plan = savePlanClassement(dto);
                parent = plan;
            } else {
                parent = existingPlan;
            }
        }

        return parent;
    }
    @Override
    public PlanClassement findByLibelleAndParent(String libelle, Long parentId){
        PlanClassement plan = planClassementRepository.findByLibelleAndParentId(libelle, parentId);
        if(plan == null){
            return null;
        }else{
            return plan;
        }
    }
    @Override
    @Cacheable("TopLevelPlans")
    public List<PlanClassement> getAllPlans() {
        List<PlanClassement> allPlans = planClassementRepository.findAll();
        List<PlanClassement> topLevelPlans = new ArrayList<>();

        // Filtrer les plans qui sont des enfants
        for (PlanClassement plan : allPlans) {
            if (plan.getParent() == null && !plan.getArchive()) {
                topLevelPlans.add(plan);
            }
        }

        return topLevelPlans;
    }

    @Override
    public List<PlanClassement> getParentPlans() {
        return planClassementRepository.findParentPlanClassement();
    }

    @Override
    public List<PlanClassement> findChildrenByParentId(Long parentId) {
        return planClassementRepository.findChildrenByParentId(parentId);
    }

    @Override
    @Cacheable("AllPlans")
    public List<PlanClassement> getPlansList() {
        return planClassementRepository.findAll();
    }
    @Override
    public List<PlanClassementSummaryDto> getPlansNonArchiveList() {
        List<PlanClassement> allPlans = planClassementRepository.findAll();
        List<PlanClassement> filteredPlans = new ArrayList<>();

        for (PlanClassement plan : allPlans) {
            // Vérifier si le plan et son parent ne sont pas archivés
            if (shouldIncludePlan(plan)) {
                filteredPlans.add(plan);
            }
        }
        return converter.toSummaryDto(filteredPlans);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "TopLevelPlans", allEntries = true),
            @CacheEvict(value = "AllPlans", allEntries = true)
    })
    public PlanClassement updatePlanClassement(Long planId, PlanClassementDto planClassementDTO) {
        PlanClassement existingPlan = planClassementRepository.findById(planId)
                .orElseThrow(() -> new EntityNotFoundException("Plan not found"));

        existingPlan.setLibelle(planClassementDTO.getLibelle());
        existingPlan.setDescription(planClassementDTO.getDescription());
        existingPlan.setArchive(planClassementDTO.getArchive());
        if(planClassementDTO.getArchiveFinalDuree()>planClassementDTO.getArchiveIntermidiaireDuree()) {
            existingPlan.setArchiveIntermidiaireDuree(planClassementDTO.getArchiveIntermidiaireDuree());
            existingPlan.setArchiveFinalDuree(planClassementDTO.getArchiveFinalDuree());
        }else {
            throw new IllegalArgumentException("La durée de l'archive final doit être supérieur à celle de l'archive intermédiaire");
        }
        existingPlan.setArchivageType(planClassementDTO.getArchivageType());
        if (planClassementDTO.getPlanClassementModelId() != null) {
            PlanClassementModel planClassementModel = planClassementModelDao.findById(planClassementDTO.getPlanClassementModelId())
                    .orElseThrow(() -> new EntityNotFoundException("Plan Model not found"));
            existingPlan.setPlanClassementModel(planClassementModel);
        }

        return planClassementRepository.save(existingPlan);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "TopLevelPlans", allEntries = true),
            @CacheEvict(value = "AllPlans", allEntries = true)
    })
    public void deletePlanClassement(Long planId) {
        PlanClassement planToDelete = planClassementRepository.findById(planId)
                .orElseThrow(() -> new EntityNotFoundException("Plan not found"));

        // Vérifiez s'il n'a pas d'enfants avant de le supprimer
        if (planToDelete.getChildren().isEmpty()) {
            planClassementRepository.delete(planToDelete);
        } else {
            throw new IllegalStateException("Cannot delete a plan with children");
        }

    }
    @Override
    @Caching(evict = {
            @CacheEvict(value = "TopLevelPlans", allEntries = true),
            @CacheEvict(value = "AllPlans", allEntries = true)
    })
    public PlanClassement archiverPlanClassement(Long planId) {
        PlanClassement existingPlan = planClassementRepository.findById(planId)
                .orElseThrow(() -> new EntityNotFoundException("Plan not found"));
        List<DocumentDto> dtos = documentAdminService.findByPlanClassementId(planId);
        documentAdminService.archiveAssociatedDocument(dtos);

        existingPlan.setArchive(true);

        return planClassementRepository.save(existingPlan);
    }
    @Override
    @Caching(evict = {
            @CacheEvict(value = "TopLevelPlans", allEntries = true),
            @CacheEvict(value = "AllPlans", allEntries = true)
    })
    public PlanClassement restaurerPlanClassement(Long planId) {
        PlanClassement existingPlan = planClassementRepository.findById(planId)
                .orElseThrow(() -> new EntityNotFoundException("Plan not found"));
        List<DocumentDto> dtos = documentAdminService.findByPlanClassementId(planId);
        documentAdminService.desarchiveAssociatedDocument(dtos);
        existingPlan.setArchive(false);

        return planClassementRepository.save(existingPlan);
    }

    @Override
    public List<PlanClassement> findByLibelle(String libelle) {
        return planClassementRepository.findByLibelleContaining(libelle);
    }

    @Override
    public String findPlanClassementLibelleByIdChildren(Long id) {
        Optional<PlanClassement> optionalPlan = planClassementRepository.findById(id);
        if (!optionalPlan.isPresent()) {
            return null;
        }
        PlanClassement plan = optionalPlan.get();
        if (plan.getParent() == null) {
            return null;
        }
        Long parentId = plan.getParent().getId();
        Optional<PlanClassement> optionalParentPlan = planClassementRepository.findById(parentId);
        if (!optionalParentPlan.isPresent()) {
            return null;
        }
        return optionalParentPlan.get().getLibelle();
    }

    @Override
    public PlanClassement findById(Long Id) {
        return planClassementRepository.findById(Id)
                .orElseThrow(() -> new EntityNotFoundException("Plan not found")) ;
    }

    @Override
    public List<PlanClassementDto> searchPlanClassementByLibelleSimple(String libelle) {
        List<PlanClassement> matchingPlans = planClassementRepository.findByLibelleContaining(libelle);
        return matchingPlans.stream()
                .map(converter::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<PlanClassementDto> searchPlanClassementByLibelle(String libelle) {
        List<PlanClassement> matchingPlans = planClassementRepository.findByLibelleContaining(libelle);
        Map<List<Long>, List<PlanClassementDto>> groupedByAncestors = new HashMap<>();

        for (PlanClassement matchingPlan : matchingPlans) {
            PlanClassementDto dto = converter.toDto(matchingPlan);
            if (matchingPlan.getParent() != null) {
                dto.setParentId(matchingPlan.getParent().getId());
            }
            if (matchingPlan.getChildren() != null) {
                List<PlanClassementDto> childrenDto = matchingPlan.getChildren().stream()
                        .map(converter::toDto)
                        .collect(Collectors.toList());
                dto.setChildren(childrenDto);
            }

            List<Long> ancestorIds = getAncestorIds(dto);
            groupedByAncestors.computeIfAbsent(ancestorIds, k -> new ArrayList<>()).add(dto);
        }

        List<PlanClassementDto> result = new ArrayList<>();
        for (List<PlanClassementDto> group : groupedByAncestors.values()) {
            PlanClassementDto parent = new PlanClassementDto();
            parent.setChildren(group);
            result.add(parent);
        }

        return result;
    }

    private List<Long> getAncestorIds(PlanClassementDto dto) {
        List<Long> ancestorIds = new ArrayList<>();
        PlanClassementDto current = dto;
        while (current.getParentId() != null) {
            ancestorIds.add(current.getParentId());
            current = current.getParent();
        }
        return ancestorIds;
    }

    private String generateDefaultCode(String libelle) {
        // Transformation du libellé en minuscules et remplacement des espaces par des tirets
        String formattedLibelle = libelle.toLowerCase().replaceAll(" ", "-");
        String fin = UUID.randomUUID().toString();
        String generatedCode = formattedLibelle + "-" + fin;

        return generatedCode;
    }
    private boolean shouldIncludePlan(PlanClassement plan) {
        // Vérifier si le plan est archivé
        if (plan.getArchive()) {
            return false;
        }

        // Vérifier si le plan parent est archivé (si le plan a un parent)
        PlanClassement parent = plan.getParent();
        /*if (parent != null && parent.getArchive()) {
            return false;
        };*/
        while (parent != null) {
            if (parent.getArchive()) {
                return false;
            }
            parent = parent.getParent();
        }

        // Vérifier récursivement les enfants du plan
        List<PlanClassement> children = plan.getChildren();
        if (children != null && !children.isEmpty()) {
            List<PlanClassement> filteredChildren = new ArrayList<>();
            for (PlanClassement child : children) {
                if (shouldIncludePlan(child)) {
                    filteredChildren.add(child);
                }
            }
            plan.setChildren(filteredChildren);
        }

        return true;
    }

    @Override
    public void importFromJson(MultipartFile file) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        List<PlanClassement> plans = objectMapper.readValue(file.getInputStream(), new TypeReference<List<PlanClassement>>(){});
        planClassementRepository.saveAll(plans);
    }

    @Override
    public String exportToJson() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        List<PlanClassement> plans = getAllPlans();
        String json = objectMapper.writeValueAsString(plans);
        return json;
    }

}
