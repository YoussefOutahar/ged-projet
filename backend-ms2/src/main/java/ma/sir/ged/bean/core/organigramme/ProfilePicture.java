package ma.sir.ged.bean.core.organigramme;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.Date;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class ProfilePicture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Lob
    private Blob image;

    @JsonBackReference
    @OneToOne(mappedBy = "profilePicture")
    private Utilisateur utilisateur;

    private Date date = new Date();

    public byte[] getImageBytes() {
        try {
            if (this.image != null) {
                return this.image.getBytes(1, (int) this.image.length());
            } else {
                return null;
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error reading blob to byte array", e);
        }
    }
}
