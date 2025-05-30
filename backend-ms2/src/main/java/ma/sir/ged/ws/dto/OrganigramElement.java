package ma.sir.ged.ws.dto;

import java.util.List;

public class OrganigramElement {
    private Long id;
    private String code;
    private String referenceGed;
    private String description;
    private String libelle;
    private Integer archiveLawDuration;
    UtilisateurInfo utilisateurInfo;
    EntityAdminTypeInfo entityAdminTypeInfo;
    private List<OrganigramElement> children;

    public static class UtilisateurInfo{
        Long id;
        String nom;
        String prenom;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getNom() {
            return nom;
        }

        public void setNom(String nom) {
            this.nom = nom;
        }

        public String getPrenom() {
            return prenom;
        }

        public void setPrenom(String prenom) {
            this.prenom = prenom;
        }
    }

    public static class EntityAdminTypeInfo{
        Long id;
        String libelle;
        String code;
        String description;
        Integer rang;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getLibelle() {
            return libelle;
        }

        public void setLibelle(String libelle) {
            this.libelle = libelle;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getDescription() {return description;}

        public void setDescription(String description) {this.description = description;}

        public Integer getRang() {return rang;}

        public void setRang(Integer rang) {this.rang = rang;}
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getReferenceGed() {
        return referenceGed;
    }

    public void setReferenceGed(String referenceGed) {
        this.referenceGed = referenceGed;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public List<OrganigramElement> getChildren() {
        return children;
    }

    public void setChildren(List<OrganigramElement> children) {
        this.children = children;
    }

    public UtilisateurInfo getUtilisateurInfo() {
        return utilisateurInfo;
    }

    public void setUtilisateurInfo(UtilisateurInfo utilisateurInfo) {
        this.utilisateurInfo = utilisateurInfo;
    }

    public EntityAdminTypeInfo getEntityAdminTypeInfo() {
        return entityAdminTypeInfo;
    }

    public void setEntityAdminTypeInfo(EntityAdminTypeInfo entityAdminTypeInfo) {this.entityAdminTypeInfo = entityAdminTypeInfo;}

    public Integer getArchiveLawDuration() {return archiveLawDuration;}

    public void setArchiveLawDuration(Integer archiveLawDuration) {this.archiveLawDuration = archiveLawDuration;}
}
