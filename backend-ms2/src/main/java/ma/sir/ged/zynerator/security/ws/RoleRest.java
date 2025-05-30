package ma.sir.ged.zynerator.security.ws;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;

import ma.sir.ged.zynerator.converter.RoleConverter;
import ma.sir.ged.zynerator.dto.RoleDto;
import ma.sir.ged.zynerator.security.bean.Role;
import ma.sir.ged.zynerator.security.service.facade.RoleService;

@RequestMapping("/api/roles")
@RestController
// @PreAuthorize("hasRole(AuthoritiesConstants.super_admin)")
public class RoleRest {
    @Autowired
    private RoleService roleService;

    @Autowired
    private RoleConverter roleConverter;

    // @PreAuthorize("hasRole(AuthoritiesConstants.super_admin)")
    @GetMapping("/")
    public List<RoleDto> findAll(){
        List<Role> allRoles = this.roleService.findAll();
        List<RoleDto> allRolesDto = allRoles.stream().map(role -> this.roleConverter.convertToDto(role)).collect(Collectors.toList());
        return allRolesDto;
    }
}
