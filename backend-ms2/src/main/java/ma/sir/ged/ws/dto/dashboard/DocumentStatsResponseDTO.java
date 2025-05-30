package ma.sir.ged.ws.dto.dashboard;

import java.util.List;

public class DocumentStatsResponseDTO {
    private Long totalCount;
    private List<DocumentStatsDetailDTO> detail;

    public DocumentStatsResponseDTO(Long totalCount, List<DocumentStatsDetailDTO> detail) {
        this.totalCount = totalCount;
        this.detail = detail;
    }

    public Long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(Long totalCount) {
        this.totalCount = totalCount;
    }

    public List<DocumentStatsDetailDTO> getDetail() {
        return detail;
    }

    public void setDetail(List<DocumentStatsDetailDTO> detail) {
        this.detail = detail;
    }
}
