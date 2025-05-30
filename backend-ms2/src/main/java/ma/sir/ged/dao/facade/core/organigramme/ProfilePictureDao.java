package ma.sir.ged.dao.facade.core.organigramme;

import ma.sir.ged.bean.core.organigramme.ProfilePicture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfilePictureDao extends JpaRepository<ProfilePicture, Long>{
}
