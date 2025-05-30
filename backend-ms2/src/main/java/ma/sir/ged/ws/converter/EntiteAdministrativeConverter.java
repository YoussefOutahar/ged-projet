package  ma.sir.ged.ws.converter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ma.sir.ged.zynerator.util.ListUtil;


import ma.sir.ged.zynerator.util.StringUtil;
import ma.sir.ged.zynerator.converter.AbstractConverter;
import ma.sir.ged.bean.history.EntiteAdministrativeHistory;
import ma.sir.ged.bean.core.organigramme.EntiteAdministrative;
import ma.sir.ged.ws.dto.EntiteAdministrativeDto;

@Component
public class EntiteAdministrativeConverter extends AbstractConverter<EntiteAdministrative, EntiteAdministrativeDto, EntiteAdministrativeHistory> {

    @Autowired
    private GenderConverter genderConverter ;
    @Autowired
    private UtilisateurConverter utilisateurConverter ;
    @Autowired
    private EntiteAdministrativeTypeConverter entiteAdministrativeTypeConverter ;
    private boolean entiteAdministrativeParent;
    private boolean chef;
    private boolean entiteAdministrativeType;
    private boolean utilisateurs;

    private static final int MAX_DEPTH = 4;

    public  EntiteAdministrativeConverter(){
        super(EntiteAdministrative.class, EntiteAdministrativeDto.class, EntiteAdministrativeHistory.class);
        init(true);
    }

    @Override
    public EntiteAdministrative toItem(EntiteAdministrativeDto dto) {
        if (dto == null) {
            return null;
        } else {
        EntiteAdministrative item = new EntiteAdministrative();
            if(StringUtil.isNotEmpty(dto.getId()))
                item.setId(dto.getId());
            if(StringUtil.isNotEmpty(dto.getCode()))
                item.setCode(dto.getCode());
            if(StringUtil.isNotEmpty(dto.getReferenceGed()))
                item.setReferenceGed(dto.getReferenceGed());
            if(StringUtil.isNotEmpty(dto.getDescription()))
                item.setDescription(dto.getDescription());
            if(StringUtil.isNotEmpty(dto.getLibelle()))
                item.setLibelle(dto.getLibelle());
            if(StringUtil.isNotEmpty(dto.getArchiveLawDuration()))
                item.setArchiveLawDuration(dto.getArchiveLawDuration());
            if(this.entiteAdministrativeParent && dto.getEntiteAdministrativeParent()!=null)
                item.setEntiteAdministrativeParent(toItem(dto.getEntiteAdministrativeParent())) ;

            if(this.chef && dto.getChef()!=null &&  dto.getChef().getId() != null)
                item.setChef(utilisateurConverter.toItem(dto.getChef())) ;

            if(this.entiteAdministrativeType && dto.getEntiteAdministrativeType()!=null &&  dto.getEntiteAdministrativeType().getId() != null)
                item.setEntiteAdministrativeType(entiteAdministrativeTypeConverter.toItem(dto.getEntiteAdministrativeType())) ;


            if(this.utilisateurs && ListUtil.isNotEmpty(dto.getUtilisateurs()))
                item.setUtilisateurs(utilisateurConverter.toItem(dto.getUtilisateurs()));


        return item;
        }
    }

    @Override
    public EntiteAdministrativeDto toDto(EntiteAdministrative item) {
        return toDto(item, 0);
    }

    public EntiteAdministrativeDto toDto(EntiteAdministrative item, int depth) {
        utilisateurConverter.init(true);
        utilisateurConverter.setEntiteAdministrative(false);
        if (item == null || depth > MAX_DEPTH) {
            return null;
        } else {
            EntiteAdministrativeDto dto = new EntiteAdministrativeDto();
            if(StringUtil.isNotEmpty(item.getId()))
                dto.setId(item.getId());
            if(StringUtil.isNotEmpty(item.getCode()))
                dto.setCode(item.getCode());
            if(StringUtil.isNotEmpty(item.getReferenceGed()))
                dto.setReferenceGed(item.getReferenceGed());
            if(StringUtil.isNotEmpty(item.getDescription()))
                dto.setDescription(item.getDescription());
            if(StringUtil.isNotEmpty(item.getLibelle()))
                dto.setLibelle(item.getLibelle());
            if(StringUtil.isNotEmpty(item.getArchiveLawDuration()))
                dto.setArchiveLawDuration(item.getArchiveLawDuration());
        if(this.entiteAdministrativeParent && item.getEntiteAdministrativeParent()!=null) {
            this.setEntiteAdministrativeParent(false);
            dto.setEntiteAdministrativeParent(toDto(item.getEntiteAdministrativeParent())) ;
            this.setEntiteAdministrativeParent(true);
        }
        if(this.chef && item.getChef()!=null) {
            utilisateurConverter.setEntiteAdministrative(false);
            dto.setChef(utilisateurConverter.toDto(item.getChef(), depth + 1)) ;
            utilisateurConverter.setEntiteAdministrative(true);
        }
        if(this.entiteAdministrativeType && item.getEntiteAdministrativeType()!=null) {
            dto.setEntiteAdministrativeType(entiteAdministrativeTypeConverter.toDto(item.getEntiteAdministrativeType())) ;
        }
        if(this.utilisateurs && ListUtil.isNotEmpty(item.getUtilisateurs())){
            dto.setUtilisateurs(utilisateurConverter.toDto(item.getUtilisateurs()));
        }


        return dto;
        }
    }

    public void initList(boolean value) {
        this.utilisateurs = value;
    }

    public void initObject(boolean value) {
        this.entiteAdministrativeParent = value;
        this.chef = value;
        this.entiteAdministrativeType = value;
    }


    public GenderConverter getGenderConverter(){
        return this.genderConverter;
    }
    public void setGenderConverter(GenderConverter genderConverter ){
        this.genderConverter = genderConverter;
    }
    public UtilisateurConverter getUtilisateurConverter(){
        return this.utilisateurConverter;
    }
    public void setUtilisateurConverter(UtilisateurConverter utilisateurConverter ){
        this.utilisateurConverter = utilisateurConverter;
    }
    public EntiteAdministrativeTypeConverter getEntiteAdministrativeTypeConverter(){
        return this.entiteAdministrativeTypeConverter;
    }
    public void setEntiteAdministrativeTypeConverter(EntiteAdministrativeTypeConverter entiteAdministrativeTypeConverter ){
        this.entiteAdministrativeTypeConverter = entiteAdministrativeTypeConverter;
    }
    public boolean  isEntiteAdministrativeParent(){
        return this.entiteAdministrativeParent;
    }
    public void  setEntiteAdministrativeParent(boolean entiteAdministrativeParent){
        this.entiteAdministrativeParent = entiteAdministrativeParent;
    }
    public boolean  isChef(){
        return this.chef;
    }
    public void  setChef(boolean chef){
        this.chef = chef;
    }
    public boolean  isEntiteAdministrativeType(){
        return this.entiteAdministrativeType;
    }
    public void  setEntiteAdministrativeType(boolean entiteAdministrativeType){
        this.entiteAdministrativeType = entiteAdministrativeType;
    }
    public boolean  isUtilisateurs(){
        return this.utilisateurs ;
    }
    public void  setUtilisateurs(boolean utilisateurs ){
        this.utilisateurs  = utilisateurs ;
    }
}
