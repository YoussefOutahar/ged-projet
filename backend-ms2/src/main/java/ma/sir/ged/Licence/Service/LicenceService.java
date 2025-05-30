package ma.sir.ged.Licence.Service;

import lombok.RequiredArgsConstructor;
import ma.sir.ged.Licence.Beans.Licence;
import ma.sir.ged.Licence.Config.LicenceSecurityConfig;
import ma.sir.ged.Licence.Controller.DTO.LicenceCreationRequest;
import ma.sir.ged.Licence.Controller.DTO.LicencePackage;
import ma.sir.ged.Licence.Repository.LicenceRepository;
import ma.sir.ged.zynerator.security.dao.UserDao;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LicenceService {

    private static final String FILE_DELIMITER = "EC60959792E344eF4B92B3d7CFD3AF3e" +
            "2e1f4Fa78Eaa0aA2CBdaC7cE710cC640" +
            "D58162656CdD7b3Be0f367194A5A06C1" +
            "7C5Dc8A2E446CA31722be55844Cbd069" +
            "929C88207a0cFcDE8F9C65A35d826D3F" +
            "1edB2A6249Ab1129E6d4154BB8bcA56a" +
            "d8b01c229985D76bEf9C3B0B7E678077" +
            "DefBf520Aa103960CC5782bE65C74fbf" +
            "207740D362D02c0F6FD7C145fF26E0B7" +
            "0606983b551308c96a3c933a7F115a57";

    private final LicenceRepository licenceRepository;
    private final LicenceEncryptionService licenceEncryptionService;
    private final LicenceSecurityConfig licenceSecurityConfig;
    private final LicenceValidator licenceValidator;
    private final UserDao userDao;

    public Licence createLicence(String licenceKey) {
        Licence licence = new Licence();
        licence.setLicenceKey(licenceKey);
        licence.setCreatedOn(LocalDateTime.now());
        licence.setUpdatedOn(LocalDateTime.now());
        return licenceRepository.save(licence);
    }

    public boolean deleteLicence(Long id) {
        if (licenceRepository.existsById(id)) {
            licenceRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public LicencePackage generateLicencePackage(LicenceCreationRequest request) throws Exception {
        String licenceKey = licenceEncryptionService.createLicenceKey(
                request.getClientName(),
                request.getExpirationDate(),
                request.getNumberOfUsers(),
                request.getMaxSessionsPerUser()
        );

        Licence licence = createLicence(licenceKey);
        String masterKey = Base64.getEncoder().encodeToString(licenceSecurityConfig.getMasterKey());

        StringBuilder heavyUsersSection = new StringBuilder();
        if (request.getHeavyUserIds() != null && !request.getHeavyUserIds().isEmpty()) {
            heavyUsersSection.append(
                    request.getHeavyUserIds().stream()
                            .map(String::valueOf)
                            .collect(Collectors.joining("\n"))
            );
        }

        String packageContent = String.format("%s%n%s%n%s%n%s%n%s",
                masterKey,
                FILE_DELIMITER,
                heavyUsersSection,
                FILE_DELIMITER,
                licence.getLicenceKey()
        );

        String filename = String.format("licence-%s.lic",
                request.getClientName().replaceAll("[^a-zA-Z0-9-_]", "-"));

        return LicencePackage.builder()
                .filename(filename)
                .content(packageContent.getBytes(StandardCharsets.UTF_8))
                .contentType("application/octet-stream")
                .build();
    }

    public void importLicencePackage(MultipartFile file) throws Exception {
        String fileContent = new String(file.getBytes(), StandardCharsets.UTF_8);
        String[] parts = fileContent.split(FILE_DELIMITER);

        if (parts.length != 3) {
            throw new IllegalArgumentException("Invalid licence file format");
        }

        String masterKey = parts[0].trim();
        String heavyUsersSection = parts[1].trim();
        String licenceKey = parts[2].trim();

        List<Long> heavyUserIds = GetHeavyUsersIds(heavyUsersSection);

        Base64.getDecoder().decode(masterKey);

        byte[] currentMasterKey = licenceSecurityConfig.getMasterKey();

        try {
            licenceSecurityConfig.saveMasterKey(masterKey);

            if (!licenceValidator.validateLicence(licenceKey)) {
                licenceSecurityConfig.saveMasterKey(Base64.getEncoder().encodeToString(currentMasterKey));
                throw new IllegalArgumentException("Invalid license key");
            }

            Licence licence = new Licence();
            licence.setLicenceKey(licenceKey);
            licence.setCreatedOn(LocalDateTime.now());
            licence.setUpdatedOn(LocalDateTime.now());

            userDao.resetAllHeavyUsers();
            if (!heavyUserIds.isEmpty()) {
                heavyUserIds.forEach(id -> {
                    if (id != null) {
                        userDao.setUserAsHeavyUser(id);
                    }
                });
            }

            licenceRepository.save(licence);

        } catch (Exception e) {
            licenceSecurityConfig.saveMasterKey(Base64.getEncoder().encodeToString(currentMasterKey));
            throw e;
        }
    }

    @NotNull
    private List<Long> GetHeavyUsersIds(String heavyUsersSection) {
        List<Long> heavyUserIds = new ArrayList<>();

        if (!heavyUsersSection.isEmpty()) {
            String[] userLines = heavyUsersSection.split("\n");
            for (String line : userLines) {
                if (!line.trim().isEmpty()) {
                    try {
                        heavyUserIds.add(Long.parseLong(line.trim()));
                    } catch (NumberFormatException e) {
                        throw new IllegalArgumentException("Invalid user ID format in license file");
                    }
                }
            }
        }
        return heavyUserIds;
    }
}
