package ma.sir.ged.ws.dto.dashboard;

import java.util.List;

public class AdminEntityStatsResponseDTO {
    private Long totalCount;
    private List<AdminEntityStatsDetailDTO> detail;

    public AdminEntityStatsResponseDTO(Long totalCount, List<AdminEntityStatsDetailDTO> detail) {
        this.totalCount = totalCount;
        this.detail = detail;
    }

    public Long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(Long totalCount) {
        this.totalCount = totalCount;
    }

    public List<AdminEntityStatsDetailDTO> getDetail() {
        return detail;
    }

    public void setDetail(List<AdminEntityStatsDetailDTO> detail) {
        this.detail = detail;
    }
}
