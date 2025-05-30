package ma.sir.ged.Email.MailRequests;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class AccountCreationMailRequest extends MailRequest {
    private Long senderId;
    private Long accountId;
    private String accountPassword;
}

