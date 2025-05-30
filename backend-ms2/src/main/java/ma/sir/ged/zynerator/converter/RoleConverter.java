package ma.sir.ged.zynerator.converter;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import ma.sir.ged.zynerator.dto.RoleDto;
import ma.sir.ged.zynerator.security.bean.Role;
import ma.sir.ged.zynerator.security.service.facade.RoleService;

@Component
public class RoleConverter {

    @Autowired
    private RoleService roleService;

    public Role convertToEntity(RoleDto roleDto) {
        Role role = new Role();
        role.setId(roleDto.getId());
        role.setLabel(roleDto.getLabel());
        role.setCreatedAt(roleDto.getCreatedAt());
        role.setUpdatedAt(roleDto.getUpdatedAt());
        role.setAuthority(roleDto.getAuthority());

        role.setUsers(roleService.findUsersByRole(roleDto.getAuthority()));
        role.setPermissions(roleService.findPermissionsByRole(roleDto.getAuthority()));

        return role;
    }

    public RoleDto convertToDto(Role role) {
        RoleDto roleDto = new RoleDto();
        roleDto.setId(role.getId());
        roleDto.setLabel(role.getLabel());
        roleDto.setCreatedAt(role.getCreatedAt());
        roleDto.setUpdatedAt(role.getUpdatedAt());
        roleDto.setAuthority(role.getAuthority());

        roleDto.setPermissions(
                role.getPermissions().stream().map(permission -> permission.getId()).collect(Collectors.toList()));

        return roleDto;
    }
}
