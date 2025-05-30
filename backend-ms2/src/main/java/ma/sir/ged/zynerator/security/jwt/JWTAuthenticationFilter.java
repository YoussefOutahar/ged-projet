package ma.sir.ged.zynerator.security.jwt;

import java.io.IOException;
import java.util.*;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import ma.sir.ged.Licence.Service.LicenceValidator;
import ma.sir.ged.zynerator.security.bean.Connexion;
import ma.sir.ged.zynerator.security.dao.ConnexionDao;
import ma.sir.ged.zynerator.security.service.facade.ConnexionService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import ma.sir.ged.GedApplication;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.zynerator.security.common.SecurityParams;
import ma.sir.ged.zynerator.security.service.facade.UserService;
import ma.sir.ged.zynerator.security.bean.User;

public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;

    private final ConnexionDao connexionDao;

    private final LicenceValidator licenceValidator;

    private final ConnexionService connexionService;

    public JWTAuthenticationFilter(AuthenticationManager authenticationManager, ConnexionDao connexionDao, LicenceValidator licenceValidator, ConnexionService connexionService) {
        this.authenticationManager = authenticationManager;
        this.connexionDao = connexionDao;
        this.licenceValidator = licenceValidator;
        this.connexionService = connexionService;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        try {
            User myUser = new ObjectMapper().readValue(request.getInputStream(), User.class);
            return authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(myUser.getUsername(),myUser.getPassword()));
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                            FilterChain chain, Authentication authResult) throws IOException, ServletException {

        User user = (User) authResult.getPrincipal();

        if (!licenceValidator.validateLicence( (Utilisateur) user)) {
            response.setStatus(418);
            response.getWriter().write("Licence expired");
            return;
        }

        Connexion existingConnexion = connexionDao.findFirstByUsernameAndStatusOrderByCreatedOnDesc(user.getUsername(), "ACTIVE");

        if (Objects.nonNull(existingConnexion) && user.isHeavyUser()) {
            List<Connexion> connexions = connexionDao.findByUsername(user.getUsername());
            connexions.forEach(connexion -> {
                connexion.setStatus("DESACTIVE");
                connexionDao.save(connexion);
            });
        }

        if (Objects.nonNull(existingConnexion) && !user.isHeavyUser()) {
            int maxSessionsAllowed = licenceValidator.getMaxSessionsPerUser();
            int currentActiveSessions = connexionService.countActiveConnectionsByUsername(existingConnexion.getUsername());

            if (maxSessionsAllowed <= 0) {
                response.sendError(HttpServletResponse.SC_CONFLICT, "License configuration error or no sessions allowed");
                return;
            }

            if (currentActiveSessions >= maxSessionsAllowed) {
                response.sendError(HttpServletResponse.SC_CONFLICT, String.format("Maximum allowed sessions (%d) exceeded", maxSessionsAllowed));
                return;
            }
        }

        UserService userService = GedApplication.getCtx().getBean(UserService.class);

        User myUser = userService.findByUsernameWithRoles(user.getUsername());

        Collection<String> roles = new ArrayList<>();
        if (myUser.getAuthorities() != null) {
            myUser.getAuthorities().forEach(a->roles.add(a.getAuthority()));
        }
        Boolean passwordChanged = myUser.isPasswordChanged();
        if (passwordChanged == null) {
            passwordChanged=Boolean.FALSE;
        }


        String jwt= null;
        if(myUser instanceof Utilisateur) {
        	Utilisateur utilisateur=(Utilisateur) myUser;
            if (!utilisateur.getEnabled()) {
                throw new DisabledException("Votre compte est désactivé");
            }
        	 jwt= JWT.create()
                     .withIssuer(request.getRequestURI())
                     .withSubject(user.getUsername())
                     .withArrayClaim("roles",roles.toArray(new String[roles.size()]))
                     .withExpiresAt(new Date(System.currentTimeMillis()+ SecurityParams.EXPIRATION))
                     .withClaim("passwordChanged",passwordChanged)
                     .withClaim("enabled", utilisateur.getEnabled())
                     .withClaim("email", utilisateur.getEmail())
                     .withClaim("id", utilisateur.getId())
                     .withClaim("type","utilisateur")
                     .withClaim("nom", utilisateur.getNom())
                     .withClaim("prenom", utilisateur.getPrenom())
                     .withClaim("telephone", utilisateur.getTelephone())
                     .sign(Algorithm.HMAC256(SecurityParams.SECRET));
                     response.addHeader(SecurityParams.JWT_HEADER_NAME,SecurityParams.HEADER_PREFIX+jwt);
             System.out.println(jwt);
             Connexion connexion = new Connexion();
             connexion.setUsername(user.getUsername());
             connexion.setToken(jwt);
             Date expirationDate = new Date(System.currentTimeMillis() + SecurityParams.EXPIRATION);
             connexion.setTimeExpiration(expirationDate.getTime());
             connexion.setStatus("ACTIVE");
             connexionDao.save(connexion);
        }else {

         jwt= JWT.create()
                .withIssuer(request.getRequestURI())
                .withSubject(user.getUsername())
                .withArrayClaim("roles",roles.toArray(new String[roles.size()]))
                .withExpiresAt(new Date(System.currentTimeMillis()+ SecurityParams.EXPIRATION))
                .withClaim("passwordChanged",passwordChanged)
                .withClaim("enabled", myUser.getEnabled())
                .withClaim("email", myUser.getEmail())
                .withClaim("type","user")

                .sign(Algorithm.HMAC256(SecurityParams.SECRET));
                response.addHeader(SecurityParams.JWT_HEADER_NAME,SecurityParams.HEADER_PREFIX+jwt);
        System.out.println(jwt);
        Connexion connexion = new Connexion();
        connexion.setUsername(user.getUsername());
        connexion.setToken(jwt);
        connexion.setStatus("ACTIVE");
        Date expirationDate = new Date(System.currentTimeMillis() + SecurityParams.EXPIRATION);
        connexion.setTimeExpiration(expirationDate.getTime());
        connexionDao.save(connexion);
    }
    }

    private boolean isTokenValid(Long timeExpiration){
        try {
            Long now = System.currentTimeMillis();
            return timeExpiration < now;
        }catch (Exception e) {
            return false;
        }
    }
}
