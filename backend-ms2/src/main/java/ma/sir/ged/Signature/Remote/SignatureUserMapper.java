package ma.sir.ged.Signature.Remote;

import ma.sir.ged.Signature.Remote.Models.SignatureUserDto;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import org.springframework.stereotype.Component;

@Component
public class SignatureUserMapper {
    public SignatureUserDto toDto(Utilisateur utilisateur) {
        if (utilisateur == null) {
            return null;
        }

        SignatureUserDto userDto = new SignatureUserDto();

        userDto.setGedIdentifier(utilisateur.getId() != null ? utilisateur.getId().toString() : null);
        userDto.setFirstName(utilisateur.getPrenom());
        userDto.setLastName(utilisateur.getNom());
        userDto.setPhone(utilisateur.getTelephone());
        userDto.setEmail(utilisateur.getEmail());
        userDto.setUserType("external");
        userDto.setUsername(utilisateur.getUsername());
        userDto.setEnabled(utilisateur.getEnabled());
        if(utilisateur.getGender() != null) {
//            userDto.setCivilityTitle(utilisateur.getGender().getLibelle());
            String gender = utilisateur.getGender().getLibelle();
            if(gender.equals("madame")){
                userDto.setCivilityTitle("Mme");
            }else {
                userDto.setCivilityTitle("Mr");
            }
        }else {
            userDto.setCivilityTitle("Mr");
        }


        if (utilisateur.getSignature() != null) {
            // Assuming you have a method to get base64 from your Signature entity
            // userDto.setSignImageBase64(utilisateur.getSignature().getBase64Content());
        }

        userDto.setCreatedAt(utilisateur.getCreatedAt());
        userDto.setUpdatedAt(utilisateur.getUpdatedAt());

        return userDto;
    }

    public void updateUtilisateur(Utilisateur utilisateur, SignatureUserDto userDto) {
        if (utilisateur == null || userDto == null) {
            return;
        }

        if (userDto.getFirstName() != null) {
            utilisateur.setPrenom(userDto.getFirstName());
        }
        if (userDto.getLastName() != null) {
            utilisateur.setNom(userDto.getLastName());
        }
        if (userDto.getPhone() != null) {
            utilisateur.setTelephone(userDto.getPhone());
        }
        if (userDto.getEmail() != null) {
            utilisateur.setEmail(userDto.getEmail());
        }
        if (userDto.getUsername() != null) {
            utilisateur.setUsername(userDto.getUsername());
        }

        if (userDto.getSignImageBase64() != null) {
            // You'll need to implement the logic to update the signature
            // based on your Signature entity structure
        }
    }
}
