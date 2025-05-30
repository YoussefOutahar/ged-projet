package ma.sir.ged.service.facade.bo.CourrielCreationServices;

import ma.sir.ged.bean.core.bureauOrdre.CourrielBo;
import ma.sir.ged.bean.core.bureauOrdre.IntervenantsCourriel;
import ma.sir.ged.bean.core.bureauOrdre.Registre;
import ma.sir.ged.bean.core.bureauOrdre.enums.HistoryEntryType;
import ma.sir.ged.bean.core.bureauOrdre.enums.TypeCourriel;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.referentieldoc.DocumentIndexElement;
import ma.sir.ged.dao.facade.core.bureauOrdre.RegistreRepository;
import ma.sir.ged.dao.facade.core.doc.DocumentDao;
import ma.sir.ged.service.facade.admin.referentieldoc.DocumentIndexElementAdminService;
import ma.sir.ged.service.facade.bo.CourrielHistoryService;
import ma.sir.ged.service.facade.bo.IntervenantsCourrielService;
import ma.sir.ged.service.impl.admin.doc.DocumentAdminServiceImpl;
import ma.sir.ged.ws.converter.DocumentConverter;
import ma.sir.ged.ws.dto.DocumentDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityManager;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CourrielCreationUtils {
    @Autowired
    protected DocumentDao documentDao;

    @Autowired
    protected EntityManager entityManager;

    @Autowired
    protected RegistreRepository registreRepository;

    @Autowired
    protected CourrielHistoryService courrielHistoryService;

    @Autowired
    private DocumentAdminServiceImpl documentService;

    @Autowired
    private DocumentIndexElementAdminService indexElementAdminService;

    @Autowired
    private IntervenantsCourrielService intervenantsCourrielService;

    public void uploadCourrielDocs(List<MultipartFile> files, List<Document> documents, CourrielBo courriel) {
        List<Document> courrielDocuments = new ArrayList<>();
        try {
            for (int index = 0; index < documents.size(); index++) {
                MultipartFile file = files.get(index);
                String fileName = file.getOriginalFilename();
                if (!"application/pdf".equals(file.getContentType())) {
                    continue; // Ignore non-PDF files and move on to the next iteration
                }
                assert fileName != null;
                documents.get(index).setReference(generateDocumentReference(fileName,courriel));
                Document myT = documents.get(index);
                documentService.uploadToMinio(myT, file);
                myT.setCourriel(courriel);
                courrielDocuments.add(myT);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        courriel.setDocuments(courrielDocuments);
    }

    public void handleDocsCourriel(CourrielBo courrielBo) {
        List<Document> documents = courrielBo.getDocuments().stream()
                .map(document -> {
                    Document doc;
                    if (document.getId() == null) {
                        doc = documentDao.save(document);
                    } else {
                        doc = documentDao.findById(document.getId()).orElseGet(() -> documentDao.save(document));
                    }
                    doc.setCourriel(courrielBo);

                    if (doc.getDocumentIndexElements() != null) {
                        for (DocumentIndexElement index : doc.getDocumentIndexElements()) {
                            DocumentIndexElement documentIndexElement = new DocumentIndexElement();
                            documentIndexElement.setDocument(doc);
                            documentIndexElement.setIndexElement(index.getIndexElement());
                            documentIndexElement.setValue(index.getValue());
                            indexElementAdminService.create(documentIndexElement);
                        }
                    }
                    return doc;
                })
                .collect(Collectors.toList());
        courrielBo.setDocuments(documents);
    }

    public void handleExistingCourrielDocs(CourrielBo courrielBo) {
        List<Document> documents = courrielBo.getDocuments().stream()
                .map(document -> documentDao.findById(document.getId()).orElseGet(() -> documentDao.save(document)))
                .collect(Collectors.toList());
        for (Document document : documents) {
            document = entityManager.merge(document);
        }
        courrielBo.setDocuments(documents);
        for (Document document : documents) {
            document.setCourriel(courrielBo);
        }
    }

    public void handleNumeroCourriel(CourrielBo courrielBo) {
        //handle numero de courrier
        if(Objects.isNull(courrielBo.getNumeroCourrier())|| courrielBo.getNumeroCourrier().isEmpty()){
            if (Objects.nonNull(courrielBo.getNumeroRegistre())) {
                Registre registre = registreRepository.findByNumero(courrielBo.getNumeroRegistre());
                String courrierType = "";
                if(TypeCourriel.ENTRANT.equals(courrielBo.getType())){
                    courrierType = "AR-";
                }else if(courrielBo.getType().equals(TypeCourriel.SORTANT)){
                    courrierType = "DP-";
                }
                if(Objects.nonNull(registre)){
                    registre.setSize(registre.getSize()+1);
                    courrielBo.setNumeroCourrier(courrierType + registre.getSize() + '-' + courrielBo.getNumeroRegistre());
                }
            }
        }

    }

    public void handleCourrielIntervenants(CourrielBo courrielBo) {
        List<IntervenantsCourriel> intervenats = new ArrayList<>();
        if(courrielBo.getIntervenants() != null) {
            courrielBo.getIntervenants().forEach(intervenantsCourriel -> {
                intervenantsCourriel.setCourrielBo(courrielBo);
                intervenantsCourriel.setDateCreation(LocalDateTime.now());
                intervenats.add(intervenantsCourriel);
            });
        }
        courrielBo.setIntervenants(intervenats);

        entityManager.persist(courrielBo);
        if(!intervenats.isEmpty()) {
            intervenantsCourrielService.handleSignerAnnotation(intervenats.get(intervenats.size() - 1), courrielBo);
        }
    }

    public void handleCourrielHistory(CourrielBo courriel, CourrielBo courrielPere,String msg,String msgPere) {
        if (Objects.nonNull(courrielPere)) {
            courrielHistoryService.registerHistoryEntry(courrielPere,msgPere, HistoryEntryType.MODIFICATION);
        }
        courrielHistoryService.registerHistoryEntry(courriel,msg, HistoryEntryType.CREATION);
        if (Objects.nonNull(courriel.getIntervenants())) {
            courriel.getIntervenants().forEach(intervenantsCourriel -> {
                courrielHistoryService.registerIntervenantHistoryEntry(courriel,intervenantsCourriel, HistoryEntryType.INTERVENTION);
            });
        }
    }

    public String generateDocumentReference(String fileName,CourrielBo courriel){
        String formattedName = fileName.toLowerCase().replaceAll(" ", "-");
        String prefix = "";

        if (TypeCourriel.SORTANT.equals(courriel.getType())) {
            prefix = "PROJET-REPONSE-";
        } else if (TypeCourriel.ENTRANT.equals(courriel.getType())) {
            prefix = "PROJET-RECEPTION-";
        }

        String fin = UUID.randomUUID().toString();

        return prefix + formattedName + "-" + fin;
    }

}
