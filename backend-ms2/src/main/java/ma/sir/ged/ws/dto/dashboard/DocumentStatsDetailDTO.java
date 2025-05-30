package ma.sir.ged.ws.dto.dashboard;

public class DocumentStatsDetailDTO {
    private String identifier; // Can be 'utilisateur' or 'entitéAdministrative'
    private MonthlyStatsDTO monthlyStats;

    public DocumentStatsDetailDTO(String identifier, MonthlyStatsDTO monthlyStats) {
        this.identifier = identifier;
        this.monthlyStats = monthlyStats;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public MonthlyStatsDTO getMonthlyStats() {
        return monthlyStats;
    }

    public void setMonthlyStats(MonthlyStatsDTO monthlyStats) {
        this.monthlyStats = monthlyStats;
    }
}

