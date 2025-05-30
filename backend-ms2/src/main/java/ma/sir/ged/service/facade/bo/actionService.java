package ma.sir.ged.service.facade.bo;

import ma.sir.ged.bean.core.bureauOrdre.ActionsBo;
import ma.sir.ged.dao.facade.core.bureauOrdre.ActionsRepository;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class actionService {
    @Autowired
    private ActionsRepository actionsRepository;

    public List<ActionsBo> getAllActions() {
        return CollectionUtils.emptyIfNull(actionsRepository.findAll()).stream().collect(Collectors.toList());
    }
    public ResponseEntity<ActionsBo> createAction(ActionsBo actionsBo) {
        if (actionsRepository.findByLibelleIgnoreCaseAndRemoveSpecialChars(actionsBo.getLibelle()).isPresent()){
            return new ResponseEntity<>(HttpStatus.IM_USED); }
        actionsRepository.save(actionsBo);
        return new ResponseEntity<>(actionsBo, HttpStatus.CREATED);
    }

}
