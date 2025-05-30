package ma.sir.ged.service.facade.bo;


import ma.sir.ged.bean.core.bureauOrdre.EtablissementBo;
import ma.sir.ged.bean.core.bureauOrdre.enums.StatutEtablissement;
import ma.sir.ged.dao.facade.core.bureauOrdre.EtablissementRepository;
import ma.sir.ged.service.exception.RessourceNotFoundException;
import ma.sir.ged.ws.converter.BureauOrdre.EtablissementConverter;
import ma.sir.ged.ws.dto.BureauOrdre.EtablissementDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EtablissementService {

    private EtablissementRepository etablissementRepository;
    private EtablissementConverter converter;

    @Autowired
    public EtablissementService(EtablissementRepository etablissementRepository,EtablissementConverter converter) {
        this.etablissementRepository = etablissementRepository;
        this.converter = converter;
    }

    public List<EtablissementDto> getAllEtablissements() {
        return  CollectionUtils.emptyIfNull(etablissementRepository.findAll()).stream().map(converter::toDto).collect(Collectors.toList());
    }
    public List<EtablissementDto> getAllEtablissements_notDeleted() {
        return  CollectionUtils.emptyIfNull(etablissementRepository.findAllByDeleted(false)).stream().map(converter::toDto).collect(Collectors.toList());
    }

    public EtablissementDto getEtablissementById(Long id) {
        EtablissementBo etablissementBo =  etablissementRepository.findById(id).orElseThrow(() -> new RessourceNotFoundException("L'établissement avec l'ID " + id + " n'a pas été trouvé"));
        return converter.toDto(etablissementBo);
    }

    public EtablissementDto getEtablissementByNom(String nom) {
        EtablissementBo etablissementBo =  etablissementRepository.findByNomAndDeleted(nom, false);
        if (etablissementBo != null) {
            return converter.toDto(etablissementBo);
        } else {
            return null;
        }
    }

    public EtablissementBo createEtablissement(EtablissementDto etablissement) {
        return etablissementRepository.save(converter.toEntity(etablissement));
    }

    public EtablissementDto updateEtablissement(Long id, EtablissementDto etablissementDto) {
        EtablissementBo etablissement = etablissementRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("L'établissement avec l'ID " + id + " n'a pas été trouvé."));
        BeanUtils.copyProperties(etablissementDto, etablissement, "id");
        etablissement.setStatut(StatutEtablissement.valueOf(etablissementDto.getStatut()));
        return converter.toDto(etablissementRepository.save(etablissement));
    }

    @Transactional
    public void deleteEtablissement(Long id) {
        EtablissementBo etablissement = etablissementRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("L'établissement avec l'ID " + id + " n'a pas été trouvé."));
        etablissement.setDeleted(true);

    }
}
