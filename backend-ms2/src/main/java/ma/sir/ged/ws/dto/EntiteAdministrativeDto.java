package  ma.sir.ged.ws.dto;

import ma.sir.ged.zynerator.audit.Log;
import ma.sir.ged.zynerator.dto.AuditBaseDto;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;


@JsonInclude(JsonInclude.Include.NON_NULL)
public class EntiteAdministrativeDto  extends AuditBaseDto {

    private String code  ;
    private String referenceGed  ;
    private String description  ;
    private String libelle  ;

    private EntiteAdministrativeDto entiteAdministrativeParent ;
    private UtilisateurDto chef ;
    private EntiteAdministrativeTypeDto entiteAdministrativeType ;

    private List<UtilisateurDto> utilisateurs ;
    private Integer archiveLawDuration;


    public EntiteAdministrativeDto(){
        super();
    }


    public Integer getArchiveLawDuration() {
        return archiveLawDuration;
    }

    public void setArchiveLawDuration(Integer archiveLawDuration) {
        this.archiveLawDuration = archiveLawDuration;
    }

    @Log
    public String getCode(){
        return this.code;
    }
    public void setCode(String code){
        this.code = code;
    }

    @Log
    public String getReferenceGed(){
        return this.referenceGed;
    }
    public void setReferenceGed(String referenceGed){
        this.referenceGed = referenceGed;
    }

    @Log
    public String getDescription(){
        return this.description;
    }
    public void setDescription(String description){
        this.description = description;
    }

    @Log
    public String getLibelle(){
        return this.libelle;
    }
    public void setLibelle(String libelle){
        this.libelle = libelle;
    }


    public EntiteAdministrativeDto getEntiteAdministrativeParent(){
        return this.entiteAdministrativeParent;
    }

    public void setEntiteAdministrativeParent(EntiteAdministrativeDto entiteAdministrativeParent){
        this.entiteAdministrativeParent = entiteAdministrativeParent;
    }
    public UtilisateurDto getChef(){
        return this.chef;
    }

    public void setChef(UtilisateurDto chef){
        this.chef = chef;
    }
    public EntiteAdministrativeTypeDto getEntiteAdministrativeType(){
        return this.entiteAdministrativeType;
    }

    public void setEntiteAdministrativeType(EntiteAdministrativeTypeDto entiteAdministrativeType){
        this.entiteAdministrativeType = entiteAdministrativeType;
    }



    public List<UtilisateurDto> getUtilisateurs(){
        return this.utilisateurs;
    }

    public void setUtilisateurs(List<UtilisateurDto> utilisateurs){
        this.utilisateurs = utilisateurs;
    }



}
