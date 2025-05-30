package ma.sir.ged.Signature.PdfStampingServices;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.batik.transcoder.TranscoderException;
import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.batik.transcoder.image.PNGTranscoder;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;

public class SvgToImageConverter {
    public static BufferedImage convertSvgToPng(String svgData) throws TranscoderException, IOException {
        PNGTranscoder transcoder = new PNGTranscoder();
        TranscoderInput input = new TranscoderInput(new ByteArrayInputStream(svgData.getBytes()));
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        TranscoderOutput output = new TranscoderOutput(outputStream);

        transcoder.transcode(input, output);

        outputStream.flush();
        ByteArrayInputStream inputStream = new ByteArrayInputStream(outputStream.toByteArray());
        return javax.imageio.ImageIO.read(inputStream);
    }

    public static String extractSvgData(String jsonString) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(jsonString);
        return rootNode.path("svgData").asText();
    }

    public static void savePngImage(ByteArrayOutputStream outputStream, String filePath) throws IOException {
        ByteArrayInputStream inputStream = new ByteArrayInputStream(outputStream.toByteArray());
        BufferedImage image = ImageIO.read(inputStream);
        File outputFile = new File(filePath);
        ImageIO.write(image, "png", outputFile);
    }
}
