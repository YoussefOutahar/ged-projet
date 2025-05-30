package ma.sir.ged.ws.facade.admin.doc;

import com.itextpdf.html2pdf.HtmlConverter;
import ma.sir.ged.utils.pdfUtils.PdfUtils;
import org.docx4j.convert.in.xhtml.XHTMLImporterImpl;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URLDecoder;

@Controller
@RequestMapping("/api/admin/textEditor")
public class TextEditorController {

    @PostMapping("/convertToDocx")
    public ResponseEntity<byte[]> convertToDocx(@RequestBody String encodedHtml) {
        try {
            String decodedHtml = URLDecoder.decode(encodedHtml, "UTF-8");

            String wrappedHtml = "<html><head><meta charset=\"UTF-8\"></head><body>" + decodedHtml + "</body></html>";

            // Self-close void elements
            wrappedHtml = wrappedHtml.replaceAll("<area([^>]*?)>", "<area$1/>");
            wrappedHtml = wrappedHtml.replaceAll("<base([^>]*?)>", "<base$1/>");
            wrappedHtml = wrappedHtml.replaceAll("<br>", "<br/>");
            wrappedHtml = wrappedHtml.replaceAll("<col([^>]*?)>", "<col$1/>");
            wrappedHtml = wrappedHtml.replaceAll("<command([^>]*?)>", "<command$1/>");
            wrappedHtml = wrappedHtml.replaceAll("<embed([^>]*?)>", "<embed$1/>");
            wrappedHtml = wrappedHtml.replaceAll("<hr>", "<hr/>");
            wrappedHtml = wrappedHtml.replaceAll("<img([^>]*?)>", "<img$1/>");
            wrappedHtml = wrappedHtml.replaceAll("<input([^>]*?)>", "<input$1/>");
            wrappedHtml = wrappedHtml.replaceAll("<keygen([^>]*?)>", "<keygen$1/>");
            wrappedHtml = wrappedHtml.replaceAll("<link([^>]*?)>", "<link$1/>");
            wrappedHtml = wrappedHtml.replaceAll("<meta([^>]*?)>", "<meta$1/>");
            wrappedHtml = wrappedHtml.replaceAll("<param([^>]*?)>", "<param$1/>");
            wrappedHtml = wrappedHtml.replaceAll("<source([^>]*?)>", "<source$1/>");
            wrappedHtml = wrappedHtml.replaceAll("<track([^>]*?)>", "<track$1/>");
            wrappedHtml = wrappedHtml.replaceAll("<wbr>", "<wbr/>");

            // Convert HTML to Word
            WordprocessingMLPackage wordMLPackage = WordprocessingMLPackage.createPackage();
            XHTMLImporterImpl xhtmlImporter = new XHTMLImporterImpl(wordMLPackage);
            wordMLPackage.getMainDocumentPart().getContent().addAll(
                    xhtmlImporter.convert(wrappedHtml, null)
            );

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            wordMLPackage.save(outputStream);

            byte[] docxBytes = outputStream.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("filename", "output.docx");

            return new ResponseEntity<>(docxBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/convertToPdf")
    public ResponseEntity<byte[]> convertToPdf(@RequestBody String encodedHtml) {
        try {
            String decodedHtml = URLDecoder.decode(encodedHtml, "UTF-8");
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            HtmlConverter.convertToPdf(decodedHtml, outputStream);
            byte[] pdfBytes = outputStream.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("filename", "output.pdf");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping(value = "/convertToHtml")
    public ResponseEntity<String> convertToHtml(@RequestParam MultipartFile file) throws IOException {
        String html = PdfUtils.generateHtmlFromPdf(file.getInputStream());
        return ResponseEntity.ok(html);
    }

}
