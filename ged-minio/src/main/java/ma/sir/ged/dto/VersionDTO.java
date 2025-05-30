package ma.sir.ged.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public class VersionDTO {
    @Schema(name = "versionID", example = "b72fb124-6d6c-4642-86f3-a380791c91cd")
    String versionId;
    @Schema(name = "version number", example = "1")
    Integer versionNumber;

    public VersionDTO(String versionId, Integer versionNumber) {
        this.versionId = versionId;
        this.versionNumber = versionNumber;
    }

    public String getVersionId() {
        return versionId;
    }

    public void setVersionId(String versionId) {
        this.versionId = versionId;
    }

    public Integer getVersionNumber() {
        return versionNumber;
    }

    public void setVersionNumber(Integer versionNumber) {
        this.versionNumber = versionNumber;
    }
}
