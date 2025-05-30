package ma.sir.ged.Signature.FaceRecognition.service;

import ma.sir.ged.Signature.FaceRecognition.entity.UserEmbedding;
import ma.sir.ged.utils.LoggingUtils.TimeLogger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
//import org.tensorflow.Graph;
//import org.tensorflow.Session;
//import org.tensorflow.Tensor;
//import org.tensorflow.Tensors;

import javax.annotation.PostConstruct;
import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.FloatBuffer;
import java.nio.file.Files;
import java.util.*;
import java.util.List;

@Service
public class FaceRecognitionService {

//    private static final Logger logger = LoggerFactory.getLogger(FaceRecognitionService.class);
//    private Graph graph;
//    private Session session;
//
//    @Autowired
//    private UserEmbeddingService userEmbeddingService;
//
//    @PostConstruct
//    public void init() throws IOException {
////        if (graph == null || session == null) {
////            synchronized (FaceRecognitionService.class) {
////                if (graph == null || session == null) {
////                    ClassPathResource resource = new ClassPathResource("FaceRecognitionModel/20180402-114759/20180402-114759.pb");
////                    byte[] graphDef = Files.readAllBytes(resource.getFile().toPath());
////                    graph = new Graph();
////                    graph.importGraphDef(graphDef);
////                    session = new Session(graph);
////                    logger.info("TensorFlow model loaded successfully.");
////                }
////            }
////        }
//    }
//
//    public float[] recognizeFace(byte[] imageBytes) {
//        try {
//            BufferedImage image = ImageIO.read(new ByteArrayInputStream(imageBytes));
//            BufferedImage resizedImage = resizeImage(image, 160, 160);
//            float[] imageData = normalizeImage(resizedImage);
//
//            try (Tensor<Float> inputTensor = Tensor.create(new long[]{1, 160, 160, 3}, FloatBuffer.wrap(imageData));
//                 Tensor<Boolean> phaseTrainTensor = Tensors.create(false)) {
//
//                List<Tensor<?>> outputs = session.runner()
//                        .feed("input", inputTensor)
//                        .feed("phase_train", phaseTrainTensor)
//                        .fetch("embeddings")
//                        .run();
//
//                float[][] embeddings2D = new float[1][512];
//                outputs.get(0).copyTo(embeddings2D);
//                return embeddings2D[0];
//            }
//        } catch (IOException e) {
//            logger.error("Error processing image for face recognition", e);
//            return null;
//        }
//    }
//
//    public String addFace(byte[] imageBytes, String userName) throws IOException {
//        float[] embeddings = recognizeFace(imageBytes);
//
//        UserEmbedding userEmbedding = userEmbeddingService.getUserEmbeddingByUserName(userName)
//                .orElse(new UserEmbedding(userName, new ArrayList<>()));
//
//        userEmbedding.getEmbeddings().add(embeddings);
//
//        userEmbeddingService.saveUserEmbedding(userEmbedding);
//        return userName;
//    }
//
//    public String addFaceStream(List<byte[]> imageBytesList, String userName) {
//        TimeLogger timeLogger = new TimeLogger();
//        timeLogger.startLogging("Adding face for user " + userName);
//        List<float[]> embeddingsList = new ArrayList<>();
//        for (byte[] imageBytes : imageBytesList) {
//            float[] embeddings = recognizeFace(imageBytes);
//            embeddingsList.add(embeddings);
//        }
//        UserEmbedding userEmbedding = userEmbeddingService.getUserEmbeddingByUserName(userName)
//                .orElse(new UserEmbedding(userName, new ArrayList<>()));
//
//        userEmbedding.getEmbeddings().addAll(embeddingsList);
//
//        userEmbeddingService.saveUserEmbedding(userEmbedding);
//        timeLogger.endLogging("Face added for user " + userName);
//        return userName;
//    }
//
//    public String identifyFace(byte[] imageBytes) throws IOException {
//        float[] embeddings = recognizeFace(imageBytes);
//        String identifiedUserName = "Unknown";
//        double highestSimilarity = -1;
//
//        List<UserEmbedding> allUserEmbeddings = userEmbeddingService.getAllUserEmbeddings();
//
//        logger.info("Checking user against {} stored embeddings", allUserEmbeddings.size());
//
//        for (UserEmbedding userEmbedding : allUserEmbeddings) {
//
//            logger.info("Identifying user {} with {} embeddings", userEmbedding.getUserName(), userEmbedding.getEmbeddings().size());
//
//            for (float[] storedEmbeddings : userEmbedding.getEmbeddings()) {
//
//                double similarity = cosineSimilarity(embeddings, storedEmbeddings);
//
//                logger.info("Similarity with {}: {}", userEmbedding.getUserName(), similarity);
//
//                if (similarity > highestSimilarity) {
//                    highestSimilarity = similarity;
//                    identifiedUserName = userEmbedding.getUserName();
//                }
//            }
//        }
//
//        logger.info("Highest similarity: {}", highestSimilarity);
//
//        if (highestSimilarity > 0.8) {
//            addFace(imageBytes, identifiedUserName);
//        }
//
//        if (highestSimilarity > 0.7) {
//            return identifiedUserName;
//        } else {
//            return "Unknown";
//        }
//    }
//
//    private double cosineSimilarity(float[] vectorA, float[] vectorB) {
//        double dotProduct = 0.0;
//        double normA = 0.0;
//        double normB = 0.0;
//        for (int i = 0; i < vectorA.length; i++) {
//            dotProduct += vectorA[i] * vectorB[i];
//            normA += Math.pow(vectorA[i], 2);
//            normB += Math.pow(vectorB[i], 2);
//        }
//        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
//    }
//
//    private BufferedImage resizeImage(BufferedImage originalImage, int targetWidth, int targetHeight) {
//        Image resultingImage = originalImage.getScaledInstance(targetWidth, targetHeight, Image.SCALE_SMOOTH);
//        BufferedImage outputImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
//        Graphics2D g = outputImage.createGraphics();
//        g.drawImage(resultingImage, 0, 0, null);
//        g.dispose();
//        return outputImage;
//    }
//
//    private float[] normalizeImage(BufferedImage image) {
//        int width = image.getWidth();
//        int height = image.getHeight();
//        float[] normalizedPixels = new float[width * height * 3];
//        int[] rgbArray = new int[width * height];
//        image.getRGB(0, 0, width, height, rgbArray, 0, width);
//        for (int i = 0; i < rgbArray.length; i++) {
//            int pixel = rgbArray[i];
//            normalizedPixels[i * 3] = ((pixel >> 16) & 0xFF) / 255.0f; // Red
//            normalizedPixels[i * 3 + 1] = ((pixel >> 8) & 0xFF) / 255.0f; // Green
//            normalizedPixels[i * 3 + 2] = (pixel & 0xFF) / 255.0f; // Blue
//        }
//        return normalizedPixels;
//    }
}