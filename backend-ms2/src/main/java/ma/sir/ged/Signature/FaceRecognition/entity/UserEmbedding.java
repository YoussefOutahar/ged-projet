package ma.sir.ged.Signature.FaceRecognition.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
public class UserEmbedding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userName;

    @Lob
    @Convert(converter = EmbeddingsConverter.class)
    private List<float[]> embeddings;

    public UserEmbedding() {
    }

    public UserEmbedding(String userName, List<float[]> embeddings) {
        this.userName = userName;
        this.embeddings = embeddings;
    }
}
