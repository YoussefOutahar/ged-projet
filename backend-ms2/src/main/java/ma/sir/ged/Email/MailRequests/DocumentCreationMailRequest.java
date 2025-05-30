package ma.sir.ged.Email.MailRequests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DocumentCreationMailRequest extends MailRequest{
    private Long senderId;
    private Long documentId;
}
