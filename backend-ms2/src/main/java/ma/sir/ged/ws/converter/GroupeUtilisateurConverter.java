package  ma.sir.ged.ws.converter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import ma.sir.ged.bean.core.referentielpartage.Groupe;

import ma.sir.ged.zynerator.util.StringUtil;
import ma.sir.ged.zynerator.converter.AbstractConverter;
import ma.sir.ged.zynerator.util.DateUtil;
import ma.sir.ged.bean.history.GroupeUtilisateurHistory;
import ma.sir.ged.bean.core.referentielpartage.GroupeUtilisateur;
import ma.sir.ged.ws.dto.GroupeUtilisateurDto;

@Component
public class GroupeUtilisateurConverter extends AbstractConverter<GroupeUtilisateur, GroupeUtilisateurDto, GroupeUtilisateurHistory> {

    @Autowired
    private RoleUtilisateurConverter roleUtilisateurConverter ;
    @Autowired
    private GroupeConverter groupeConverter ;
    @Autowired
    private UtilisateurConverter utilisateurConverter ;
    @Autowired
    private EtatUtilisateurConverter etatUtilisateurConverter ;
    private boolean groupe;
    private boolean utilisateur;
    private boolean etatUtilisateur;
    private boolean roleUtilisateur;

    public  GroupeUtilisateurConverter(){
        super(GroupeUtilisateur.class, GroupeUtilisateurDto.class, GroupeUtilisateurHistory.class);
    }

    @Override
    public GroupeUtilisateur toItem(GroupeUtilisateurDto dto) {
        if (dto == null) {
            return null;
        } else {
        GroupeUtilisateur item = new GroupeUtilisateur();
            if(StringUtil.isNotEmpty(dto.getId()))
                item.setId(dto.getId());
            if(StringUtil.isNotEmpty(dto.getDateAjout()))
                item.setDateAjout(DateUtil.stringEnToDate(dto.getDateAjout()));
            if(dto.getGroupe() != null && dto.getGroupe().getId() != null){
                item.setGroupe(new Groupe());
                item.getGroupe().setId(dto.getGroupe().getId());
                item.getGroupe().setLibelle(dto.getGroupe().getLibelle());
            }

            if(this.utilisateur && dto.getUtilisateur()!=null &&  dto.getUtilisateur().getId() != null)
                item.setUtilisateur(utilisateurConverter.toItem(dto.getUtilisateur())) ;

            if(this.etatUtilisateur && dto.getEtatUtilisateur()!=null &&  dto.getEtatUtilisateur().getId() != null)
                item.setEtatUtilisateur(etatUtilisateurConverter.toItem(dto.getEtatUtilisateur())) ;

            if(this.roleUtilisateur && dto.getRoleUtilisateur()!=null &&  dto.getRoleUtilisateur().getId() != null)
                item.setRoleUtilisateur(roleUtilisateurConverter.toItem(dto.getRoleUtilisateur())) ;




        return item;
        }
    }

    @Override
    public GroupeUtilisateurDto toDto(GroupeUtilisateur item) {
        if (item == null) {
            return null;
        } else {
            GroupeUtilisateurDto dto = new GroupeUtilisateurDto();
            if(StringUtil.isNotEmpty(item.getId()))
                dto.setId(item.getId());
            if(item.getDateAjout()!=null)
                dto.setDateAjout(DateUtil.dateTimeToString(item.getDateAjout()));
        if(this.groupe && item.getGroupe()!=null) {
            dto.setGroupe(groupeConverter.toDto(item.getGroupe())) ;
        }
        if(this.utilisateur && item.getUtilisateur()!=null) {
            dto.setUtilisateur(utilisateurConverter.toDto(item.getUtilisateur())) ;
        }
        if(this.etatUtilisateur && item.getEtatUtilisateur()!=null) {
            dto.setEtatUtilisateur(etatUtilisateurConverter.toDto(item.getEtatUtilisateur())) ;
        }
        if(this.roleUtilisateur && item.getRoleUtilisateur()!=null) {
            dto.setRoleUtilisateur(roleUtilisateurConverter.toDto(item.getRoleUtilisateur())) ;
        }


        return dto;
        }
    }


    public void initObject(boolean value) {
        this.groupe = value;
        this.utilisateur = value;
        this.etatUtilisateur = value;
        this.roleUtilisateur = value;
    }


    public RoleUtilisateurConverter getRoleUtilisateurConverter(){
        return this.roleUtilisateurConverter;
    }
    public void setRoleUtilisateurConverter(RoleUtilisateurConverter roleUtilisateurConverter ){
        this.roleUtilisateurConverter = roleUtilisateurConverter;
    }
    public GroupeConverter getGroupeConverter(){
        return this.groupeConverter;
    }
    public void setGroupeConverter(GroupeConverter groupeConverter ){
        this.groupeConverter = groupeConverter;
    }
    public UtilisateurConverter getUtilisateurConverter(){
        return this.utilisateurConverter;
    }
    public void setUtilisateurConverter(UtilisateurConverter utilisateurConverter ){
        this.utilisateurConverter = utilisateurConverter;
    }
    public EtatUtilisateurConverter getEtatUtilisateurConverter(){
        return this.etatUtilisateurConverter;
    }
    public void setEtatUtilisateurConverter(EtatUtilisateurConverter etatUtilisateurConverter ){
        this.etatUtilisateurConverter = etatUtilisateurConverter;
    }
    public boolean  isGroupe(){
        return this.groupe;
    }
    public void  setGroupe(boolean groupe){
        this.groupe = groupe;
    }
    public boolean  isUtilisateur(){
        return this.utilisateur;
    }
    public void  setUtilisateur(boolean utilisateur){
        this.utilisateur = utilisateur;
    }
    public boolean  isEtatUtilisateur(){
        return this.etatUtilisateur;
    }
    public void  setEtatUtilisateur(boolean etatUtilisateur){
        this.etatUtilisateur = etatUtilisateur;
    }
    public boolean  isRoleUtilisateur(){
        return this.roleUtilisateur;
    }
    public void  setRoleUtilisateur(boolean roleUtilisateur){
        this.roleUtilisateur = roleUtilisateur;
    }
}
