package ma.sir.ged.dao.facade.core.client;

import ma.sir.ged.bean.core.client.Client;
import ma.sir.ged.zynerator.repository.AbstractRepository;

public interface ClientRepository extends AbstractRepository<Client, Long> {
    Client findClientByCin(String cin);
}
