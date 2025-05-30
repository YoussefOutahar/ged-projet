package ma.sir.ged.bean.core.parapheur;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
public class ParapheurComment extends AuditBusinessObject {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String content;
    private Boolean seen = false;

    @ManyToOne
    private Utilisateur utilisateur;

    @ManyToOne
    @JoinColumn(name = "parapheur_bo_id")
    @JsonBackReference
    private ParapheurBo parapheurBo;

    @ElementCollection
    @CollectionTable(name = "comment_seen_by_users", joinColumns = @JoinColumn(name = "comment_id"))
    @Column(name = "user_id")
    private Set<Long> seenByUserIds = new HashSet<>();

    public boolean isSeenByUser(Long userId) {
        return seenByUserIds.contains(userId);
    }

    public void markAsSeenByUser(Long userId) {
        seenByUserIds.add(userId);
    }
}
