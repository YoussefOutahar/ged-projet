package ma.sir.ged.service.facade.admin.organigramme;

import ma.sir.ged.bean.core.organigramme.EntiteAdministrativeType;
import ma.sir.ged.dao.criteria.core.EntiteAdministrativeTypeCriteria;
import ma.sir.ged.dao.criteria.history.EntiteAdministrativeTypeHistoryCriteria;
import ma.sir.ged.ws.dto.EntiteAdministrativeTypeDto;
import ma.sir.ged.zynerator.service.IService;
import org.springframework.http.ResponseEntity;


public interface EntiteAdministrativeTypeAdminService extends  IService<EntiteAdministrativeType,EntiteAdministrativeTypeCriteria, EntiteAdministrativeTypeHistoryCriteria>  {

    ResponseEntity<EntiteAdministrativeTypeDto> save(EntiteAdministrativeTypeDto dto);
    Boolean existWithSameRang(Integer rang);


}
