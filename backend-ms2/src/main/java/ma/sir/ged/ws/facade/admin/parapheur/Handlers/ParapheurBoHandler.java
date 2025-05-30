package ma.sir.ged.ws.facade.admin.parapheur.Handlers;

import ma.sir.ged.dao.facade.core.doc.DocumentDao;
import ma.sir.ged.service.facade.bo.IntervenantsCourrielService;
import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ParapheurBoHandler {

    @Autowired
    private DocumentDao dao;

    @Autowired
    private IntervenantsCourrielService intervenantsCourrielService;

    @Transactional
    public ResponseEntity<Void> handleBoSignedDocument(Long id) {
        if(dao.signDocument(id)==0){
            throw new ResourceNotFoundException("No Document found with this id ");
        }
        intervenantsCourrielService.handleDocumentSigned(id);
        return ResponseEntity.ok().build();
    }
}
