package ma.sir.ged.DataExtraction;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.service.facade.admin.doc.DocumentAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.*;


@Slf4j
@Service
@RequiredArgsConstructor
public class DataExtractionService {
    @Value("${data-extraction.url}")
    private String dataExtractionUrl;

    private final RestTemplate restTemplate;
    private final DocumentAdminService documentAdminService;
    private final ObjectMapper objectMapper;

    public boolean isDataExtractionUp() {
        String url = dataExtractionUrl + "/health";

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, null, String.class);
            return response.getStatusCode() == HttpStatus.OK;
        } catch (RestClientException e) {
            log.error("Error while checking data extraction service health: {}", e.getMessage());
            return false;
        }
    }

    public Optional<Map<String, Map<String, String>>> extractCertificateData(List<Document> documents) throws JsonProcessingException {
        String url = dataExtractionUrl + "/extract-certificate-data";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

        List<Document> successfullyProcessedDocuments = new ArrayList<>();

        for (Document document : documents) {
            try {
                byte[] data = documentAdminService.downloadFileFromService(document.getId(), "");
                body.add("files", new ByteArrayResource(data) {
                    @Override
                    public String getFilename() {
                        return document.getReference();
                    }
                });
                successfullyProcessedDocuments.add(document);
            } catch (Exception e) {
                log.error("Error downloading document with id {}: {}", document.getId(), e.getMessage());
            }
        }

        if (successfullyProcessedDocuments.isEmpty()) {
            log.warn("No documents were successfully processed for certificate data extraction");
            return Optional.empty();
        }

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Map<String, String>> extractedData = objectMapper.readValue(response.getBody(), new TypeReference<Map<String, Map<String, String>>>() {});
                return Optional.of(extractedData);
            } else {
                log.error("Error response from certificate data extraction service: {}", response.getStatusCode());
                return Optional.empty();
            }
        } catch (RestClientException e) {
            log.error("Error while calling certificate data extraction service: {}", e.getMessage());
            return Optional.empty();
        }
    }
}
