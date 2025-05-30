package  ma.sir.ged.zynerator.security.ws;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import ma.sir.ged.ws.dto.UtilisateurDto;
import ma.sir.ged.zynerator.security.bean.User;
import ma.sir.ged.zynerator.security.service.facade.UserService;

@RequestMapping("/api/admin/users")
@RestController
// @PreAuthorize("hasRole('ROLE_SUPER_ADMIN')")
public class UserRest {
    @Autowired
    private UserService userService;

    @PreAuthorize("hasRole('ROLE_SUPER_ADMIN')")
    @GetMapping("/")
    public List<User> findAll(){
        return this.userService.findAll();
    }
    
    @Operation(summary = "Change password to the specified  utilisateur")
    @PutMapping("/changePassword")
    public boolean changePassword(@RequestBody UtilisateurDto dto) throws Exception {
        return userService.changePassword(dto.getUsername(),dto.getPassword());
    }

    @PostMapping("/validate-current-user-password")
    public boolean validateCurrentUserPassword(@RequestBody String password) {
        return userService.validateCurrentUserPassword(password);
    }

    @GetMapping("/findByUsername/{username}")
    public User findByUsername(@PathVariable String username) {
        return userService.findByUsername(username);
    }

    @GetMapping("/{id}")
    public User findById(@PathVariable Long id) {
        return userService.findById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id) {
        userService.deleteById(id);
    }

    @PostMapping("/save")
    public User save(@RequestBody User user) {
        return userService.save(user);
    }

    @PutMapping("/")
    public User update(@RequestBody User user) {
        return userService.update(user);
    }

    @DeleteMapping("/id/{id}")
    public int delete(@PathVariable Long id) {
        return userService.delete(id);
    }

    @GetMapping("/username/{username}")
    public User findByUsernameWithRoles(@PathVariable String username) {
        return userService.findByUsernameWithRoles(username);
    }

    @DeleteMapping("/username/{username}")
    public int deleteByUsername(@PathVariable String username) {
        return userService.deleteByUsername(username);
    }

}

