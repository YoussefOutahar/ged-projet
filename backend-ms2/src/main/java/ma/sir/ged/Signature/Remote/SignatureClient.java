package ma.sir.ged.Signature.Remote;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itextpdf.text.pdf.AcroFields;
import com.itextpdf.text.pdf.PdfReader;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.sir.ged.Signature.Remote.Models.SignRequestParams;
import ma.sir.ged.Signature.Remote.Models.SignatureInfoRemote;
import ma.sir.ged.Signature.Remote.Models.SignatureUserDto;
import ma.sir.ged.Signature.Remote.Models.SignedDocumentResponse;
import ma.sir.ged.workflow.DTO.UserKeystoreDto;
import org.apache.coyote.BadRequestException;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.interactive.digitalsignature.PDSignature;
import org.apache.xalan.xsltc.compiler.util.InternalError;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SignatureClient {
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${app.signature.url}")
    private String signatureServiceUrl;

    public UserKeystoreDto addCertificate(MultipartFile keystore, Set<String> roleNames, String password) throws IOException {
        String url = signatureServiceUrl + "/api/admin/certificats";

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("keystore", new ByteArrayResource(keystore.getBytes()) {
            @Override
            public String getFilename() {
                return keystore.getOriginalFilename();
            }
        });
        body.add("roleNames", String.join(",", roleNames));
        body.add("password", password);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<UserKeystoreDto> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                UserKeystoreDto.class
        );
        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            return response.getBody();
        }
        throw new RuntimeException("Failed to upload certificate. Status: " + response.getStatusCode());
    }

    public SignatureUserDto createUser(SignatureUserDto userDto) {
        String url = signatureServiceUrl + "/api/users";

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("gedIdentifier", userDto.getGedIdentifier());
        body.add("firstName", userDto.getFirstName());
        body.add("lastName", userDto.getLastName());
        body.add("phone", userDto.getPhone());
        body.add("email", userDto.getEmail());
        body.add("userType", userDto.getUserType());
        body.add("civilityTitle", userDto.getCivilityTitle());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<SignatureUserDto> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                SignatureUserDto.class
        );
        return response.getBody();
    }

    public SignatureUserDto updateUser(SignatureUserDto userDto) {
        String url = signatureServiceUrl + "/api/users";

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("gedIdentifier", userDto.getGedIdentifier());
        body.add("signImageBase64", userDto.getSignImageBase64());
        body.add("certificateId", userDto.getCertificateId());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<SignatureUserDto> response = restTemplate.exchange(
                url,
                HttpMethod.PUT,
                requestEntity,
                SignatureUserDto.class
        );
        return response.getBody();
    }

    public SignedDocumentResponse signDocument(
            MultipartFile document,
            String gedIdentifier,
            String password,
            String extraText,
            String qrCodeUrl
    ) throws IOException {
        String url = signatureServiceUrl + "/api/admin/sign";

        SignRequestParams signRequestParams = SignRequestParams.getDefaultParams();
        signRequestParams.setExtraText(extraText);
        signRequestParams.setQrCodeUrl(qrCodeUrl);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("document", new ByteArrayResource(document.getBytes()) {
            @Override
            public String getFilename() {
                return document.getOriginalFilename();
            }
        });
        body.add("gedIdentifier", gedIdentifier);
        body.add("password", password);
        body.add("signRequestParamsJsonString", objectMapper.writeValueAsString(signRequestParams));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<SignedDocumentResponse> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                SignedDocumentResponse.class
        );

        return response.getBody();
    }

    public byte[] downloadDocument(String documentId) {
        String url = signatureServiceUrl + "/api/admin/document/download/" + documentId;

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(java.util.Collections.singletonList(MediaType.APPLICATION_OCTET_STREAM));

        HttpEntity<?> requestEntity = new HttpEntity<>(headers);


        ResponseEntity<byte[]> response = restTemplate.exchange(url, HttpMethod.GET, requestEntity, byte[].class);
        return response.getBody();
    }

    public List<SignatureInfoRemote> getSignatureInfoRemote(byte[] pdfBytes) {
        try {
            PdfReader reader = new PdfReader(new ByteArrayInputStream(pdfBytes));
            AcroFields acroFields = reader.getAcroFields();
            ArrayList<String> names = acroFields.getSignatureNames();

            PDDocument document = PDDocument.load(new ByteArrayInputStream(pdfBytes));

            List<SignatureInfoRemote> signatureInfo = new ArrayList<>();

            for (PDSignature pdSignature : document.getSignatureDictionaries()) {
                if (pdSignature != null) {
                    SignatureInfoRemote remote = SignatureInfoRemote.fromPDSignature(pdSignature, null, null);
                    signatureInfo.add(remote);
                }
            }


            if (names.isEmpty()) {
                log.info("No signatures found in the document");
                return null;
            }

            reader.close();
            return signatureInfo;

        } catch (Exception e) {
            log.error("Error validating PDF signature: {}", e.getMessage(), e);
            return null;
        }
    }

    public SignatureUserDto getCertifByUser(String gedIdentifier) {
        String url = signatureServiceUrl + "/api/users?gedIdentifier=" + gedIdentifier;


        ResponseEntity<SignatureUserDto> response = restTemplate.getForEntity(url, SignatureUserDto.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            return response.getBody();
        } else {
            return null;
        }
    }

    public UserKeystoreDto getCertificate(String certifId) {
        String url = signatureServiceUrl + "/admin/certificats/" + certifId;

        ResponseEntity<UserKeystoreDto> response = restTemplate.getForEntity(url, UserKeystoreDto.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            return response.getBody();
        } else {
            return null;
        }
    }


    public Page<SignatureUserDto> getUsersByKeystoreId(int page, int size, long keystoreId) {
        String url = signatureServiceUrl + "/api/users/get-by-keystore-id?keystoreId=" + keystoreId + "&page=" + page + "&size=" + size;

        ParameterizedTypeReference<Map<String, Object>> responseType =
                new ParameterizedTypeReference<Map<String, Object>>() {
                };

        ResponseEntity<Map<String, Object>> response =
                restTemplate.exchange(url, HttpMethod.GET, null, responseType);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            // Get the content as a list of Maps
            List<Map<String, Object>> contentMaps = (List<Map<String, Object>>) response.getBody().get("content");

            // Convert maps to SignatureUserDto objects
            List<SignatureUserDto> content = contentMaps.stream()
                    .map(this::convertToSignatureUserDto)
                    .collect(Collectors.toList());

            long totalElements = ((Number) response.getBody().get("totalElements")).longValue();

            return new PageImpl<>(content, PageRequest.of(page, size), totalElements);
        } else {
            return Page.empty();
        }
    }

    // Helper method to convert Map to SignatureUserDto
    private SignatureUserDto convertToSignatureUserDto(Map<String, Object> map) {
        ObjectMapper objectMapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        return objectMapper.convertValue(map, SignatureUserDto.class);
    }

    public UserKeystoreDto updateUserCertificat(String gedIdentifier, String keystoreId) throws BadRequestException {
        String url = UriComponentsBuilder.fromHttpUrl(signatureServiceUrl)
                .path("/api/users/update-user-certificate")
                .queryParam("getIdentifier", gedIdentifier)
                .queryParam("certificateId", keystoreId)
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<?> requestEntity = new HttpEntity<>(headers);

        ResponseEntity<UserKeystoreDto> response = restTemplate.exchange(
                url,
                HttpMethod.PUT,
                requestEntity,
                UserKeystoreDto.class
        );

        if (response.getStatusCode() == HttpStatus.OK) {
            return response.getBody();
        } else if (response.getStatusCode() == HttpStatus.BAD_REQUEST) {
            throw new BadRequestException("Signature service error: Bad request");
        } else if (response.getStatusCode() == HttpStatus.INTERNAL_SERVER_ERROR) {
            throw new InternalError("Signature service error");
        } else {
            return null;
        }
    }

    public SignatureUserDto getUserByGedIdentifier(String gedIdentifier) {
        String url = signatureServiceUrl + "/api/users?gedIdentifier=" + gedIdentifier;

        try {
            ResponseEntity<SignatureUserDto> response = restTemplate.getForEntity(url, SignatureUserDto.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            } else if (response.getStatusCode() == HttpStatus.NOT_FOUND) {
                return null;
            } else if (response.getStatusCode() == HttpStatus.INTERNAL_SERVER_ERROR) {
                throw new InternalError("Signature service error: " + response.getStatusCode());
            } else {
                return null;
            }
        } catch (HttpClientErrorException.NotFound e) {
            // Handle 404 Not Found by returning null
            return null;
        } catch (HttpClientErrorException e) {
            // Log or rethrow other HTTP errors as needed
            throw new InternalError("Error during Signature API call: " + e.getStatusCode());
        }
    }


}
