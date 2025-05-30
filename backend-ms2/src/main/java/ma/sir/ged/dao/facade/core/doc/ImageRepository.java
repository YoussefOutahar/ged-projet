package ma.sir.ged.dao.facade.core.doc;

import ma.sir.ged.bean.core.doc.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Long> {
}
