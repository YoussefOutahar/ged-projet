package ma.sir.ged.ws.converter;

import ma.sir.ged.bean.core.organigramme.PlanClassement;
import ma.sir.ged.bean.history.PlanClassementHistory;
import ma.sir.ged.ws.dto.PlanClassementDto;
import ma.sir.ged.ws.dto.summary.PlanClassementSummaryDto;
import ma.sir.ged.zynerator.converter.AbstractConverter;
import ma.sir.ged.zynerator.util.ListUtil;
import ma.sir.ged.zynerator.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Objects.nonNull;

@Component
public class PlanClassementConverter extends AbstractConverter<PlanClassement, PlanClassementDto, PlanClassementHistory> {
    @Autowired
    private PlanClassementModelConverter planClassementModelConverter;

    @Autowired
    private PlanClassementIndexElementConverter planClassementIndexElementConverter;
    private boolean children;
    private boolean planClassementModel;
    private boolean planClassementIndexElement;

    public  PlanClassementConverter(){
        super(PlanClassement.class, PlanClassementDto.class, PlanClassementHistory.class);
        init(true);
    }

    @Override
    public PlanClassement toItem(PlanClassementDto dto) {
        if (dto == null) {
            return null;
        } else {
            PlanClassement item = new PlanClassement();
            item.setArchive(false);
            if (StringUtil.isNotEmpty(dto.getId()))
                item.setId(dto.getId());
            if (StringUtil.isNotEmpty(dto.getCode()))
                item.setCode(dto.getCode());
            if (StringUtil.isNotEmpty(dto.getDescription()))
                item.setDescription(dto.getDescription());
            if (dto.getArchiveIntermidiaireDuree() != null)
                item.setArchiveIntermidiaireDuree(dto.getArchiveIntermidiaireDuree());
            if (dto.getArchiveFinalDuree() != null)
                item.setArchiveFinalDuree(dto.getArchiveFinalDuree());
            if (dto.getArchivageType() != null)
                item.setArchivageType(dto.getArchivageType());
            if (StringUtil.isNotEmpty(dto.getLibelle()))
                item.setLibelle(dto.getLibelle());
            if (this.children && dto.getChildren() != null)
                item.setChildren(toItem(dto.getChildren()));
            if(dto.getPlanClassementModelDto()!=null &&  dto.getPlanClassementModelDto().getId() != null)
                item.setPlanClassementModel(planClassementModelConverter.toItem(dto.getPlanClassementModelDto()));
            if(ListUtil.isNotEmpty(dto.getPlanClassementIndexElements()))
                item.setPlanClassementIndexElements(planClassementIndexElementConverter.toItem(dto.getPlanClassementIndexElements()));



            return item;
        }
    }

    @Override
    public PlanClassementDto toDto(PlanClassement item) {
        if (item == null) {
            return null;
        } else {
            PlanClassementDto dto = new PlanClassementDto();
            if(StringUtil.isNotEmpty(item.getId()))
                dto.setId(item.getId());
            if(StringUtil.isNotEmpty(item.getCode()))
                dto.setCode(item.getCode());
            if(StringUtil.isNotEmpty(item.getDescription()))
                dto.setDescription(item.getDescription());
            if(StringUtil.isNotEmpty(item.getLibelle()))
                dto.setLibelle(item.getLibelle());
            if(item.getArchiveIntermidiaireDuree()!=null)
                dto.setArchiveIntermidiaireDuree(item.getArchiveIntermidiaireDuree());
            if(item.getArchiveFinalDuree()!= null)
                dto.setArchiveFinalDuree(item.getArchiveFinalDuree());
            if(item.getArchivageType()!= null)
                dto.setArchivageType(item.getArchivageType());
            if(dto.getArchive() != null)
                item.setArchive(dto.getArchive());
            if(this.children && item.getChildren()!=null) {
                this.setChildren(false);
                dto.setChildren(toDto(item.getChildren()));
                this.setChildren(true);
            if(item.getPlanClassementModel()!=null &&  item.getPlanClassementModel().getId() != null)
                    dto.setPlanClassementModelDto(planClassementModelConverter.toDto(item.getPlanClassementModel()));

            }
            dto.setPlansHierarchie(new LinkedList<>());
            setDtoPlansHierarchie(dto, item);
            return dto;
        }
    }

    public PlanClassementDto toDtoNoChildren(PlanClassement item) {
        if (item == null) {
            return null;
        } else {
            PlanClassementDto dto = new PlanClassementDto();
            if(StringUtil.isNotEmpty(item.getId())) {
                dto.setId(item.getId());
            }

            if(StringUtil.isNotEmpty(item.getCode())) {
                dto.setCode(item.getCode());
            } else {
                dto.setCode("");
            }

            if(StringUtil.isNotEmpty(item.getDescription())) {
                dto.setDescription(item.getDescription());
            } else {
                dto.setDescription("");
            }

            if(StringUtil.isNotEmpty(item.getLibelle())) {
                dto.setLibelle(item.getLibelle());
            } else {
                dto.setLibelle("");
            }

            if(item.getArchive() != null)
                dto.setArchive(item.getArchive());

            if(item.getArchiveIntermidiaireDuree() != null)
                dto.setArchiveIntermidiaireDuree(item.getArchiveIntermidiaireDuree());

            if(item.getArchiveFinalDuree() != null)
                dto.setArchiveFinalDuree(item.getArchiveFinalDuree());

            if(item.getArchivageType() != null)
                dto.setArchivageType(item.getArchivageType());

            if(item.getPlanClassementModel() != null)
                dto.setPlanClassementModelId(item.getPlanClassementModel().getId());

            if(ListUtil.isNotEmpty(item.getPlanClassementIndexElements())) {
                dto.setPlanClassementIndexElements(planClassementIndexElementConverter.toDto(item.getPlanClassementIndexElements()));
            } else {
                dto.setPlanClassementIndexElements(Collections.emptyList());
            }

            if(nonNull(item.getCreatedOn())){
                dto.setCreatedOn(item.getCreatedOn().format(DateTimeFormatter.ofPattern("dd/MM:yyyy hh:mm")));
            }

            if(nonNull(item.getUpdatedOn())){
                dto.setUpdatedOn(item.getUpdatedOn().format(DateTimeFormatter.ofPattern("dd/MM:yyyy hh:mm")));
            }

            if (StringUtil.isNotEmpty(item.getCreatedBy()))
                dto.setCreatedBy(item.getCreatedBy());

            if (StringUtil.isNotEmpty(item.getUpdatedBy()))
                dto.setUpdatedBy(item.getUpdatedBy());

            return dto;
        }
    }

    public PlanClassementSummaryDto toSummaryDto(PlanClassement item) {
        if (item == null) {
            return null;
        } else {
            PlanClassementSummaryDto dto = new PlanClassementSummaryDto();
            if(StringUtil.isNotEmpty(item.getId()))
                dto.setId(item.getId());
            if(StringUtil.isNotEmpty(item.getCode()))
                dto.setCode(item.getCode());
            if(StringUtil.isNotEmpty(item.getDescription()))
                dto.setDescription(item.getDescription());
            if(StringUtil.isNotEmpty(item.getLibelle()))
                dto.setLibelle(item.getLibelle());
            if(dto.getArchive() != null)
                item.setArchive(dto.getArchive());
            return dto;
        }
    }
    public List<PlanClassementSummaryDto> toSummaryDto(List<PlanClassement> items){
        return items.stream()
                .map(this::toSummaryDto)
                .collect(Collectors.toList());
    }

    public void initList(boolean value) {
        this.planClassementIndexElement = value;
        this.planClassementModel = value;
        this.children = value;
    }
    public boolean isChildren() {
        return children;
    }

    public void setChildren(boolean children) {
        this.children = children;
    }

    public boolean isPlanClassementModel() {
        return planClassementModel;
    }

    public void setPlanClassementModel(boolean planClassementModel) {
        this.planClassementModel = planClassementModel;
    }

    public boolean isPlanClassementIndexElement() {
        return planClassementIndexElement;
    }

    public void setPlanClassementIndexElement(boolean planClassementIndexElement) {
        this.planClassementIndexElement = planClassementIndexElement;
    }

    private void setDtoPlansHierarchie(PlanClassementDto dto, PlanClassement item) {
        if (item.getParent() != null) {
            List<String> plansHierarchie = dto.getPlansHierarchie();
            if(plansHierarchie != null) {
                plansHierarchie.add(0, item.getParent().getLibelle());
                dto.setPlansHierarchie(plansHierarchie);
                setDtoPlansHierarchie(dto, item.getParent());
            }
        }
    }
}
