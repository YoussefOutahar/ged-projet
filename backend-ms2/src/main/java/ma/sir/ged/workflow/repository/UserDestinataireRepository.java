package ma.sir.ged.workflow.repository;

import ma.sir.ged.workflow.entity.UserDestinataire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserDestinataireRepository extends JpaRepository<UserDestinataire, Long>{

    List<UserDestinataire> findUserDestinatairesByUtilisateurId(Long utilisateurId);

}
