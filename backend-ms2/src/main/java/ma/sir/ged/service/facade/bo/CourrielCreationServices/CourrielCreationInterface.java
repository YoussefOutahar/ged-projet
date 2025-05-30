package ma.sir.ged.service.facade.bo.CourrielCreationServices;

import ma.sir.ged.bean.core.bureauOrdre.CourrielBo;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CourrielCreationInterface {
    CourrielBo createCourriel(Long id, CourrielBo courrielBo, List<MultipartFile> files);
}
