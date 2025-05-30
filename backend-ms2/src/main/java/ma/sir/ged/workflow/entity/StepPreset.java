package ma.sir.ged.workflow.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import ma.sir.ged.workflow.entity.enums.ACTION;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
public class StepPreset {
    @Id
    @GeneratedValue
    private Long id;
    private String title;
    private int level;
    private Long duration;
    private String description;

    @JsonBackReference
    @ManyToOne
    private WorkflowPreset workflowPreset;

    @JsonManagedReference
    @OneToMany(mappedBy = "stepPreset", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserDestinataire> destinataires;

    @ElementCollection(targetClass = ACTION.class)
    @Enumerated
    private List<ACTION> actions;

    private boolean addPV = false;

    @Override
    public String toString() {
        return "StepPreset{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", level=" + level +
                ", description='" + description + '\'' +
                '}';
    }


}
