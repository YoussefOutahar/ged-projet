package ma.sir.ged.ws.dto.dashboard;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MonthlyStatsDTO {
    @JsonProperty("1")
    private Long janvier;
    @JsonProperty("2")
    private Long fevrier;
    @JsonProperty("3")
    private Long mars;
    @JsonProperty("4")
    private Long avril;
    @JsonProperty("5")
    private Long mai;
    @JsonProperty("6")
    private Long juin;
    @JsonProperty("7")
    private Long juiellet;
    @JsonProperty("8")
    private Long aout;
    @JsonProperty("9")
    private Long september;
    @JsonProperty("10")
    private Long octobre;
    @JsonProperty("11")
    private Long novembre;
    @JsonProperty("12")
    private Long decembre;

    public Long getJanvier() {
        return janvier;
    }

    public void setJanvier(Long janvier) {
        this.janvier = janvier;
    }

    public Long getFevrier() {
        return fevrier;
    }

    public void setFevrier(Long fevrier) {
        this.fevrier = fevrier;
    }

    public Long getMars() {
        return mars;
    }

    public void setMars(Long mars) {
        this.mars = mars;
    }

    public Long getAvril() {
        return avril;
    }

    public void setAvril(Long avril) {
        this.avril = avril;
    }

    public Long getMai() {
        return mai;
    }

    public void setMai(Long mai) {
        this.mai = mai;
    }

    public Long getJuin() {
        return juin;
    }

    public void setJuin(Long juin) {
        this.juin = juin;
    }

    public Long getJuiellet() {
        return juiellet;
    }

    public void setJuiellet(Long juiellet) {
        this.juiellet = juiellet;
    }

    public Long getAout() {
        return aout;
    }

    public void setAout(Long aout) {
        this.aout = aout;
    }

    public Long getSeptember() {
        return september;
    }

    public void setSeptember(Long september) {
        this.september = september;
    }

    public Long getOctobre() {
        return octobre;
    }

    public void setOctobre(Long octobre) {
        this.octobre = octobre;
    }

    public Long getNovembre() {
        return novembre;
    }

    public void setNovembre(Long novembre) {
        this.novembre = novembre;
    }

    public Long getDecembre() {
        return decembre;
    }

    public void setDecembre(Long decembre) {
        this.decembre = decembre;
    }
}
