package ma.sir.ged.Signature.QrCode.controller;

import com.google.zxing.WriterException;
import ma.sir.ged.Signature.QrCode.service.QRCodeService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("api/qrcode")
public class QRCodeController {

    private final QRCodeService qrcodeService;

    @Value("${app.qrcode.width}")
    private int qrcodeWidth;

    @Value("${app.qrcode.height}")
    private int qrcodeHeight;

    public QRCodeController(QRCodeService qrcodeService) {
        this.qrcodeService = qrcodeService;
    }

    @GetMapping("/generate-qrcode")
    public ResponseEntity<byte[]> generateQRCode() {
        try {
            byte[] qrCodeImage = qrcodeService.generateQRCode("text", qrcodeWidth, qrcodeHeight);
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_TYPE, "image/png");
            return new ResponseEntity<>(qrCodeImage, headers, HttpStatus.OK);
        } catch (WriterException | IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

//    @PostMapping("/add-qr-code")
//    public ResponseEntity<byte[]> addQrCodeToPdf(
//            @RequestBody MultipartFile pdfFile,
//            @RequestParam String text,
//            @RequestParam("x") int x,
//            @RequestParam("y") int y) {
//        try {
//            byte[] originalPdf = pdfFile.getBytes();
//            byte[] barcodeImage = qrcodeService.generateQRCode(text,qrcodeWidth,qrcodeHeight);
//            byte[] newPdf = qrcodeService.addQrCodeToPdf(originalPdf, barcodeImage, x, y);
//            HttpHeaders headers = new HttpHeaders();
//            headers.add(HttpHeaders.CONTENT_TYPE, "application/pdf");
//            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + pdfFile.getOriginalFilename());
//            return new ResponseEntity<>(newPdf, headers, HttpStatus.OK);
//        } catch (IOException | WriterException e ) {
//            e.printStackTrace();
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
}
