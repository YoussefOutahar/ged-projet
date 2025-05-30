package ma.sir.ged.zynerator.security.service.impl;

import ma.sir.ged.zynerator.security.bean.Connexion;
import ma.sir.ged.zynerator.security.dao.ConnexionDao;
import ma.sir.ged.zynerator.security.service.facade.ConnexionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ConnexionServiceImpl implements ConnexionService {
    @Autowired
    private ConnexionDao connexionDao;
    @Override
    public Connexion saveConnexion(Connexion connexion) {
        return connexionDao.save(connexion);
    }

    @Override
    public List<Connexion> getAllConnexions() {
        return connexionDao.findAll();
    }

    @Override
    public Connexion updateConnexionStatusByUsername(String username) {
        Connexion lastConnexion = connexionDao.findTopByUsernameOrderByCreatedOnDesc(username);
        if (lastConnexion != null) {
            lastConnexion.setStatus("DESACTIVE");
            return connexionDao.save(lastConnexion);
        } else {
            return null;
        }
    }
    @Override
    public int getUserCountByEmail(String email) {
        return connexionDao.countByUsername(email);
    }

    @Override
    public int countActiveConnectionsByUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            return 0;
        }
        Long currentTime = System.currentTimeMillis();
        return connexionDao.countActiveConnectionsByUsername(username, currentTime);
    }
}
