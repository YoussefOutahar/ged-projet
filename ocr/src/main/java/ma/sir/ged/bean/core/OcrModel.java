package ma.sir.ged.bean.core;


import org.springframework.web.multipart.MultipartFile;


public class OcrModel {
    private String destinationLanguage;

    private MultipartFile file;

    public OcrModel() {
    }

    public OcrModel(String destinationLanguage, MultipartFile file) {
        this.destinationLanguage = destinationLanguage;
        this.file = file;

    }

    public String getDestinationLanguage() {
        return destinationLanguage;
    }

    public void setDestinationLanguage(String destinationLanguage) {
        this.destinationLanguage = destinationLanguage;
    }

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }
}
