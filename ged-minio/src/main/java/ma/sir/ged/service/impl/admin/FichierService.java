package ma.sir.ged.service.impl.admin;

import ma.sir.ged.dto.FichierDTO;
import ma.sir.ged.mappers.FichierMapper;
import ma.sir.ged.model.Fichier;
import ma.sir.ged.model.FichierVersion;
import ma.sir.ged.repositories.FichierRepository;
import ma.sir.ged.repositories.FichierVersionRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

@Service
public class FichierService {
    @Autowired
    private final FichierRepository fichierRepository;
    @Autowired
    private final FichierVersionRepository versionRepository;
    @Autowired
    private final FichierMapper fichierMapper ;

    public FichierService(FichierRepository fichierRepository, FichierVersionRepository versionRepository, FichierMapper fichierMapper) {
        this.fichierRepository = fichierRepository;
        this.versionRepository = versionRepository;
        this.fichierMapper = fichierMapper;
    }

    public Fichier save(Fichier fichier){
        return fichierRepository.save(fichier);
    }
    public String extractFileName(String fullPath) {
        Path path = Paths.get(fullPath);
        return path.getFileName().toString();
    }
    public String extractFilePath(String fullPath) {
        Path path = Paths.get(fullPath);
        Path parentPath = path.getParent();
        if (parentPath != null) {
            return parentPath.toString();
        } else {
            return ""; // If there is no parent path, return an empty string or handle as needed
        }
    }
    public FichierDTO saveFichier(String bucket, String fullFilePath, String versionId){
        boolean isVersioningEnabled = StringUtils.isNotEmpty(versionId);
        Fichier fichier = fichierRepository.findFichierByFullPathAndBucket(fullFilePath, bucket).orElse(new Fichier());
        fichier.setBucket(bucket);
        fichier.setFullPath(fullFilePath);
        fichier.setObjectName(extractFileName(fullFilePath));
        fichier.setPath(extractFilePath(fullFilePath));
        fichierRepository.save(fichier);
        if(isVersioningEnabled){
            FichierVersion version = new FichierVersion();
            int nextVersionNumber = fichier.getNextVersionNumber();
            version.setVersionId(versionId);
            version.setVersionNumber(nextVersionNumber);
            version.setFichier(fichier);
            versionRepository.save(version);
            fichier.getVersions().add(version);
            fichierRepository.save(fichier);
        }
        return fichierMapper.fichierToFichierDTO(fichier);
    }
    // -----------------this where we can view the document by refrence_ged_id and versionId
    public Optional<Fichier> findFichierById(Long id){
        return fichierRepository.findById(id);
    }

    public FichierDTO toDTO(Fichier fichier){
        return fichierMapper.fichierToFichierDTO(fichier);
    }
    public void deleteFichierVersion(FichierVersion fichierVersion) {
        versionRepository.delete(fichierVersion);
    }

    public List<String> getAllVersionsAbove(Fichier fichier, String versionId){
        List<String> result = new ArrayList<>();
        FichierVersion version = versionRepository.findById(versionId).orElseThrow(() -> new RuntimeException("No Version found with the id "+versionId));
        List<FichierVersion> versions = fichier.getVersions();
        Iterator<FichierVersion> iterator = versions.iterator();
        while (iterator.hasNext()) {
            FichierVersion v = iterator.next();
            if (v.getVersionNumber() > version.getVersionNumber()) {
                result.add(v.getVersionId());
            }
        }
        return result;
    }

    public Fichier deleteVersionsAbove(Fichier fichier, String versionId) {
        FichierVersion version = versionRepository.findById(versionId).orElseThrow(() -> new RuntimeException("No Version found with the id "+versionId));
        List<FichierVersion> versions = fichier.getVersions();
        Iterator<FichierVersion> iterator = versions.iterator();
        while (iterator.hasNext()) {
            FichierVersion v = iterator.next();
            if (v.getVersionNumber() > version.getVersionNumber()) {
                iterator.remove(); // Remove from the versions list
                deleteFichierVersion(version); // Delete the version
            }
        }
        return fichier;
    }

    public Fichier update(Fichier fichier) {
        return fichierRepository.save(fichier);
    }

    public boolean delete(Long fichierId) {
        try {
            Fichier fichier = fichierRepository.findById(fichierId)
                    .orElseThrow(() -> new RuntimeException("No file found with this id " + fichierId));
            fichierRepository.delete(fichier);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
