package ma.sir.ged.dao.facade.core.organigramme;

import ma.sir.ged.bean.core.organigramme.UserKeystore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserKeystoreDao extends JpaRepository<UserKeystore, Long> {

    UserKeystore findTopByOrderByIdDesc();
    /**
     * Finds the most recently created UserKeystore
     * @return the most recent UserKeystore based on createDate or null if none exists
     */
    @Query("SELECT uk FROM UserKeystore uk ORDER BY uk.createDate DESC")
    UserKeystore findMostRecent();
}
