package  ma.sir.ged.ws.dto;

import ma.sir.ged.zynerator.audit.Log;
import ma.sir.ged.zynerator.dto.AuditBaseDto;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Date;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import com.fasterxml.jackson.annotation.JsonFormat;


@JsonInclude(JsonInclude.Include.NON_NULL)
public class GroupeUtilisateurDto  extends AuditBaseDto {

    private String dateAjout ;

    private GroupeDto groupe ;
    private UtilisateurDto utilisateur ;
    private EtatUtilisateurDto etatUtilisateur ;
    private RoleUtilisateurDto roleUtilisateur ;



    public GroupeUtilisateurDto(){
        super();
    }



    @Log
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm")
    public String getDateAjout(){
        return this.dateAjout;
    }
    public void setDateAjout(String dateAjout){
        this.dateAjout = dateAjout;
    }


    public GroupeDto getGroupe(){
        return this.groupe;
    }

    public void setGroupe(GroupeDto groupe){
        this.groupe = groupe;
    }
    public UtilisateurDto getUtilisateur(){
        return this.utilisateur;
    }

    public void setUtilisateur(UtilisateurDto utilisateur){
        this.utilisateur = utilisateur;
    }
    public EtatUtilisateurDto getEtatUtilisateur(){
        return this.etatUtilisateur;
    }

    public void setEtatUtilisateur(EtatUtilisateurDto etatUtilisateur){
        this.etatUtilisateur = etatUtilisateur;
    }
    public RoleUtilisateurDto getRoleUtilisateur(){
        return this.roleUtilisateur;
    }

    public void setRoleUtilisateur(RoleUtilisateurDto roleUtilisateur){
        this.roleUtilisateur = roleUtilisateur;
    }






}
