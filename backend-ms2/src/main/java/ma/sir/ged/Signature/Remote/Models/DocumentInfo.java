package ma.sir.ged.Signature.Remote.Models;

import lombok.Data;

import java.util.Date;

@Data
public class DocumentInfo {
    private Long id;
    private String fileName;
    private Long size;
    private Integer nbPages;
    private Long parentId;
    private String contentType;
    private String pdfaCheck;
    private DocumentInfo verificationXmlId;  // Self-referential for the verification XML
    private String createBy;
    private Date createDate;
    private Object transientInputStream;
}
