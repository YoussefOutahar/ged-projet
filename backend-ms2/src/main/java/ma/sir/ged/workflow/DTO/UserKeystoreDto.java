package ma.sir.ged.workflow.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserKeystoreDto {
        private String id;
        private String alias;
        private String password;
        private String passwordHash;
        private Date createDate;
        private Date expireDate;
        private String keystoreFileName;
        private Set<String> roles;
}
