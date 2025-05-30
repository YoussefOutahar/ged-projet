package ma.sir.ged.zynerator.security.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import ma.sir.ged.zynerator.security.bean.Connexion;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConnexionDao extends JpaRepository<Connexion, Long>{
    Connexion findFirstByUsernameAndStatusOrderByCreatedOnDesc(String username, String status);
    Connexion findTopByUsernameOrderByCreatedOnDesc (String username);
    int countByUsername(String email);
    Connexion findConnexionByToken(String token);

    @Query("SELECT COUNT(c) FROM Connexion c " +
            "WHERE c.username = :username " +
            "AND c.status = 'ACTIVE' " +
            "AND c.timeExpiration > :currentTime")
    int countActiveConnectionsByUsername(@Param("username") String username, @Param("currentTime") Long currentTime);

    List<Connexion> findByUsername(String username);
}
