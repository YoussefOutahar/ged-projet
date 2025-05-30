package ma.sir.ged.workflow.repository;

import ma.sir.ged.workflow.entity.Commentaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentaireRepository extends JpaRepository<Commentaire, Long>{
}
