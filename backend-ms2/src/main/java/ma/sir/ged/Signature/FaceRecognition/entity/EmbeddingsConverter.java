package ma.sir.ged.Signature.FaceRecognition.entity;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.util.List;

@Converter
public class EmbeddingsConverter implements AttributeConverter<List<float[]>, String> {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<float[]> attribute) {
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (Exception e) {
            throw new RuntimeException("Could not convert map to JSON string.", e);
        }
    }

    @Override
    public List<float[]> convertToEntityAttribute(String dbData) {
        try {
            return objectMapper.readValue(dbData, new TypeReference<List<float[]>>() {});
        } catch (Exception e) {
            throw new RuntimeException("Could not convert JSON string to map.", e);
        }
    }
}
