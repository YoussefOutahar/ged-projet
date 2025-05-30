package ma.sir.ged.Licence.Controller;

import lombok.RequiredArgsConstructor;
import ma.sir.ged.Licence.Service.LicenceValidator;
import ma.sir.ged.WebSocket.UseCases.NotificationLicence;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/licence-validation")
@RequiredArgsConstructor
public class LicenceValidationAlert {
    private final LicenceValidator licenceValidator;
    private final NotificationLicence notificationLicence;

    @GetMapping("/about-to-expire")
    public String aboutToExpire() {
        if (!licenceValidator.licenceAboutToExpire()) return "Licence is not about to expire";

        String timeRemaining = licenceValidator.calculateTimeRemaining();
        return "La licence de l'application va expirer dans " + timeRemaining;
    }

    @Scheduled(fixedDelay = 15 * 60 * 1000) // 15 minutes
//    @Scheduled(fixedRate = 30 * 1000) // 30 seconds
    public void validateLicenceBanner() {
        if (!licenceValidator.licenceAboutToExpire()) return;

        String timeRemaining = licenceValidator.calculateTimeRemaining();
        notificationLicence.notifyLicenceAboutToExpireBanner(timeRemaining);
    }

    @Scheduled(cron = "0 0 0 * * *") // every day at midnight
//    @Scheduled(fixedRate = 60 * 1000) // 1 minute
    public void validateLicenceMessage() {
        if (!licenceValidator.licenceAboutToExpire()) return;

        String timeRemaining = licenceValidator.calculateTimeRemaining();
        notificationLicence.notifyLicenceAboutToExpire(timeRemaining);
    }
}
