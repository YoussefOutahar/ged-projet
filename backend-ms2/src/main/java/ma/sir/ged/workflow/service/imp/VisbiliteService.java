package ma.sir.ged.workflow.service.imp;

import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.workflow.entity.Visibilite;
import ma.sir.ged.workflow.entity.WorkflowPreset;
import ma.sir.ged.workflow.repository.VisibiliteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VisbiliteService {

    @Autowired
    private VisibiliteRepository visibiliteRepository;

    public void create (Long workflowId, List<Utilisateur> user){
        for (Utilisateur u : user){
            Visibilite visibilite = new Visibilite();
            visibilite.setWorkflowId(workflowId);
            visibilite.setUtilisateurIds(u.getId().toString());
            visibiliteRepository.save(visibilite);
        }
    }

    public boolean canUserViewWorkflow(Long workflowId, Long userId) {
        boolean userCanView = false;
        List<Visibilite> visibilites = visibiliteRepository.findByWorkflowId(workflowId);
        for (Visibilite visibilite : visibilites) {
            if (visibilite.getUtilisateurIdsList().contains(userId)) {
                userCanView = true;
                break;
            }
        }
        return userCanView;
    }


}
