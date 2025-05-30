package ma.sir.ged.ws.dto.dashboard;

import java.util.List;

public class UserStatsResponseDTO {
    private Long totalCount;
    private List<UserStatsDetailDTO> detail;


    public UserStatsResponseDTO(Long totalCount, List<UserStatsDetailDTO> detail) {
        this.totalCount = totalCount;
        this.detail = detail;
    }

    public Long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(Long totalCount) {
        this.totalCount = totalCount;
    }

    public List<UserStatsDetailDTO> getDetail() {
        return detail;
    }

    public void setDetail(List<UserStatsDetailDTO> detail) {
        this.detail = detail;
    }
}
