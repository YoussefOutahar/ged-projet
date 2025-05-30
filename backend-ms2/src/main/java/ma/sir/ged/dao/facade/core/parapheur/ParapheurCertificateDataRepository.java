package ma.sir.ged.dao.facade.core.parapheur;

import ma.sir.ged.bean.core.parapheur.FicheParapheur.ParapheurCertificateData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ParapheurCertificateDataRepository extends JpaRepository<ParapheurCertificateData, Long> {
    Optional<ParapheurCertificateData> findByDocumentKey(String documentKey);
}
