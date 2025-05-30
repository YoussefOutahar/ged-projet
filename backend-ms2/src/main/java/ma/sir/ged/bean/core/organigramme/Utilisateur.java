package ma.sir.ged.bean.core.organigramme;

import java.sql.Blob;
import java.util.Objects;

import java.time.LocalDateTime;


import com.fasterxml.jackson.annotation.*;

import javax.persistence.*;


import ma.sir.ged.bean.core.doc.Image;
import ma.sir.ged.zynerator.security.bean.User;

@Entity
@Table(name = "utilisateur")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="utilisateur_seq",sequenceName="utilisateur_seq",allocationSize=1, initialValue = 1)
public class Utilisateur  extends User    {


    public Utilisateur(String username) {
        super(username);
    }
    @Column(length = 500)
    private String email;
    @Column(length = 500)
    private String telephone;
    @Column(length = 500)
    private String nom;
    @Column(length = 500)
    private String prenom;
    private LocalDateTime dateNaissance ;
    @Column(columnDefinition = "boolean default false")
    private boolean credentialsNonExpired = false;
    @Column(columnDefinition = "boolean default false")
    private boolean enabled = false;
    @Column(columnDefinition = "boolean default false")
    private boolean accountNonExpired = false;
    @Column(columnDefinition = "boolean default false")
    private boolean accountNonLocked = false;
    @Column(columnDefinition = "boolean default false")
    private boolean passwordChanged = false;
    @Column(length = 500)
    private String username;
    @Column(length = 500)
    private String password;


    private Signature signature;

    private ProfilePicture profilePicture;

    private Gender gender ;
    
    private EntiteAdministrative entiteAdministrative ;

    private UserKeystore certificate;





    public Utilisateur(){
        super();
    }

    public Utilisateur(Long id,String nom){
        this.id = id;
        this.nom = nom ;
    }
    public Utilisateur(Long id,String nom,String prenom,String email,String username){
        this.id = id;
        this.nom = nom ;
        this.email = email ;
        this.prenom = prenom ;
        this.username = username ;
    }




    @Id
    @Column(name = "id")
        @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="utilisateur_seq")
    public Long getId(){
        return this.id;
    }
    public void setId(Long id){
        this.id = id;
    }
    public String getEmail(){
        return this.email;
    }
    public void setEmail(String email){
        this.email = email;
    }
    public String getTelephone(){
        return this.telephone;
    }
    public void setTelephone(String telephone){
        this.telephone = telephone;
    }
    public String getNom(){
        return this.nom;
    }
    public void setNom(String nom){
        this.nom = nom;
    }
    public String getPrenom(){
        return this.prenom;
    }
    public void setPrenom(String prenom){
        this.prenom = prenom;
    }
    public LocalDateTime getDateNaissance(){
        return this.dateNaissance;
    }
    public void setDateNaissance(LocalDateTime dateNaissance){
        this.dateNaissance = dateNaissance;
    }
    @ManyToOne(fetch = FetchType.LAZY)
    public Gender getGender(){
        return this.gender;
    }
    public void setGender(Gender gender){
        this.gender = gender;
    }

    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @JsonIdentityReference(alwaysAsId = true)
    @ManyToOne(fetch = FetchType.LAZY)
    public EntiteAdministrative getEntiteAdministrative(){
        return this.entiteAdministrative;
    }
    public void setEntiteAdministrative(EntiteAdministrative entiteAdministrative){
        this.entiteAdministrative = entiteAdministrative;
    }
    public boolean  getCredentialsNonExpired(){
        return this.credentialsNonExpired;
    }
    public void setCredentialsNonExpired(boolean credentialsNonExpired){
        this.credentialsNonExpired = credentialsNonExpired;
    }
    public boolean  getEnabled(){
        return this.enabled;
    }
    public void setEnabled(boolean enabled){
        this.enabled = enabled;
    }
    public boolean  getAccountNonExpired(){
        return this.accountNonExpired;
    }
    public void setAccountNonExpired(boolean accountNonExpired){
        this.accountNonExpired = accountNonExpired;
    }
    public boolean  getAccountNonLocked(){
        return this.accountNonLocked;
    }
    public void setAccountNonLocked(boolean accountNonLocked){
        this.accountNonLocked = accountNonLocked;
    }
    public boolean  getPasswordChanged(){
        return this.passwordChanged;
    }
    public void setPasswordChanged(boolean passwordChanged){
        this.passwordChanged = passwordChanged;
    }
    public String getUsername(){
        return Objects.isNull(this.username) ? super.username : this.username;
    }
    public void setUsername(String username){
        this.username = username;
    }
    public String getPassword(){
        return this.password;
    }
    public void setPassword(String password){
        this.password = password;
    }


    @JsonManagedReference
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_signature_id", referencedColumnName = "id")
    public Signature getSignature() {
        return signature;
    }

    public void setSignature(Signature signature) {
        this.signature = signature;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    @JoinColumn(name = "certificate_id")
    public UserKeystore getCertificate() {
        return certificate;
    }

    public void setCertificate(UserKeystore certificate) {
        this.certificate = certificate;
    }

    @JsonManagedReference
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_picture_id", referencedColumnName = "id")
    public ProfilePicture getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(ProfilePicture profilePicture) {
        this.profilePicture = profilePicture;
    }

    @Transient
    public String getLabel() {
        label = nom;
        return label;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Utilisateur utilisateur = (Utilisateur) o;
        return id != null && id.equals(utilisateur.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}

