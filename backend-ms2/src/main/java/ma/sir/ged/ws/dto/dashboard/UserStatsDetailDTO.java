package ma.sir.ged.ws.dto.dashboard;

public class UserStatsDetailDTO {
    private String role;
    private Long count;

    public UserStatsDetailDTO(String role, Long count) {
        this.role = role;
        this.count = count;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}
