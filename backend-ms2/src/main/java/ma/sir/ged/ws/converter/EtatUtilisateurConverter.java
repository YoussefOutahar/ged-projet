package  ma.sir.ged.ws.converter;

import org.springframework.stereotype.Component;


import ma.sir.ged.zynerator.util.StringUtil;
import ma.sir.ged.zynerator.converter.AbstractConverter;
import ma.sir.ged.bean.history.EtatUtilisateurHistory;
import ma.sir.ged.bean.core.referentielpartage.EtatUtilisateur;
import ma.sir.ged.ws.dto.EtatUtilisateurDto;

@Component
public class EtatUtilisateurConverter extends AbstractConverter<EtatUtilisateur, EtatUtilisateurDto, EtatUtilisateurHistory> {


    public  EtatUtilisateurConverter(){
        super(EtatUtilisateur.class, EtatUtilisateurDto.class, EtatUtilisateurHistory.class);
    }

    @Override
    public EtatUtilisateur toItem(EtatUtilisateurDto dto) {
        if (dto == null) {
            return null;
        } else {
        EtatUtilisateur item = new EtatUtilisateur();
            if(StringUtil.isNotEmpty(dto.getId()))
                item.setId(dto.getId());
            if(StringUtil.isNotEmpty(dto.getCode()))
                item.setCode(dto.getCode());
            if(StringUtil.isNotEmpty(dto.getLibelle()))
                item.setLibelle(dto.getLibelle());
            if(StringUtil.isNotEmpty(dto.getDescription()))
                item.setDescription(dto.getDescription());



        return item;
        }
    }

    @Override
    public EtatUtilisateurDto toDto(EtatUtilisateur item) {
        if (item == null) {
            return null;
        } else {
            EtatUtilisateurDto dto = new EtatUtilisateurDto();
            if(StringUtil.isNotEmpty(item.getId()))
                dto.setId(item.getId());
            if(StringUtil.isNotEmpty(item.getCode()))
                dto.setCode(item.getCode());
            if(StringUtil.isNotEmpty(item.getLibelle()))
                dto.setLibelle(item.getLibelle());
            if(StringUtil.isNotEmpty(item.getDescription()))
                dto.setDescription(item.getDescription());


        return dto;
        }
    }


    public void initObject(boolean value) {
    }


}
