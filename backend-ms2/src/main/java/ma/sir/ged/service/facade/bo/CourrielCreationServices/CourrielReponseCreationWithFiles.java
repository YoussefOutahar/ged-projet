package ma.sir.ged.service.facade.bo.CourrielCreationServices;

import ma.sir.ged.bean.core.bureauOrdre.CourrielBo;
import ma.sir.ged.dao.facade.core.bureauOrdre.CourrielsRepository;
import ma.sir.ged.service.exception.RessourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityManager;
import java.time.LocalDateTime;
import java.util.List;

@Component(CourrielCreationTypes.COURRIEL_REPONSE_CREATION_WITH_FILES)
public class CourrielReponseCreationWithFiles implements CourrielCreationInterface{

    @Autowired
    private CourrielCreationUtils courrielCreationUtils;

    @Autowired
    private CourrielsRepository courrielsRepository;

    @Autowired
    private EntityManager entityManager;

    @Override
    public CourrielBo createCourriel(Long id, CourrielBo courrielBo, List<MultipartFile> files) {
        courrielBo.setDateCreation(LocalDateTime.now());
        courrielBo.setUpdatedOn(LocalDateTime.now());
        CourrielBo courrielPere = courrielsRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Courriel avec l'ID " + id + " n'a pas été trouvé."));

        courrielCreationUtils.handleExistingCourrielDocs(courrielBo);
        entityManager.persist(courrielBo);

        courrielCreationUtils.handleCourrielIntervenants(courrielBo);

        courrielBo.setPere(courrielPere);
        courrielPere.setReponse(courrielBo);
        CourrielBo afterSaveCourriel = courrielsRepository.save(courrielPere);

        courrielCreationUtils.handleNumeroCourriel(courrielBo);

        courrielCreationUtils.handleCourrielHistory(courrielBo, courrielPere,"Courriel Créé","Courriel Reponse Ajouter");
        return afterSaveCourriel;
    }
}
