package ma.sir.ged.service.facade.bo.CourrielCreationServices;

import ma.sir.ged.WebSocket.UseCases.NotificationCourriel;
import ma.sir.ged.bean.core.bureauOrdre.CourrielBo;
import ma.sir.ged.dao.facade.core.bureauOrdre.CourrielsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityManager;
import java.time.LocalDateTime;
import java.util.List;

@Component(CourrielCreationTypes.COURRIEL_CREATION_WITH_FILES)
public class CourrielCreationWithFiles implements CourrielCreationInterface{

    @Autowired
    private CourrielCreationUtils courrielCreationUtils;

    @Autowired
    private CourrielsRepository courrielsRepository;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private NotificationCourriel notificationCourriel;

    @Override
    public CourrielBo createCourriel(Long id, CourrielBo courrielBo, List<MultipartFile> files) {
        courrielBo.setDateCreation(LocalDateTime.now());
        courrielBo.setUpdatedOn(LocalDateTime.now());

        courrielCreationUtils.handleExistingCourrielDocs(courrielBo);

        courrielCreationUtils.handleCourrielIntervenants(courrielBo);

        entityManager.persist(courrielBo);
        courrielsRepository.save(courrielBo);

        courrielCreationUtils.handleNumeroCourriel(courrielBo);

        courrielCreationUtils.handleCourrielHistory(courrielBo, null,"Courriel Créé",null);
        notificationCourriel.notifyCourrielCreation(courrielBo);
        return courrielBo;
    }
}
