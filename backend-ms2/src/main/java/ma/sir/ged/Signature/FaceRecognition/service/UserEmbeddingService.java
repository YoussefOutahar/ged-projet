package ma.sir.ged.Signature.FaceRecognition.service;


import ma.sir.ged.Signature.FaceRecognition.entity.UserEmbedding;
import ma.sir.ged.Signature.FaceRecognition.repository.UserEmbeddingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserEmbeddingService {
    private final UserEmbeddingRepository userEmbeddingRepository;

    @Autowired
    public UserEmbeddingService(UserEmbeddingRepository userEmbeddingRepository) {
        this.userEmbeddingRepository = userEmbeddingRepository;
    }

    public UserEmbedding saveUserEmbedding(UserEmbedding userEmbedding) {
        return userEmbeddingRepository.save(userEmbedding);
    }

    public Optional<UserEmbedding> getUserEmbeddingById(Long id) {
        return userEmbeddingRepository.findById(id);
    }

    public Optional<UserEmbedding> getUserEmbeddingByUserName(String userName) {
        return userEmbeddingRepository.findByUserName(userName);
    }

    public List<UserEmbedding> getAllUserEmbeddings() {
        return userEmbeddingRepository.findAll();
    }

    public UserEmbedding updateUserEmbedding(Long id, UserEmbedding updatedUserEmbedding) {
        return userEmbeddingRepository.findById(id)
                .map(userEmbedding -> {
                    userEmbedding.setUserName(updatedUserEmbedding.getUserName());
                    userEmbedding.setEmbeddings(updatedUserEmbedding.getEmbeddings());
                    return userEmbeddingRepository.save(userEmbedding);
                })
                .orElseGet(() -> {
                    updatedUserEmbedding.setId(id);
                    return userEmbeddingRepository.save(updatedUserEmbedding);
                });
    }

    public void deleteUserEmbedding(Long id) {
        userEmbeddingRepository.deleteById(id);
    }
}
