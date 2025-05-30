package ma.sir.ged.service.facade.admin.parapheur;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import ma.sir.ged.DataExtraction.DataExtractionService;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.parapheur.FicheParapheur.ParapheurCertificateData;
import ma.sir.ged.bean.core.parapheur.ParapheurBo;
import ma.sir.ged.dao.facade.core.doc.DocumentDao;
import ma.sir.ged.service.impl.admin.doc.ExcelService;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class DataExtractionProcessor {
    private final DataExtractionService dataExtractionService;
    private final ExcelService excelService;
    private final DocumentDao documentDao;

    public List<ParapheurCertificateData> extractDataFromDocuments(ParapheurBo parapheur, boolean forceRegen) throws JsonProcessingException {
        List<Document> documents = parapheur.getDocuments();
        Optional<Map<String, Map<String, String>>> dataEntriesJson = dataExtractionService.extractCertificateData(documents);
        List<ParapheurCertificateData> extractedData = dataEntriesJson.map(this::mapToDataEntries).orElse(new ArrayList<>());

        List<ParapheurCertificateData> returnedData = new ArrayList<>();
        if (forceRegen) {
            return extractedData;
        } else {
            for (ParapheurCertificateData extractedEntry : extractedData) {
                boolean found = false;
                for (ParapheurCertificateData existingEntry : parapheur.getParapheurCertificateData()) {
                    if (extractedEntry.getDocumentKey().equals(existingEntry.getDocumentKey())) {
                        if (existingEntry.isUpdated()) {
                            returnedData.add(existingEntry);
                        } else {
                            returnedData.add(extractedEntry);
                        }
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    returnedData.add(extractedEntry);
                }
            }
        }

        return returnedData;
    }

    public List<ParapheurCertificateData> extractDataFromDocumentsExcel(List<byte[]> excelFiles) throws Exception {
        List<List<String>> mergedExcelData = excelService.mergeExcelFiles(excelFiles);
        return processExcelData(mergedExcelData);
    }

    private List<ParapheurCertificateData> mapToDataEntries(Map<String, Map<String, String>> dataEntries) {
        return dataEntries.entrySet().stream()
                .map(this::createParapheurCertificateData)
                .collect(Collectors.toList());
    }

    private List<ParapheurCertificateData> processExcelData(List<List<String>> excelData) {
        List<ParapheurCertificateData> certificateDataList = new ArrayList<>();

        if (excelData == null || excelData.isEmpty()) {
            return certificateDataList;
        }

        List<String> headers = excelData.get(0);

        if (headers.isEmpty()) {
            return certificateDataList;
        }

        for (int i = 1; i < excelData.size(); i++) {
            List<String> row = excelData.get(i);
            if (row.size() != headers.size()) {
                continue;
            }

            ParapheurCertificateData certificateData = new ParapheurCertificateData();

            for (int j = 0; j < headers.size(); j++) {
                String header = headers.get(j);
                String value = row.get(j);
                setCertificateDataField(certificateData, header, value);
            }

            certificateDataList.add(certificateData);
        }

        return certificateDataList;
    }

    private void setCertificateDataField(ParapheurCertificateData certificateData, String header, String value) {
        switch (header) {
            case "N° & ANNEE ENRG":
                certificateData.setNumeroDenregistrement(value);
                break;
            case "DESIGNATION":
                certificateData.setDesignation(value);
                break;
            case "CLASSE RISQUE":
                certificateData.setClasseDeRisque(value);
                break;
            case "SOCIETE MAROCAINE":
                certificateData.setEtablissementMarocain(value);
                break;
            case "NOM FABRICANT":
                certificateData.setEtablissementDeFabrication(value);
                break;
            case "NOM MARQUE":
                certificateData.setNomDeMarque(value);
                break;
            case "CODE CE":
                certificateData.setCodeCE(value);
                break;
        }
    }

    private ParapheurCertificateData createParapheurCertificateData(Map.Entry<String, Map<String, String>> documentData) {
        ParapheurCertificateData certificatIndexes = new ParapheurCertificateData();
        String documentKey = documentData.getKey();

        Map<String, String> entryData = documentData.getValue();
        Document document = documentDao.findByReferenceAndDeletedIsFalse(documentKey);

        certificatIndexes.setDocument(document);
        certificatIndexes.setDocumentKey(documentKey);

        certificatIndexes.setDesignation(entryData.get("Désignation du (des) dispositif(s)"));
        certificatIndexes.setCategorie(entryData.get("Catégorie"));
        certificatIndexes.setClasseDeRisque(entryData.get("Classe de risque"));
        certificatIndexes.setCodeCE(entryData.get("Code CE"));
        certificatIndexes.setNomDeMarque(entryData.get("Nom de marque/Nom commercial"));
        certificatIndexes.setEtablissementDeFabrication(entryData.get("Nom et adresse de l'établissement de fabrication"));
        certificatIndexes.setEtablissementMarocain(entryData.get("Nom et adresse de l'établissement marocain"));
        certificatIndexes.setSousTraitant(entryData.get("Nom et adresse du sous-traitant"));
        certificatIndexes.setNumeroDeReference(entryData.get("Numéro(s) de référence(s) ou de série"));
        certificatIndexes.setPresentation(entryData.get("Présentation"));
        certificatIndexes.setNumeroDenregistrement(entryData.get("Numéro d'enregistrement"));
        return certificatIndexes;
    }
}
