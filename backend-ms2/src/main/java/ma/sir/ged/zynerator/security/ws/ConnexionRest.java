package ma.sir.ged.zynerator.security.ws;

import lombok.RequiredArgsConstructor;
import ma.sir.ged.Licence.Service.LicenceValidator;
import ma.sir.ged.zynerator.security.bean.Connexion;
import ma.sir.ged.zynerator.security.bean.User;
import ma.sir.ged.zynerator.security.common.SecurityUtil;
import ma.sir.ged.zynerator.security.dao.ConnexionDao;
import ma.sir.ged.zynerator.security.service.facade.ConnexionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Objects;

@RequestMapping("/api/connexions")
@RestController
@RequiredArgsConstructor
public class ConnexionRest {

    private static final Logger logger = LoggerFactory.getLogger(ConnexionRest.class);

    private final ConnexionService connexionService;
    private final ConnexionDao connexionDao;
    private final LicenceValidator licenceValidator;

    @PostMapping
    public ResponseEntity<Connexion> saveConnexion(@RequestBody Connexion connexion) {
        Connexion savedConnexion = connexionService.saveConnexion(connexion);
        return new ResponseEntity<>(savedConnexion, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Connexion>> getAllConnexions() {
        List<Connexion> connexions = connexionService.getAllConnexions();
        return new ResponseEntity<>(connexions, HttpStatus.OK);
    }

    @PutMapping("/update-status/{username}")
    public Connexion updateConnexionStatusByUsername(@PathVariable String username) {
        return connexionService.updateConnexionStatusByUsername(username);
    }
    @GetMapping("/check-token-status")
    public ResponseEntity<String> checkTokenStatus(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token missing");
        }

        token = token.replace("Bearer ", "");

        Connexion connexion = connexionDao.findConnexionByToken(token);
        if (connexion == null || "DESACTIVE".equals(connexion.getStatus())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is inactive");
        }

        if (connexion.getTimeExpiration() != null &&
                connexion.getTimeExpiration() < System.currentTimeMillis()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token has expired");
        }

        User user = SecurityUtil.getCurrentUser();

        if (Objects.nonNull(user) && !user.isHeavyUser()) {
            int maxSessionsAllowed = licenceValidator.getMaxSessionsPerUser();
            int currentActiveSessions = connexionService.countActiveConnectionsByUsername(connexion.getUsername());

            if (maxSessionsAllowed <= 0) {
                connexion.setStatus("DESACTIVE");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("License configuration error or no sessions allowed");
            }

            if (currentActiveSessions > maxSessionsAllowed) {
                logger.warn("User {} attempted to exceed maximum allowed sessions ({})",
                        connexion.getUsername(), maxSessionsAllowed);

                connexion.setStatus("DESACTIVE");

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(String.format("Maximum allowed sessions (%d) exceeded", maxSessionsAllowed));
            }
        }

        return ResponseEntity.ok("Token is active");
    }
    @GetMapping("/count/{email}")
    public int getUserCountByEmail(@PathVariable String email) {
        return connexionService.getUserCountByEmail(email);
    }
}
