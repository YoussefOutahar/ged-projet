package ma.sir.ged.service.facade.bo.CourrielCreationServices;

import ma.sir.ged.Email.EmailService;
import ma.sir.ged.WebSocket.UseCases.NotificationCourriel;
import ma.sir.ged.bean.core.bureauOrdre.CourrielBo;
import ma.sir.ged.dao.facade.core.bureauOrdre.CourrielsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Component(CourrielCreationTypes.COURRIEL_CREATION)
public class CourrielCreation implements CourrielCreationInterface{

    @Autowired
    private CourrielCreationUtils courrielCreationUtils;

    @Autowired
    private CourrielsRepository courrielsRepository;

    @Autowired
    private NotificationCourriel notificationCourriel;
    @Autowired
    private EmailService emailService;
    @Override
    public CourrielBo createCourriel(Long id, CourrielBo courrielBo, List<MultipartFile> files) {

        courrielCreationUtils.uploadCourrielDocs(files,courrielBo.getDocuments(),courrielBo);

        courrielBo.setDateCreation(LocalDateTime.now());
        courrielBo.setUpdatedOn(LocalDateTime.now());

        courrielCreationUtils.handleDocsCourriel(courrielBo);
        courrielCreationUtils.handleCourrielIntervenants(courrielBo);


        courrielsRepository.save(courrielBo);

        courrielCreationUtils.handleNumeroCourriel(courrielBo);


        courrielCreationUtils.handleCourrielHistory(courrielBo, null,"Courriel Créé",null);
        emailService.sendSimpleMessage("yandocsolution@gmail.com","Courrier crée","le courrier avec le numero"+courrielBo.getNumeroCourrier()+" a été crée");
        notificationCourriel.notifyCourrielCreation(courrielBo);
        return courrielBo;
    }
}
