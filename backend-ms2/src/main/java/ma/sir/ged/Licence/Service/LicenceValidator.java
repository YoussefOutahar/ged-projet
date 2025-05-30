package ma.sir.ged.Licence.Service;

import lombok.RequiredArgsConstructor;
import ma.sir.ged.Licence.Beans.Licence;
import ma.sir.ged.Licence.Beans.LicenceKeyField;
import ma.sir.ged.Licence.Repository.LicenceRepository;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class LicenceValidator {

    private static final Logger logger = LoggerFactory.getLogger(LicenceValidator.class);

    private final LicenceRepository licenceRepository;
    private final LicenceEncryptionService licenceEncryptionService;

    public boolean validateLicence(Utilisateur user) {
        Licence licence = licenceRepository.findTopByOrderByIdDesc();
        if (licence == null || licence.getLicenceKey() == null) {
            return false;
        }
        return validateLicence(licence.getLicenceKey());
    }

    public boolean validateLicence(String licenceKey) {
        Map<LicenceKeyField, String> keyParts = licenceEncryptionService.getLicenceKeyParts(licenceKey);
        if (!keyParts.isEmpty()) {
            try {
                LocalDate licenceExpirationDate = LocalDate.parse(keyParts.get(LicenceKeyField.EXPIRATION_DATE));

                return licenceExpirationDate.isAfter(LocalDate.now());
            } catch (Exception e) {
                logger.error("Error while validating licence", e);
            }
        }
        return false;
    }


    public boolean licenceAboutToExpire() {
        Licence licence = licenceRepository.findTopByOrderByIdDesc();
        if (licence == null || licence.getLicenceKey() == null) {
            return false;
        }

        Map<LicenceKeyField, String> keyParts = licenceEncryptionService.getLicenceKeyParts(licence.getLicenceKey());
        if (!keyParts.isEmpty()) {
            try {
                LocalDate licenceExpirationDate = LocalDate.parse(keyParts.get(LicenceKeyField.EXPIRATION_DATE));
                return !licenceExpirationDate.isAfter(LocalDate.now().plusDays(30));
            } catch (Exception e) {
                logger.error("Error while checking licence expiration", e);
            }
        }
        return false;
    }

    public String calculateTimeRemaining() {
        Licence licence = licenceRepository.findTopByOrderByIdDesc();
        if (licence == null || licence.getLicenceKey() == null) {
            return "Licence key is not valid or expired";
        }

        Map<LicenceKeyField, String> keyParts = licenceEncryptionService.getLicenceKeyParts(licence.getLicenceKey());
        if (!keyParts.isEmpty()) {
            try {
                LocalDate licenceExpirationDate = LocalDate.parse(keyParts.get(LicenceKeyField.EXPIRATION_DATE));
                LocalDateTime now = LocalDateTime.now();
                LocalDateTime futureDateTime = licenceExpirationDate.atStartOfDay();

                Duration duration = Duration.between(now, futureDateTime);
                long days = duration.toDays();
                duration = duration.minusDays(days);
                long hours = duration.toHours();
                duration = duration.minusHours(hours);
                long minutes = duration.toMinutes();

                return String.format("%02d Jours - %02d heures et %02d minutes", days, hours, minutes);
            } catch (Exception e) {
                logger.error("Error while calculating remaining time", e);
            }
        }
        return "Licence key is not valid or expired";
    }

    public int getMaxSessionsPerUser() {
        Licence licence = licenceRepository.findTopByOrderByIdDesc();
        if (licence == null || licence.getLicenceKey() == null) {
            return 0;
        }

        Map<LicenceKeyField, String> keyParts = licenceEncryptionService.getLicenceKeyParts(licence.getLicenceKey());
        if (!keyParts.isEmpty()) {
            try {
                return Integer.parseInt(keyParts.get(LicenceKeyField.MAX_SESSIONS_PER_USER));
            } catch (Exception e) {
                logger.error("Error while getting max sessions per user", e);
            }
        }
        return 0;
    }

    public int getNumberOfUsers() {
        Licence licence = licenceRepository.findTopByOrderByIdDesc();
        if (licence == null || licence.getLicenceKey() == null) {
            return 0;
        }

        Map<LicenceKeyField, String> keyParts = licenceEncryptionService.getLicenceKeyParts(licence.getLicenceKey());
        if (!keyParts.isEmpty()) {
            try {
                return Integer.parseInt(keyParts.get(LicenceKeyField.NUMBER_OF_USERS));
            } catch (Exception e) {
                logger.error("Error while getting number of users", e);
            }
        }
        return 0;
    }

}
