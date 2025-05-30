package ma.sir.ged.ws.converter;

import ma.sir.ged.bean.core.organigramme.EntiteAdministrative;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.bean.history.UtilisateurHistory;
import ma.sir.ged.ws.dto.UtilisateurDto;
import ma.sir.ged.zynerator.converter.AbstractConverter;
import ma.sir.ged.zynerator.converter.RoleConverter;
import ma.sir.ged.zynerator.dto.RoleDto;
import ma.sir.ged.zynerator.util.DateUtil;
import ma.sir.ged.zynerator.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collection;

@Component
public class UtilisateurConverter extends AbstractConverter<Utilisateur, UtilisateurDto, UtilisateurHistory> {

    @Autowired
    private EntiteAdministrativeConverter entiteAdministrativeConverter;
    
    @Autowired
    private GenderConverter genderConverter;

    @Autowired
    private RoleConverter roleConverter;

    private boolean gender;
    private boolean entiteAdministrative;

    private static final int MAX_DEPTH = 4;

    public UtilisateurConverter() {
        super(Utilisateur.class, UtilisateurDto.class, UtilisateurHistory.class);
    }

    @Override
    public Utilisateur toItem(UtilisateurDto dto) {
        if (dto == null) {
            return null;
        } else {
            Utilisateur item = new Utilisateur();
            if (StringUtil.isNotEmpty(dto.getId()))
                item.setId(dto.getId());
            if (StringUtil.isNotEmpty(dto.getEmail()))
                item.setEmail(dto.getEmail());
            if (StringUtil.isNotEmpty(dto.getTelephone()))
                item.setTelephone(dto.getTelephone());
            if (StringUtil.isNotEmpty(dto.getNom()))
                item.setNom(dto.getNom());
            if (StringUtil.isNotEmpty(dto.getPrenom()))
                item.setPrenom(dto.getPrenom());
            if (StringUtil.isNotEmpty(dto.getDateNaissance()))
                item.setDateNaissance(DateUtil.stringEnToDate(dto.getDateNaissance()));
            item.setCredentialsNonExpired(dto.getCredentialsNonExpired());
            item.setEnabled(dto.getEnabled());
            item.setAccountNonExpired(dto.getAccountNonExpired());
            item.setAccountNonLocked(dto.getAccountNonLocked());
            item.setPasswordChanged(dto.getPasswordChanged());
            if (StringUtil.isNotEmpty(dto.getUsername()))
                item.setUsername(dto.getUsername());
            if (StringUtil.isNotEmpty(dto.getPassword()))
                item.setPassword(dto.getPassword());
            if (this.gender && dto.getGender() != null && dto.getGender().getId() != null)
                item.setGender(genderConverter.toItem(dto.getGender()));

            if (dto.getEntiteAdministrative() != null && dto.getEntiteAdministrative().getId() != null) {
                item.setEntiteAdministrative(new EntiteAdministrative());
                item.getEntiteAdministrative().setId(dto.getEntiteAdministrative().getId());
                item.getEntiteAdministrative().setLibelle(dto.getEntiteAdministrative().getLibelle());
            }

            if (dto.getRoles() != null) {
                dto.getRoles().forEach(roleDto -> {
                    item.getRoles().add(roleConverter.convertToEntity(roleDto));
                });
            }

            return item;
        }
    }

    @Override
    public UtilisateurDto toDto(Utilisateur item) {
        return toDto(item, 0);
    }

    public UtilisateurDto toDto(Utilisateur item, int depth) {
        if (item == null || depth > MAX_DEPTH) {
            return null;
        } else {
            UtilisateurDto dto = new UtilisateurDto();
            if (StringUtil.isNotEmpty(item.getId()))
                dto.setId(item.getId());
            if (StringUtil.isNotEmpty(item.getEmail()))
                dto.setEmail(item.getEmail());
            if (StringUtil.isNotEmpty(item.getTelephone()))
                dto.setTelephone(item.getTelephone());
            if (StringUtil.isNotEmpty(item.getNom()))
                dto.setNom(item.getNom());
            if (StringUtil.isNotEmpty(item.getPrenom()))
                dto.setPrenom(item.getPrenom());
            if (item.getDateNaissance() != null)
                dto.setDateNaissance(DateUtil.dateTimeToString(item.getDateNaissance()));
            if (StringUtil.isNotEmpty(item.getCredentialsNonExpired()))
                dto.setCredentialsNonExpired(item.getCredentialsNonExpired());
            if (StringUtil.isNotEmpty(item.getEnabled()))
                dto.setEnabled(item.getEnabled());
            if (StringUtil.isNotEmpty(item.getAccountNonExpired()))
                dto.setAccountNonExpired(item.getAccountNonExpired());
            if (StringUtil.isNotEmpty(item.getAccountNonLocked()))
                dto.setAccountNonLocked(item.getAccountNonLocked());
            if (StringUtil.isNotEmpty(item.getPasswordChanged()))
                dto.setPasswordChanged(item.getPasswordChanged());
            if (StringUtil.isNotEmpty(item.getUsername()))
                dto.setUsername(item.getUsername());
            /*
             * if (StringUtil.isNotEmpty(item.getPassword()))
             * dto.setPassword(item.getPassword());
             */
            if (this.gender && item.getGender() != null) {
                dto.setGender(genderConverter.toDto(item.getGender()));
                // dto.setRolesDto(item.getRoles());
            }
            if (this.entiteAdministrative && item.getEntiteAdministrative() != null) {
                entiteAdministrativeConverter.setChef(false);
                dto.setEntiteAdministrative(entiteAdministrativeConverter.toDto(item.getEntiteAdministrative(), depth + 1));
                entiteAdministrativeConverter.setChef(true);
                
                Collection<RoleDto> roles = new ArrayList<>(); 
                if (item.getRoles() != null) {
                    item.getRoles().forEach(role -> {
                        if (role != null) {
                            roles.add(roleConverter.convertToDto(role));
                        }
                    });
                }

                dto.setRoles(roles);
            }

            return dto;
        }
    }

    public void initObject(boolean value) {
        this.gender = value;
        this.entiteAdministrative = value;
    }

    public EntiteAdministrativeConverter getEntiteAdministrativeConverter() {
        return this.entiteAdministrativeConverter;
    }

    public void setEntiteAdministrativeConverter(EntiteAdministrativeConverter entiteAdministrativeConverter) {
        this.entiteAdministrativeConverter = entiteAdministrativeConverter;
    }

    public GenderConverter getGenderConverter() {
        return this.genderConverter;
    }

    public void setGenderConverter(GenderConverter genderConverter) {
        this.genderConverter = genderConverter;
    }

    public boolean isGender() {
        return this.gender;
    }

    public void setGender(boolean gender) {
        this.gender = gender;
    }

    public boolean isEntiteAdministrative() {
        return this.entiteAdministrative;
    }

    public void setEntiteAdministrative(boolean entiteAdministrative) {
        this.entiteAdministrative = entiteAdministrative;
    }
}
