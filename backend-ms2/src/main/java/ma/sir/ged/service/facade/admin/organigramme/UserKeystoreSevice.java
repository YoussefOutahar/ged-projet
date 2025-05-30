package ma.sir.ged.service.facade.admin.organigramme;

import ma.sir.ged.bean.core.organigramme.UserKeystore;
import ma.sir.ged.dao.facade.core.organigramme.UserKeystoreDao;
import ma.sir.ged.workflow.DTO.UserKeystoreDto;
import ma.sir.ged.zynerator.util.ListUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserKeystoreSevice {

    @Autowired
    private UserKeystoreDao userKeystoreDao;

    public UserKeystore createCertificate(UserKeystoreDto dto){
        return userKeystoreDao.save(mapToEntity(dto));
    }

    public UserKeystore findLastUserKeystore() {
        return userKeystoreDao.findTopByOrderByIdDesc();
    }

    public UserKeystore mapToEntity(UserKeystoreDto dto) {
        UserKeystore userKeystore = new UserKeystore();
        userKeystore.setReferenceId(dto.getId());
        userKeystore.setPassword(dto.getPasswordHash());
        userKeystore.setPasswordHash(dto.getPassword());
        userKeystore.setCreateDate(dto.getCreateDate());
        userKeystore.setExpireDate(dto.getExpireDate());
        userKeystore.setKeystoreFileName(dto.getKeystoreFileName());
        userKeystore.setAlias(dto.getAlias());

        return userKeystore;
    }
    public UserKeystoreDto mapToDto(UserKeystore entity) {
        UserKeystoreDto userKeystoreDto = new UserKeystoreDto();
        userKeystoreDto.setId(entity.getReferenceId());
//        userKeystoreDto.setPassword(entity.getPasswordHash());
//        userKeystoreDto.setPasswordHash(entity.getPassword());
        userKeystoreDto.setCreateDate(entity.getCreateDate());
        userKeystoreDto.setExpireDate(entity.getExpireDate());
        userKeystoreDto.setKeystoreFileName(entity.getKeystoreFileName());
        userKeystoreDto.setAlias(entity.getAlias());
        return userKeystoreDto;
    }

    public List<UserKeystoreDto> getAllUserKeystore() {
        List<UserKeystore> list = ListUtil.emptyIfNull(userKeystoreDao.findAll());
        return  list.stream().map((entity) -> mapToDto(entity)).collect(Collectors.toList());
    }
}
