package  ma.sir.ged.dao.criteria.core;


import ma.sir.ged.zynerator.criteria.BaseCriteria;
import java.util.List;
import java.time.LocalDateTime;
import java.time.LocalDate;

public class GroupeUtilisateurCriteria extends  BaseCriteria  {

    private LocalDateTime dateAjout;
    private LocalDateTime dateAjoutFrom;
    private LocalDateTime dateAjoutTo;

    private GroupeCriteria groupe ;
    private List<GroupeCriteria> groupes ;
    private UtilisateurCriteria utilisateur ;
    private List<UtilisateurCriteria> utilisateurs ;
    private EtatUtilisateurCriteria etatUtilisateur ;
    private List<EtatUtilisateurCriteria> etatUtilisateurs ;
    private RoleUtilisateurCriteria roleUtilisateur ;
    private List<RoleUtilisateurCriteria> roleUtilisateurs ;


    public GroupeUtilisateurCriteria(){}

    public LocalDateTime getDateAjout(){
        return this.dateAjout;
    }
    public void setDateAjout(LocalDateTime dateAjout){
        this.dateAjout = dateAjout;
    }
    public LocalDateTime getDateAjoutFrom(){
        return this.dateAjoutFrom;
    }
    public void setDateAjoutFrom(LocalDateTime dateAjoutFrom){
        this.dateAjoutFrom = dateAjoutFrom;
    }
    public LocalDateTime getDateAjoutTo(){
        return this.dateAjoutTo;
    }
    public void setDateAjoutTo(LocalDateTime dateAjoutTo){
        this.dateAjoutTo = dateAjoutTo;
    }

    public GroupeCriteria getGroupe(){
        return this.groupe;
    }

    public void setGroupe(GroupeCriteria groupe){
        this.groupe = groupe;
    }
    public List<GroupeCriteria> getGroupes(){
        return this.groupes;
    }

    public void setGroupes(List<GroupeCriteria> groupes){
        this.groupes = groupes;
    }
    public UtilisateurCriteria getUtilisateur(){
        return this.utilisateur;
    }

    public void setUtilisateur(UtilisateurCriteria utilisateur){
        this.utilisateur = utilisateur;
    }
    public List<UtilisateurCriteria> getUtilisateurs(){
        return this.utilisateurs;
    }

    public void setUtilisateurs(List<UtilisateurCriteria> utilisateurs){
        this.utilisateurs = utilisateurs;
    }
    public EtatUtilisateurCriteria getEtatUtilisateur(){
        return this.etatUtilisateur;
    }

    public void setEtatUtilisateur(EtatUtilisateurCriteria etatUtilisateur){
        this.etatUtilisateur = etatUtilisateur;
    }
    public List<EtatUtilisateurCriteria> getEtatUtilisateurs(){
        return this.etatUtilisateurs;
    }

    public void setEtatUtilisateurs(List<EtatUtilisateurCriteria> etatUtilisateurs){
        this.etatUtilisateurs = etatUtilisateurs;
    }
    public RoleUtilisateurCriteria getRoleUtilisateur(){
        return this.roleUtilisateur;
    }

    public void setRoleUtilisateur(RoleUtilisateurCriteria roleUtilisateur){
        this.roleUtilisateur = roleUtilisateur;
    }
    public List<RoleUtilisateurCriteria> getRoleUtilisateurs(){
        return this.roleUtilisateurs;
    }

    public void setRoleUtilisateurs(List<RoleUtilisateurCriteria> roleUtilisateurs){
        this.roleUtilisateurs = roleUtilisateurs;
    }
}
