package ma.sir.ged.service.impl.admin.doc;

import ma.sir.ged.ws.dto.DocumentDto;
import ma.sir.ged.ws.dto.indexation.DocumentDataDto;
import ma.sir.ged.ws.dto.indexation.IndexationMapper;
import ma.sir.ged.zynerator.exception.BusinessRuleException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static java.util.Objects.isNull;

@Service
public class IndexationService {
    @Autowired
    IndexationMapper mapper;
    @Autowired
    private RestTemplate restTemplate;
    @Value("${elasticUrl.api.url}")
    private String elasticUrl;

    private static final String SEARCH_BY_KEYWORD_EP = "/search-ids?keyword=";
    private static final String SEARCH_INDEX_BY_KEYWORD_EP = "/search-index-ids?keyword=";

    public String createIndexAndGetElasticId(DocumentDto document) {
        try {
            System.out.println(elasticUrl);
            DocumentDataDto documentDataDto = mapper.toDocumentDataDto(document);
            ResponseEntity<DocumentDataDto> responseEntity = restTemplate.postForEntity(elasticUrl, documentDataDto, DocumentDataDto.class);
            if (responseEntity.getStatusCode().is2xxSuccessful()) {
                System.out.println(responseEntity.getBody());
                System.out.println(responseEntity.getBody().getId());
                return responseEntity.getBody().getId();
            }
            return "";
        } catch (HttpClientErrorException exception) {
            System.out.println("Exception has been throw while calling elastic Search" + Arrays.toString(exception.getStackTrace()));
            throw new BusinessRuleException("Exception has been throw while calling elastic Search "+exception.getMessage());
        }catch (HttpServerErrorException exception){
            System.out.println("Exception has been throw while calling elastic Search" + Arrays.toString(exception.getStackTrace()));
            return "";
           // throw new BusinessRuleException("Can not create document "+exception.getMessage());
        }
    }

    public String updateIndexAndGetElasticId(DocumentDto document, String elasticId) {
        try {
            if(StringUtils.isNotBlank(elasticId)){
                DocumentDataDto documentDataDto = mapper.toDocumentDataDto(document);
                HttpEntity<DocumentDataDto> requestEntity = new HttpEntity<>(documentDataDto);
                System.out.println("calling a put request to : "+elasticUrl);
                ResponseEntity<DocumentDataDto> responseEntity = restTemplate.exchange(
                        elasticUrl+"/"+elasticId,
                        HttpMethod.PUT,
                        requestEntity,
                        DocumentDataDto.class);
                if (responseEntity.getStatusCode().is2xxSuccessful()) {
                    System.out.println(responseEntity.getBody());
                    System.out.println(responseEntity.getBody().getId());
                    return responseEntity.getBody().getId();
                }
                return "";
            }
            return "";

        } catch (HttpClientErrorException exception) {
            System.out.println("Exception has been thrown while calling Elastic Search: " + Arrays.toString(exception.getStackTrace()));
            throw new BusinessRuleException("Exception has been throw while calling elastic Search "+exception.getMessage());
        } catch (HttpServerErrorException exception){
            throw new BusinessRuleException("Can not delete document "+exception.getMessage());
        }
    }

    public void deleteIndex(String elasticId) {
        try {
            ResponseEntity<Void> responseEntity = restTemplate.exchange(
                    elasticUrl+"/"+elasticId,
                    HttpMethod.DELETE,
                    null,
                    Void.class);
            if (responseEntity.getStatusCodeValue() == 204) {
                System.out.println("Delete operation has been executed successfully.");
            }
        } catch (HttpClientErrorException exception) {
            System.out.println("An error occurred during the DELETE operation: " + exception.getMessage());
            throw new BusinessRuleException("Exception has been throw while calling elastic Search "+exception.getMessage());
        } catch (HttpServerErrorException exception){
            throw new BusinessRuleException("Can not delete document "+exception.getMessage());
        }
    }

    public List<Long> findDocumentIdsByKeyWord(String keyword){
        if(isNull(keyword) || StringUtils.isBlank(keyword))
            return Collections.emptyList();

        String fullUrl = elasticUrl + SEARCH_BY_KEYWORD_EP + keyword;
        ResponseEntity<List<Long>> response = restTemplate.exchange(
                fullUrl,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<Long>>() {}
        );

        return response.getBody();
    }

    public List<Long> findDocumentIdsByKeyWordIndex(String keyword){
        if(isNull(keyword) || StringUtils.isBlank(keyword))
            return Collections.emptyList();

        String fullUrl = elasticUrl + SEARCH_INDEX_BY_KEYWORD_EP + keyword;
        ResponseEntity<List<Long>> response = restTemplate.exchange(
                fullUrl,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<Long>>() {}
        );

        return response.getBody();
    }
}
