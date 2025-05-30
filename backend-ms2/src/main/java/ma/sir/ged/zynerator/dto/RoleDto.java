package ma.sir.ged.zynerator.dto;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class RoleDto {
    private Long id;
    private Date updatedAt;
    private String authority;
    private String label;
    private Date createdAt;
    private List<Long> permissions;

    @Override
    public String toString() {
        return "RoleDto{" +
                "id=" + id +
                ", updatedAt=" + updatedAt +
                ", authority='" + authority + '\'' +
                ", label='" + label + '\'' +
                ", createdAt=" + createdAt +
                ", permissions=" + permissions +
                '}';
    }
}
