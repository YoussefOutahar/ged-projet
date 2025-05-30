package ma.sir.ged.ws.converter.parapheur;

import ma.sir.ged.bean.core.parapheur.FicheParapheur.ParapheurCertificateData;
import ma.sir.ged.bean.core.parapheur.FicheParapheur.ParapheurSignersData;
import ma.sir.ged.dao.facade.core.doc.DocumentDao;
import ma.sir.ged.dao.facade.core.organigramme.UtilisateurDao;
import ma.sir.ged.ws.converter.UtilisateurConverter;
import ma.sir.ged.ws.facade.admin.parapheur.Requests.ParapheurCertificateDataDTO;
import ma.sir.ged.ws.facade.admin.parapheur.Requests.ParapheurSignersDataDTO;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class DTOConverter {

    private final ModelMapper modelMapper;
    private final UtilisateurDao utilisateurDao;
    private final DocumentDao documentDao;

    public DTOConverter(UtilisateurDao utilisateurDao, DocumentDao documentDao) {
        this.modelMapper = new ModelMapper();
        this.modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        this.utilisateurDao = utilisateurDao;
        this.documentDao = documentDao;
    }

    public ParapheurCertificateDataDTO convertToDTO(ParapheurCertificateData entity) {
        ParapheurCertificateDataDTO dto = modelMapper.map(entity, ParapheurCertificateDataDTO.class);
        if (entity.getDocument() != null) {
            dto.setDocumentReference(entity.getDocument().getReference());
        }
        return dto;
    }

    public ParapheurCertificateData convertToEntity(ParapheurCertificateDataDTO dto) {
        ParapheurCertificateData entity = modelMapper.map(dto, ParapheurCertificateData.class);
        if (dto.getDocumentReference() != null) {
            entity.setDocument(documentDao.findByReferenceAndDeletedIsFalse(dto.getDocumentReference()));
        }
        return entity;
    }

    public ParapheurSignersDataDTO convertToDTO(ParapheurSignersData entity) {
        ParapheurSignersDataDTO dto = modelMapper.map(entity, ParapheurSignersDataDTO.class);
        if (entity.getUser() != null) {
            dto.setUserId(entity.getUser().getId());
        }
        return dto;
    }

    public ParapheurSignersData convertToEntity(ParapheurSignersDataDTO dto) {
        ParapheurSignersData entity = modelMapper.map(dto, ParapheurSignersData.class);
        if (dto.getUserId() != null) {
            entity.setUser(utilisateurDao.findById(dto.getUserId()).orElse(null));
        }
        return entity;
    }

    public List<ParapheurCertificateDataDTO> convertToDTOList(List<ParapheurCertificateData> entities) {
        return entities.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ParapheurSignersDataDTO> convertToSignersDTOList(List<ParapheurSignersData> entities) {
        return entities.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}
