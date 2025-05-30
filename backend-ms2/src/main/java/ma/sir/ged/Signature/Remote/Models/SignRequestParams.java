package ma.sir.ged.Signature.Remote.Models;

import lombok.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignRequestParams {
    @JsonProperty("pdSignatureFieldName")
    private String pdSignatureFieldName;

    @JsonProperty("signImageNumber")
    private Integer signImageNumber;

    @JsonProperty("signPageNumber")
    private Integer signPageNumber;

    @JsonProperty("signDocumentNumber")
    private Integer signDocumentNumber;

    @JsonProperty("signWidth")
    private Integer signWidth;

    @JsonProperty("signHeight")
    private Integer signHeight;

    @JsonProperty("xPos")
    private Integer xPos;

    @JsonProperty("yPos")
    private Integer yPos;

    @JsonProperty("extraText")
    private String extraText;

    @JsonProperty("allPages")
    private Boolean allPages;

    @JsonProperty("addImage")
    private Boolean addImage;

    @JsonProperty("addExtra")
    private Boolean addExtra;

    @JsonProperty("extraType")
    private Boolean extraType;

    @JsonProperty("extraName")
    private Boolean extraName;

    @JsonProperty("extraDate")
    private Boolean extraDate;

    @JsonProperty("extraOnTop")
    private Boolean extraOnTop;

    @JsonProperty("extraWidth")
    private Integer extraWidth;

    @JsonProperty("extraHeight")
    private Integer extraHeight;

    @JsonProperty("textPart")
    private String textPart;

    @JsonProperty("signScale")
    private Double signScale;

    @JsonProperty("red")
    private Integer red;

    @JsonProperty("green")
    private Integer green;

    @JsonProperty("blue")
    private Integer blue;

    @JsonProperty("fontSize")
    private Integer fontSize;

    @JsonProperty("comment")
    private String comment;

    @JsonProperty("restoreExtra")
    private Boolean restoreExtra;

    @JsonProperty("qrCodeUrl")
    private String qrCodeUrl;

    public static SignRequestParams getDefaultParams() {
        return SignRequestParams.builder()
                .pdSignatureFieldName("SignatureField1")
                .signImageNumber(1)
                .signPageNumber(1)
                .signDocumentNumber(1)
                .signWidth(450)
                .signHeight(85)
                .xPos(50)
                .yPos(950)
                .allPages(true)
                .addImage(false)
                .addExtra(true)
                .extraType(false)
                .extraName(true)
                .extraDate(true)
                .extraOnTop(false)
                .extraWidth(90)
                .extraHeight(70)
                .textPart("part")
                .signScale(1.2)
                .red(0)
                .green(0)
                .blue(0)
                .fontSize(12)
                .comment("This is a comment.")
                .restoreExtra(false)
                .qrCodeUrl("")
                .build();
    }
}