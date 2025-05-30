package ma.sir.ged.bean.core.doc;

import ma.sir.ged.zynerator.audit.AuditBusinessObject;

import javax.persistence.*;

@Entity
@Table(name = "archiveyears")
public class ArchiveYears extends AuditBusinessObject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer year;
    public ArchiveYears() {}

    public ArchiveYears(Long id, Integer year) {
        this.id = id;
        this.year = year;
    }

    public Long getId() {
        return id;
    }

    public Integer getYear() {
        return year;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setYear(Integer year) {
        this.year = year;
    }
}



