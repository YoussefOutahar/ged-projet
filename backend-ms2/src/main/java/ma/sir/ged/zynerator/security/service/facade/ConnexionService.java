package ma.sir.ged.zynerator.security.service.facade;

import ma.sir.ged.zynerator.security.bean.Connexion;

import java.util.List;

public interface ConnexionService {
    Connexion saveConnexion(Connexion connexion);
    List<Connexion> getAllConnexions();
    Connexion updateConnexionStatusByUsername(String username);
    int getUserCountByEmail(String email) ;
    int countActiveConnectionsByUsername(String username);

}
