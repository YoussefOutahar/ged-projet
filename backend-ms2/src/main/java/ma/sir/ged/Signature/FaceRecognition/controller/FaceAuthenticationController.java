package ma.sir.ged.Signature.FaceRecognition.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import ma.sir.ged.GedApplication;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.Signature.FaceRecognition.service.FaceRecognitionService;
import ma.sir.ged.zynerator.security.bean.Connexion;
import ma.sir.ged.zynerator.security.bean.User;
import ma.sir.ged.zynerator.security.common.SecurityParams;
import ma.sir.ged.zynerator.security.dao.ConnexionDao;
import ma.sir.ged.zynerator.security.service.facade.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

@RestController
@RequestMapping("/api/face-authentication")
public class FaceAuthenticationController {
    @Autowired
    private FaceRecognitionService faceRecognitionService;

    @Autowired
    private ConnexionDao connexionDao;

//    @PostMapping("/add-face")
//    public ResponseEntity<String> addFace(@RequestParam("image") MultipartFile image, @RequestParam("name") String name) throws IOException {
//        byte[] imageBytes = image.getBytes();
//        String userId = faceRecognitionService.addFace(imageBytes, name);
//        return ResponseEntity.ok(userId);
//    }
//
//    @PostMapping("add-face-stream")
//    public ResponseEntity<String> addFaceStream(@RequestParam("video") MultipartFile video, @RequestParam("name") String name) throws IOException {
//        String userId = faceRecognitionService.addFaceStream(null, name);
//        return ResponseEntity.ok(userId);
//    }


//    @PostMapping("/identify-face")
//    public ResponseEntity<String> identifyFace(@RequestParam("image") MultipartFile image) throws IOException {
//
//        byte[] imageBytes = image.getBytes();
//        String username = faceRecognitionService.identifyFace(imageBytes);
//        HttpHeaders headers = new HttpHeaders();
//
//        if (username != null && !username.isEmpty() && !"Unknown".equals(username)) {
//            UserService userService = GedApplication.getCtx().getBean(UserService.class);
//
//            User myUser = userService.findByUsernameWithRoles(username);
//            Collection<String> roles = new ArrayList<>();
//            if (myUser.getAuthorities() != null) {
//                myUser.getAuthorities().forEach(a->roles.add(a.getAuthority()));
//            }
//            Boolean passwordChanged = myUser.isPasswordChanged();
//            if (passwordChanged == null) {
//                passwordChanged=Boolean.FALSE;
//            }
//
//
//            String jwt= null;
//            if(myUser instanceof Utilisateur) {
//                Utilisateur utilisateur=(Utilisateur) myUser;
//                if (!utilisateur.getEnabled()) {
//                    throw new DisabledException("Votre compte est désactivé");
//                }
//                jwt= JWT.create()
//                        .withIssuer("face-authentication")
//                        .withSubject(username)
//                        .withArrayClaim("roles",roles.toArray(new String[roles.size()]))
//                        .withExpiresAt(new Date(System.currentTimeMillis()+ SecurityParams.EXPIRATION))
//                        .withClaim("passwordChanged",passwordChanged)
//                        .withClaim("enabled", utilisateur.getEnabled())
//                        .withClaim("email", utilisateur.getEmail())
//                        .withClaim("id", utilisateur.getId())
//                        .withClaim("type","utilisateur")
//                        .withClaim("nom", utilisateur.getNom())
//                        .withClaim("prenom", utilisateur.getPrenom())
//                        .withClaim("telephone", utilisateur.getTelephone())
//                        .sign(Algorithm.HMAC256(SecurityParams.SECRET));
//
//                headers.add(SecurityParams.JWT_HEADER_NAME, SecurityParams.HEADER_PREFIX + jwt);
//                System.out.println(jwt);
//                Connexion connexion = new Connexion();
//                connexion.setUsername(username);
//                connexion.setToken(jwt);
//                Date expirationDate = new Date(System.currentTimeMillis() + SecurityParams.EXPIRATION);
//                connexion.setTimeExpiration(expirationDate.getTime());
//                connexion.setStatus("ACTIVE");
//                connexionDao.save(connexion);
//            }else {
//
//                jwt= JWT.create()
//                        .withIssuer("face-authentication")
//                        .withSubject(username)
//                        .withArrayClaim("roles",roles.toArray(new String[roles.size()]))
//                        .withExpiresAt(new Date(System.currentTimeMillis()+ SecurityParams.EXPIRATION))
//                        .withClaim("passwordChanged",passwordChanged)
//                        .withClaim("enabled", myUser.getEnabled())
//                        .withClaim("email", myUser.getEmail())
//                        .withClaim("type","user")
//
//                        .sign(Algorithm.HMAC256(SecurityParams.SECRET));
//
//                headers.add(SecurityParams.JWT_HEADER_NAME, SecurityParams.HEADER_PREFIX + jwt);
//                System.out.println(jwt);
//                Connexion connexion = new Connexion();
//                connexion.setUsername(username);
//                connexion.setToken(jwt);
//                connexion.setStatus("ACTIVE");
//                Date expirationDate = new Date(System.currentTimeMillis() + SecurityParams.EXPIRATION);
//                connexion.setTimeExpiration(expirationDate.getTime());
//                connexionDao.save(connexion);
//            }
//            return new ResponseEntity<>(jwt, headers, HttpStatus.OK);
//        } else {
//            return ResponseEntity.badRequest().body("Failed to identify face");
//        }
//    }

    private boolean isTokenValid(Long timeExpiration){
        try {
            Long now = System.currentTimeMillis();
            return timeExpiration < now;
        }catch (Exception e) {
            return false;
        }
    }
}
