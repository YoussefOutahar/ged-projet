package ma.sir.ged.ws.facade.admin.Barcode;

import com.google.zxing.WriterException;
import com.google.zxing.NotFoundException;
import ma.sir.ged.service.facade.admin.Barcode.BarcodeService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;

@RestController
@RequestMapping("api/barcode")
public class BarcodeController {
    private BarcodeService barcodeService;


    public BarcodeController(BarcodeService barcodeService) {
        this.barcodeService = barcodeService;
    }

    @GetMapping("/generate-barecode")
    public ResponseEntity<byte[]> generateBarcode(@RequestParam String text) {
        try {
            byte[] barcodeImage = barcodeService.generateBarcode(text, 300, 100);
            HttpHeaders headers = barcodeService.getHttpHeadersForImage();
            return new ResponseEntity<>(barcodeImage,headers , HttpStatus.OK);
        } catch (WriterException | IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/read-barecode")
    public ResponseEntity<String> readBarcode(@RequestBody MultipartFile file) {
        try {
            BufferedImage bufferedImage = ImageIO.read(file.getInputStream());
            String barcodeText = barcodeService.readBarcode(bufferedImage);
            return new ResponseEntity<>(barcodeText, HttpStatus.OK);
        } catch (IOException | NotFoundException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
