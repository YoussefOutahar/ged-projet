package ma.sir.ged.dao.facade.core.otp;

import ma.sir.ged.Signature.Otp.entities.Otp;
import ma.sir.ged.zynerator.repository.AbstractRepository;

import java.util.List;

public interface otpDao extends AbstractRepository<Otp, Long> {

    List<Otp> findByOtpAndUsername(String otp, String username);

}
