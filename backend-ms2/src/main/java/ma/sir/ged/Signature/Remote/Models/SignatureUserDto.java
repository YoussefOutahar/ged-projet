package ma.sir.ged.Signature.Remote.Models;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SignatureUserDto {
    private String id;
    private String gedIdentifier;
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private String userType;
    private String signImageBase64;
    private String certificateId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean enabled;
    private String username;
    private String password;
    private Integer defaultSignImageNumber;
    private String ip;
    private String keystoreFileId;
    private String keystoreFileName;
    private String signImagesIds;
    private String userShareId;
    private String emailAlertFrequency;
    private Integer emailAlertHour;
//    private Integer emailAlertDay;
//    private LocalDateTime lastSendAlertDate;
//    private LocalDateTime replaceBeginDate;
//    private LocalDateTime replaceEndDate;
    private String favoriteSignRequestParams;
    private Boolean returnToHomeAfterSign;
    private Boolean forceSms;
    private String civilityTitle;
}
