package ma.sir.ged.dao.facade.core.parapheur;

import ma.sir.ged.bean.core.parapheur.ParapheurComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParapheurCommentRepository extends JpaRepository<ParapheurComment, Long> {
    // find all by list of ids
    List<ParapheurComment> findAllByIdIn(List<Long> ids);
}
