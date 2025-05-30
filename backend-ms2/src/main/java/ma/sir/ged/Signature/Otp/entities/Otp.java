package ma.sir.ged.Signature.Otp.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import ma.sir.ged.utils.StringMapConverter;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table
@Data
public class Otp extends AuditBusinessObject {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @JsonIgnore
    private String otp;

    private String username;

    private LocalDateTime expirationTime;

    private boolean isUsed=false;

    @Lob
    @Convert(converter = StringMapConverter.class)
    private Map<String, String> metadata;

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public boolean isUsed() {
        return isUsed;
    }

    public void setUsed(boolean used) {
        isUsed = used;
    }
}
