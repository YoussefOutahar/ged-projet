package ma.sir.ged.dao.facade.core.doc;

import ma.sir.ged.bean.core.doc.Model;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ModelDao extends JpaRepository<Model, Long>, JpaSpecificationExecutor<Model> {
    Model findByLibelle(String libelle);
}
