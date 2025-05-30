package ma.sir.ged.bean.history;

import ma.sir.ged.zynerator.history.HistBusinessObject;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

public class EchantillonHistory extends HistBusinessObject {

    public EchantillonHistory() {
        super();
    }

    public EchantillonHistory (Long id) {
        super(id);
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }
}
