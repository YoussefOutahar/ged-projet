package ma.sir.ged.service.facade.admin.client;

import ma.sir.ged.bean.core.client.Client;
import ma.sir.ged.dao.facade.core.client.ClientRepository;
import ma.sir.ged.service.exception.RessourceNotFoundException;
import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClientService {


        @Autowired
        private ClientRepository clientRepository;


        public Client getClientById(Long id) {
                return clientRepository.findById(id).orElseThrow(() -> new RessourceNotFoundException("No Client found with id " + id));
        }
        public Client getClientByCin(String cin) {
                Client client = clientRepository.findClientByCin(cin);
                if (client == null) {
                        throw new ResourceNotFoundException("No Client found with Cin " + cin);
                }
                return client;
        }
}
