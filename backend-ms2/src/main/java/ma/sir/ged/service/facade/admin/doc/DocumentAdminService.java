package ma.sir.ged.service.facade.admin.doc;

import com.fasterxml.jackson.core.JsonProcessingException;
import ma.sir.ged.bean.core.doc.ArchiveFinal;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.doc.Echantillon;
import ma.sir.ged.dao.criteria.core.DocumentCriteria;
import ma.sir.ged.dao.criteria.history.DocumentHistoryCriteria;
import ma.sir.ged.ws.dto.DocumentDto;
import ma.sir.ged.ws.dto.EchantillonDto;
import ma.sir.ged.ws.dto.summary.DocumentSummaryDto;
import ma.sir.ged.zynerator.service.IService;
import ma.sir.ged.zynerator.util.PaginatedList;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;


public interface DocumentAdminService extends  IService<Document,DocumentCriteria, DocumentHistoryCriteria>  {

    List<Document> findByDocumentTypeId(Long id);
    byte[] convertWordToPdf(InputStream inputStream) throws IOException;

    boolean restoreById(Long id);
    List<DocumentDto> deleteFinal(List<DocumentDto> listToDelete);
    List<DocumentDto> archiveAssociatedDocument(List<DocumentDto> listToArchive);
    List<DocumentDto> desarchiveAssociatedDocument(List<DocumentDto> listToArchive);
    DocumentSummaryDto findByReference(String ref);
    int deleteByDocumentTypeId(Long id);
    long countByDocumentTypeId(Long id);
    List<Document> findByDocumentStateId(Long id);
    int deleteByDocumentStateId(Long id);
    int countByDocumentStateId(Long id);
    List<Document> findByDocumentCategorieId(Long id);
    int deleteByDocumentCategorieId(Long id);
    long countByDocumentCategorieId(Long id);
    List<Document> findByUtilisateurId(Long id);
    int deleteByUtilisateurId(Long id);
    long countByUtilisateurId(Long id);
    List<Document> findByEntiteAdministrativeId(Long id);
    List<DocumentDto> findByPlanClassementId(Long id);
    int deleteByEntiteAdministrativeId(Long id);
    long countByEntiteAdministrativeId(Long id);
    List<Document> findByDocumentCategorieModelId(Long id);
    int deleteByDocumentCategorieModelId(Long id);
    long countByDocumentCategorieModelId(Long id);
    DocumentDto saveDocument(MultipartFile file, String dto) throws Exception;
    Long saveDocumentSummary(MultipartFile file, String dto) throws Exception;
    DocumentDto createDocumentWithFile(MultipartFile file, DocumentDto documentDto, Document referencedDocument, boolean withIndex) throws Exception;
    DocumentDto updateDocumentFile(MultipartFile file, DocumentDto documentDto) throws Exception;
    Document create(Document t, MultipartFile file);

    Document create(Document t, byte[] bytes);

    byte[] downloadFileFromService(Long id, String versionId);
    String previewFileFromService(Long id, String versionId);

    List<Document> findAllByKeyWord(String keyword);
    List<Document> findAllDocuments();

    List<Document> getDocumentsToArchive();
    List<Document> getDocumentsArchivee();
    List<ArchiveFinal> getDocumentsArchivesFinalement();

    List<Document> getDocumentsToArchiveFinale();

    List<Document> getDocumentsToDestruction();


    List<Document> findPaginatedByKeyWord(String keyword, DocumentCriteria criteria);
    List<Document> findPaginatedByKeyWordIndex(String keyword, DocumentCriteria criteria);
    PaginatedList findPaginatedByYear(Integer year, DocumentCriteria criteria);

    PaginatedList findPaginatedByCriteriaDeleted(DocumentCriteria criteria, int page, int pageSize, String order, String sortField);
    int getDataSizeDataDeleted(DocumentCriteria criteria);
    List<Document> updateQualityFlag(DocumentCriteria criteria, int page, int pageSize, String order, String sortField, Long percent);
    int getDataSizeDataQuality(DocumentCriteria criteria);
    DocumentDto updateQualityStatusById(Long id);
    DocumentDto rejectQualityStatusById(Long id);
    DocumentDto lockDocumentById(Long id);
    DocumentDto unlockDocumentById(Long id);
    String extractTextFromPDF(MultipartFile multipartFile);
    String extractTextFromDocument(MultipartFile file, String language);
    EchantillonDto createEchantillon(List<DocumentDto> documents, String nomEchantillon);
    List<Echantillon> getAllEchantillons();
    List<Integer> findDistinctYears();
    int findPaginatedByYearSize(Integer year);
     List<ArchiveFinal> moveToArchiveFinal(List<DocumentDto> dtos);
     String viewArchiveFileFromMinio(Long id, String versionId);
    DocumentDto saveMergedFiles( MultipartFile file, String dtos)throws Exception;
    List<DocumentDto> saveSplitedDocument(List<MultipartFile> files,String dto) throws JsonProcessingException ;
    PaginatedList findPaginatedListByCriteria(DocumentCriteria criteria, int page, int pageSize, String order, String sortField);
    PaginatedList findPaginatedArchiveListByCriteria(DocumentCriteria criteria, int page, int pageSize, String order, String sortField);
    PaginatedList findPaginatedListByListCriteria(List<DocumentCriteria> criteriaList, int page, int pageSize, String order, String sortField) ;

    EchantillonDto validateLotEchantillon(Long id);
    EchantillonDto addEchantillonNote(Long id,String note);
    void deleteFinalEchantillon(Long id);
    List<Map<String, Object>> getDistinctYear() ;
    ResponseEntity<Void> addInfoArchivePhysiqueFinal(List<ArchiveFinal> archiveFinalDto, Long line, Long colonne, Long boite);
    List<Document> archivageIntermidiareAutomatique();

    List<ArchiveFinal> archivageFinaleAutomatique();
    Document setStatusDocument(Long idDoc , String status);

/*
    List<Document> checkDocumentsApproachingIntermidiaireArchivage();
*/
    List<DocumentDto> findByReferencePattern(String reference);
    Long handleChunkUpload(MultipartFile fileChunk, int chunkIndex, int totalChunks, String dto, boolean withVersioning);

    List<Document> findByNumeroEnregistrement(String numero);
    Document findBySignatureValidationCode(String code);
}
