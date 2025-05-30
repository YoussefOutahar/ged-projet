package ma.sir.ged.Email.MailRequests;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class PlainTextMailRequest extends MailRequest {
    private String title;
    private Long senderId;
}
