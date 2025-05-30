package ma.sir.ged.ws.facade.client;

import ma.sir.ged.bean.core.client.Client;
import ma.sir.ged.service.facade.admin.client.ClientService;
import ma.sir.ged.service.facade.admin.parapheur.ParapheurService;
import ma.sir.ged.ws.dto.ParapheurDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/client")
public class ClientController {
    @Autowired
    private ClientService clientService;
    @GetMapping("/{id}")
    public ResponseEntity<Client> getClient(@PathVariable String id) {
        Client client = clientService.getClientByCin(id);
        if (client != null) {
            return new ResponseEntity<>(client, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}

