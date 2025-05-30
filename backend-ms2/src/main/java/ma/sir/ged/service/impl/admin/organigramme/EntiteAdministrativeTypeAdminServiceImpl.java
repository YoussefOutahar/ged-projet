package ma.sir.ged.service.impl.admin.organigramme;


import ma.sir.ged.bean.core.organigramme.EntiteAdministrativeType;
import ma.sir.ged.bean.history.EntiteAdministrativeTypeHistory;
import ma.sir.ged.dao.criteria.core.EntiteAdministrativeTypeCriteria;
import ma.sir.ged.dao.criteria.history.EntiteAdministrativeTypeHistoryCriteria;
import ma.sir.ged.dao.facade.core.organigramme.EntiteAdministrativeTypeDao;
import ma.sir.ged.dao.facade.history.EntiteAdministrativeTypeHistoryDao;
import ma.sir.ged.dao.specification.core.EntiteAdministrativeTypeSpecification;
import ma.sir.ged.service.facade.admin.organigramme.EntiteAdministrativeAdminService;
import ma.sir.ged.service.facade.admin.organigramme.EntiteAdministrativeTypeAdminService;
import ma.sir.ged.ws.converter.EntiteAdministrativeTypeConverter;
import ma.sir.ged.ws.dto.EntiteAdministrativeTypeDto;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class EntiteAdministrativeTypeAdminServiceImpl extends AbstractServiceImpl<EntiteAdministrativeType, EntiteAdministrativeTypeHistory, EntiteAdministrativeTypeCriteria, EntiteAdministrativeTypeHistoryCriteria, EntiteAdministrativeTypeDao,
        EntiteAdministrativeTypeHistoryDao> implements EntiteAdministrativeTypeAdminService {


    public EntiteAdministrativeType findByReferenceEntity(EntiteAdministrativeType t) {
        EntiteAdministrativeType byCode = dao.findByCode(t.getCode());
        if (byCode == null) {
            EntiteAdministrativeType byLibelle = dao.findByLibelle(t.getLibelle());
            return byLibelle;
        }
        return byCode;
    }


    @Override
    public boolean deleteByIdCheckCondition(Long id) {
        return entiteAdministrativeAdminService.countByEntiteAdministrativeTypeId(id) == 0;
    }

    public void configure() {
        super.configure(EntiteAdministrativeType.class, EntiteAdministrativeTypeHistory.class, EntiteAdministrativeTypeHistoryCriteria.class, EntiteAdministrativeTypeSpecification.class);
    }


    public EntiteAdministrativeTypeAdminServiceImpl(EntiteAdministrativeTypeDao dao, EntiteAdministrativeTypeHistoryDao historyDao) {
        super(dao, historyDao);
    }

    @Autowired
    private EntiteAdministrativeAdminService entiteAdministrativeAdminService;

    @Override
    public ResponseEntity<EntiteAdministrativeTypeDto> save(EntiteAdministrativeTypeDto dto) {
            if (dto != null && dto.getRang() != null && !(existWithSameRang(dto.getRang()))) {
                converter.init(true);
                EntiteAdministrativeType myT = converter.toItem(dto);
                EntiteAdministrativeType t = create(myT);
                if (t == null) {
                    return new ResponseEntity<>(null, HttpStatus.IM_USED);
                } else {
                    EntiteAdministrativeTypeDto myDto = converter.toDto(t);
                    return new ResponseEntity<>(myDto, HttpStatus.CREATED);
                }
            } else {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
    }

    @Override
    public Boolean existWithSameRang(Integer rang) {
        EntiteAdministrativeType byRang = dao.findByRang(rang);
        return Objects.nonNull(byRang);
    }

    @Autowired
    private EntiteAdministrativeTypeConverter converter;
}
