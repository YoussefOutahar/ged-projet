
package ma.sir.ged.zynerator.security.service.facade;

import java.util.List;

import ma.sir.ged.zynerator.security.bean.Permission;
import ma.sir.ged.zynerator.security.bean.Role;
import ma.sir.ged.zynerator.security.bean.User;


public interface RoleService {
    List<Role> findAll();

    Role findByAuthority(String authority);

    Role findById(Long id);

    void deleteById(Long id);

    Role save(Role role);

    List<Role> create(List<Role> roles);

    public Role update(Role role);

    int delete(Role role);

    int deleteByAuthority(String authority);

    List<Role> findByUserName(String username);

    List<User> findUsersByRole(String authority);

    List<Permission> findPermissionsByRole(String authority);
}
