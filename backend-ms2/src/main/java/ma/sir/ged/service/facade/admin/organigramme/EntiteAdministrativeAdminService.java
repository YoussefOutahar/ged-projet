package ma.sir.ged.service.facade.admin.organigramme;

import java.io.IOException;
import java.util.List;
import ma.sir.ged.bean.core.organigramme.EntiteAdministrative;
import ma.sir.ged.dao.criteria.core.EntiteAdministrativeCriteria;
import ma.sir.ged.dao.criteria.history.EntiteAdministrativeHistoryCriteria;
import ma.sir.ged.ws.dto.OrganigramElement;
import ma.sir.ged.zynerator.service.IService;
import org.springframework.web.multipart.MultipartFile;


public interface EntiteAdministrativeAdminService extends  IService<EntiteAdministrative,EntiteAdministrativeCriteria, EntiteAdministrativeHistoryCriteria>  {

    List<EntiteAdministrative> findByEntiteAdministrativeParentId(Long id);
    int deleteByEntiteAdministrativeParentId(Long id);
    List<EntiteAdministrative> findByChefId(Long id);
    int deleteByChefId(Long id);
    long countByChefId(long id);

    List<EntiteAdministrative> findByEntiteAdministrativeTypeId(Long id);
    int deleteByEntiteAdministrativeTypeId(Long id);


    long countByEntiteAdministrativeTypeId(Long id);
    void importFromJson(MultipartFile file) throws IOException;
    String exportToJson(OrganigramElement organigramElement) throws Exception;

}
