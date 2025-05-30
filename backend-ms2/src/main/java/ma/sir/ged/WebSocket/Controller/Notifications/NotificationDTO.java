package ma.sir.ged.WebSocket.Controller.Notifications;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NotificationDTO {
    private Long id;
    private String summary;
    private String detail;
    private String severity;
    private Long sender;
    private boolean isRead;
    private boolean isDismissed;
    private String createdAt;
}
