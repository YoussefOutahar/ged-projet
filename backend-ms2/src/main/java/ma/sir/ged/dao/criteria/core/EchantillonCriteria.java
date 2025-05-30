package ma.sir.ged.dao.criteria.core;

import ma.sir.ged.zynerator.criteria.BaseCriteria;

public class EchantillonCriteria extends BaseCriteria {
    private String nomEchantillon;
    private String nomEchantillonLike;

    public String getNomEchantillon() {
        return nomEchantillon;
    }

    public void setNomEchantillon(String nomEchantillon) {
        this.nomEchantillon = nomEchantillon;
    }

    public String getNomEchantillonLike() {
        return nomEchantillonLike;
    }

    public void setNomEchantillonLike(String nomEchantillonLike) {
        this.nomEchantillonLike = nomEchantillonLike;
    }
}
