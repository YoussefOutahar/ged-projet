package ma.sir.ged.ws.dto.dashboard;

public class AdminEntityStatsDetailDTO {
    private String type;
    private Long count;

    public AdminEntityStatsDetailDTO(String type, Long count) {
        this.type = type;
        this.count = count;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}
