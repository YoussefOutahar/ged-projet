package ma.sir.ged.ws.converter.BureauOrdre;

import ma.sir.ged.bean.core.bureauOrdre.EtablissementBo;
import ma.sir.ged.bean.core.bureauOrdre.enums.StatutEtablissement;
import ma.sir.ged.ws.dto.BureauOrdre.EtablissementDto;
import org.springframework.stereotype.Component;

@Component
public class EtablissementConverter {
    public EtablissementDto toDto(EtablissementBo etablissement) {
        EtablissementDto dto = new EtablissementDto();
        dto.setId(etablissement.getId());
        dto.setNom(etablissement.getNom());
        dto.setAdresse(etablissement.getAdresse());
        dto.setVille(etablissement.getVille());
        dto.setPays(etablissement.getPays());
        dto.setTelephone(etablissement.getTelephone());
        dto.setGsm(etablissement.getGsm());
        dto.setFax(etablissement.getFax());
        dto.setStatut(etablissement.getStatut().toString());
        dto.setSecteur(etablissement.getSecteur());
        dto.setEmail(etablissement.getEmail());
        dto.setDeleted(etablissement.isDeleted());
        return dto;
    }

    public EtablissementBo toEntity(EtablissementDto dto) {
        EtablissementBo etablissement = new EtablissementBo();
        etablissement.setNom(dto.getNom());
        etablissement.setAdresse(dto.getAdresse());
        etablissement.setVille(dto.getVille());
        etablissement.setPays(dto.getPays());
        etablissement.setTelephone(dto.getTelephone());
        etablissement.setGsm(dto.getGsm());
        etablissement.setFax(dto.getFax());
        etablissement.setStatut(StatutEtablissement.valueOf(dto.getStatut()));
        etablissement.setSecteur(dto.getSecteur());
        etablissement.setEmail(dto.getEmail());
        etablissement.setDeleted(dto.getDeleted());
        return etablissement;
    }
}
