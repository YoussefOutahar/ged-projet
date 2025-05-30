package ma.sir.ged.Signature.FaceRecognition.repository;


import ma.sir.ged.Signature.FaceRecognition.entity.UserEmbedding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserEmbeddingRepository extends JpaRepository<UserEmbedding, Long> {
    Optional<UserEmbedding> findByUserName(String userName);
}
