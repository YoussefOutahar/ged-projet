package ma.sir.ged.Licence.Repository;

import ma.sir.ged.Licence.Beans.Licence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LicenceRepository extends JpaRepository<Licence,Long> {
    Licence findTopByOrderByIdDesc();
    Licence findByLicenceKey(String licenceKey);
}
