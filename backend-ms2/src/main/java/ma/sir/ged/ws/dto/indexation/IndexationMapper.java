package ma.sir.ged.ws.dto.indexation;

import ma.sir.ged.ws.dto.DocumentCategorieDto;
import ma.sir.ged.ws.dto.DocumentCategorieIndexDto;
import ma.sir.ged.ws.dto.DocumentDto;
import ma.sir.ged.ws.dto.DocumentIndexElementDto;
import ma.sir.ged.ws.dto.DocumentStateDto;
import ma.sir.ged.ws.dto.DocumentTypeDto;
import ma.sir.ged.ws.dto.EntiteAdministrativeDto;
import ma.sir.ged.ws.dto.IndexElementDto;
import ma.sir.ged.ws.dto.UtilisateurDto;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static java.util.Objects.nonNull;

@Component
public class IndexationMapper {
    public DocumentDataDto toDocumentDataDto(DocumentDto document){
        DocumentDataDto index = new DocumentDataDto();
        //index.setId(elasticId);
        index.setOriginalId(document.getId());
        index.setReference(document.getReference());
        index.setReferenceGed(document.getReferenceGed());
        index.setUploadDate(extractDate(document.getUploadDate()));
        index.setAnnee(toInt(document.getAnnee()));
        index.setSemestre(toInt(document.getSemstre()));
        index.setMois(toInt(document.getMois()));
        index.setJour(toInt(document.getJour()));
        index.setOcr(document.getOcr());
        index.setContent(document.getContent());
        index.setSize(document.getSize());
        index.setDescription(document.getDescription());
        index.setArchive(document.getArchive());
        index.setVersionne(document.getVersionne());
        index.setDocumentType(toDocumentTypeIndex(document.getDocumentType()));
        index.setDocumentState(toDocumentStateIndex(document.getDocumentState()));
        index.setDocumentCategorie(toDocumentCategorieIndex(document.getDocumentCategorie()));
        index.setUtilisateur(toUtilisateurIndex(document.getUtilisateur()));
        index.setEntiteAdministrative(toEntiteAdministrativeIndex(document.getEntiteAdministrative()));
        index.setDocumentIndexElements(toListDocumentIndexElementIndex(document.getDocumentIndexElements()));
        return index;
    }

    private static Date extractDate(String date){
        String format = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"; // ISO 8601 format
        SimpleDateFormat formatter = new SimpleDateFormat(format);
        try {
            return nonNull(date)? formatter.parse(date) : null;
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }
    }

    private static Integer toInt(Long number) {
        if(Objects.isNull(number))
            return 0;
        return Math.toIntExact(number);
    }

    private static DocumentTypeIndex toDocumentTypeIndex(DocumentTypeDto typeDto){
        DocumentTypeIndex index = new DocumentTypeIndex();
        if(nonNull(typeDto)){
            index.setCode(typeDto.getCode());
            index.setLibelle(typeDto.getLibelle());
        }
        return index;
    }
    private  static DocumentStateIndex toDocumentStateIndex(DocumentStateDto dto){
        DocumentStateIndex index = new DocumentStateIndex();
        if(nonNull(dto)){
            index.setCode(dto.getCode());
            index.setLibelle(dto.getLibelle());
            index.setStyle(dto.getStyle());
        }
        return index;
    }
    private  static DocumentCategorieIndex toDocumentCategorieIndex(DocumentCategorieDto dto){
        DocumentCategorieIndex index = new DocumentCategorieIndex();
        if(nonNull(dto)){
            index.setCode(dto.getCode());
            index.setLibelle(dto.getLibelle());
            if(nonNull(dto.getDocumentCategorieIndexs())){
                List<DocumentCategorieIndexIndex> documentCategorieIndexIndices = dto.getDocumentCategorieIndexs().stream()
                        .map(IndexationMapper::toDocumentCategorieIndex)
                        .collect(Collectors.toList());
                index.setDocumentCategorieIndexs(documentCategorieIndexIndices);
            }
        }
        return index;
    }

    private  static  DocumentCategorieIndexIndex toDocumentCategorieIndex(DocumentCategorieIndexDto dto){
        DocumentCategorieIndexIndex index = new DocumentCategorieIndexIndex();
        if(nonNull(dto) && nonNull(dto.getIndexElement())){
            index.setIndexElement(toIndexElementIndex(dto.getIndexElement()));
        }
        return index;
    }

    private  static  IndexElementIndex toIndexElementIndex(IndexElementDto dto){
        IndexElementIndex index = new IndexElementIndex();
        if(nonNull(dto)){
            index.setCode(dto.getCode());
            index.setLibelle(dto.getLibelle());
        }
        return index;
    }

    private  static  EntiteAdministrativeIndex toEntiteAdministrativeIndex(EntiteAdministrativeDto dto){
        EntiteAdministrativeIndex index = new EntiteAdministrativeIndex();
        if(nonNull(dto)){
            index.setCode(dto.getCode());
            index.setLibelle(dto.getLibelle());
        }
        return index;
    }

    private static UtilisateurIndex toUtilisateurIndex(UtilisateurDto dto){
        UtilisateurIndex index = new UtilisateurIndex();
        if(nonNull(dto)){
            index.setEmail(dto.getEmail());
            index.setTelephone(dto.getTelephone());
            index.setNom(dto.getNom());
            index.setPrenom(dto.getPrenom());
            index.setDateNaissance(extractDate(dto.getDateNaissance()));
            index.setUsername(dto.getUsername());
        }
        return index;
    }

    private static DocumentIndexElementIndex toDocumentIndexElementIndex(DocumentIndexElementDto dto){
        DocumentIndexElementIndex index = new DocumentIndexElementIndex();
        if(nonNull(dto)){
            index.setValue(dto.getValue());
            index.setDescription(dto.getDescription());
            index.setIndexElement(toIndexElementIndex(dto.getIndexElement()));
        }
        return index;
    }

    private static List<DocumentIndexElementIndex> toListDocumentIndexElementIndex(List<DocumentIndexElementDto> dto){
        if(CollectionUtils.isEmpty(dto))
            return Collections.emptyList();
        return dto.stream().map(IndexationMapper::toDocumentIndexElementIndex).collect(Collectors.toList());
    }

}
