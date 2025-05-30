package ma.sir.ged.service.facade.admin.organigramme;

import ma.sir.ged.bean.core.organigramme.EntiteAdministrative;
import ma.sir.ged.dao.facade.core.organigramme.EntiteAdministrativeDao;
import ma.sir.ged.ws.dto.OrganigramElement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class GraphBuilder {
    @Autowired
    private EntiteAdministrativeDao dao;

    public OrganigramElement buildGraph() {
        List<EntiteAdministrative> allEntities = dao.findAll();
        Map<EntiteAdministrative, List<EntiteAdministrative>> graph = new HashMap<>();
        for (EntiteAdministrative entity : allEntities) {
            EntiteAdministrative parent = entity.getEntiteAdministrativeParent();
            if (parent != null) {
                graph.computeIfAbsent(parent, k -> new ArrayList<>()).add(entity);
            } else {
                graph.putIfAbsent(entity, new ArrayList<>());
            }
        }

        return convertToJsonObject(findHead(allEntities), graph);
    }
    private EntiteAdministrative findHead(List<EntiteAdministrative> allEntities){
        return allEntities.stream()
                .filter(ent -> Objects.isNull(ent.getEntiteAdministrativeParent()))
                .findFirst()
                .orElse(null);
    }
    public OrganigramElement convertToJsonObject(EntiteAdministrative head, Map<EntiteAdministrative, List<EntiteAdministrative>> graph) {
        if (head == null)
            return null;
        OrganigramElement organigramNode = buildInfo(head);
        List<OrganigramElement> childrenOrganigram = new ArrayList<>();
        if (graph.containsKey(head)) {
            for (EntiteAdministrative child : graph.get(head)) {
                childrenOrganigram.add(convertToJsonObject(child, graph));
            }
        }
        organigramNode.setChildren(childrenOrganigram);
        return organigramNode;
    }

    private OrganigramElement buildInfo(EntiteAdministrative head){
        OrganigramElement organigramNode = new OrganigramElement();
        organigramNode.setId(head.getId());
        organigramNode.setCode(head.getCode());
        organigramNode.setReferenceGed(head.getReferenceGed());
        organigramNode.setDescription(head.getDescription());
        organigramNode.setLibelle(head.getLibelle());
        organigramNode.setArchiveLawDuration(head.getArchiveLawDuration());
        if(Objects.nonNull(head.getChef())){
            OrganigramElement.UtilisateurInfo userInfo = new OrganigramElement.UtilisateurInfo();
            userInfo.setId(head.getChef().getId());
            userInfo.setNom(head.getChef().getNom());
            userInfo.setPrenom(head.getChef().getPrenom());
            organigramNode.setUtilisateurInfo(userInfo);
        }
        if(Objects.nonNull(head.getEntiteAdministrativeType())){
            OrganigramElement.EntityAdminTypeInfo entityAdminTypeInfo = new OrganigramElement.EntityAdminTypeInfo();
            entityAdminTypeInfo.setId(head.getEntiteAdministrativeType().getId());
            entityAdminTypeInfo.setLibelle(head.getEntiteAdministrativeType().getLibelle());
            entityAdminTypeInfo.setCode(head.getEntiteAdministrativeType().getCode());
            entityAdminTypeInfo.setDescription(head.getEntiteAdministrativeType().getDescription());
            entityAdminTypeInfo.setRang(head.getEntiteAdministrativeType().getRang());

            organigramNode.setEntityAdminTypeInfo(entityAdminTypeInfo);
        }
        return organigramNode;
    }
}
