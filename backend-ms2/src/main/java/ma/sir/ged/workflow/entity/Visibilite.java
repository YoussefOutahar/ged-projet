package ma.sir.ged.workflow.entity;


import lombok.Data;

import javax.persistence.*;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Data
public class Visibilite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long workflowId;

    @Column(nullable = false)
    private String utilisateurIds;




    public List<Long> getUtilisateurIdsList() {
        return Arrays.asList(utilisateurIds.split(",")).stream().map(Long::parseLong).collect(Collectors.toList());
    }

}
