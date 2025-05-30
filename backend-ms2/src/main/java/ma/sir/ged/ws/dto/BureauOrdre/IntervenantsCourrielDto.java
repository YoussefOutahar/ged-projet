package ma.sir.ged.ws.dto.BureauOrdre;

import lombok.Data;
import ma.sir.ged.ws.dto.DocumentDto;
import ma.sir.ged.ws.dto.UtilisateurDto;

import java.util.List;

@Data
public class IntervenantsCourrielDto {
    private Long id;
    private boolean isDone;
    private String commentaire;
    private String dateCreation;
    private String dateIntervention;

    private String statut;
    private String action;

    private List<UtilisateurDto> responsables;
    private UtilisateurDto intervenant;
    private UtilisateurDto createdBy;

    private List<DocumentDto> documents;
}
