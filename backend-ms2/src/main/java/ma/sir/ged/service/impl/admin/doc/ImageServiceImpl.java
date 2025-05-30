package ma.sir.ged.service.impl.admin.doc;

import ma.sir.ged.aop.util.ImageUtil;
import ma.sir.ged.bean.core.doc.Image;
import ma.sir.ged.dao.facade.core.doc.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.Optional;

import static com.itextpdf.kernel.pdf.PdfName.Image;

@Service
public class ImageServiceImpl {

    @Autowired
    private ImageRepository imageDataRepository;

    @Transactional
    public Image uploadImage(MultipartFile file) throws IOException {
        byte[] imageData = ImageUtil.compressImage(file.getBytes());
        Image image = new Image();
        image.setImageData(imageData);

        return imageDataRepository.save(image);
    }


    @Transactional
    public byte[] getImage(Long id) {
        Optional<Image> dbImage = imageDataRepository.findById(id);
        byte[] image = ImageUtil.decompressImage(dbImage.get().getImageData());
        return image;
    }
}
