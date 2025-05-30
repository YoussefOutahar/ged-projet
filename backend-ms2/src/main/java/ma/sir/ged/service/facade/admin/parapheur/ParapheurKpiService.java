package ma.sir.ged.service.facade.admin.parapheur;

import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.parapheur.ParapheurBo;
import ma.sir.ged.bean.core.parapheur.ParapheurEtat;
import ma.sir.ged.dao.facade.core.parapheur.ParapheurRepository;
import ma.sir.ged.ws.dto.ParapheurKpiDistinctDto;
import ma.sir.ged.ws.dto.ParapheurKpiDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ParapheurKpiService {
    @Autowired
    private ParapheurRepository parapheurRepository;

    public ParapheurKpiDto calculateParapheurKpi() {
        ParapheurKpiDto parapheurKpiDto = new ParapheurKpiDto();
        List<ParapheurBo> parapheurBoList = parapheurRepository.findAll();

        int nombreTotal = parapheurBoList.size();
        parapheurKpiDto.setNombreTotal(nombreTotal);

        int nombreParaphSigne = (int) parapheurBoList.stream()
                .filter(paraph -> paraph.getParapheurEtat().equals(ParapheurEtat.TERMINE))
                .count();
        parapheurKpiDto.setNombreParaphSigne(nombreParaphSigne);

        int nombreParaphNonSigne = (int) parapheurBoList.stream()
                .filter(paraph -> paraph.getParapheurEtat().equals(ParapheurEtat.EN_ATTENTE))
                .count();
        parapheurKpiDto.setNombreParaphNonSigne(nombreParaphNonSigne);

        int nombreParaphRejete = (int) parapheurBoList.stream()
                .filter(paraph -> paraph.getParapheurEtat().equals(ParapheurEtat.REJETE))
                .count();
        parapheurKpiDto.setNombreParaphRejete(nombreParaphRejete);

        int nombreParapheurHasWorkflow = (int) parapheurBoList.stream()
                .filter(parapheur -> parapheur.getWorkflow() != null)
                .filter(parapheur -> !parapheur.getParapheurEtat().equals(ParapheurEtat.REJETE))
                .count();
        parapheurKpiDto.setNombreParapheurHasWorkflow(nombreParapheurHasWorkflow);

        int nombreParapheurSansWorkflow = (int) parapheurBoList.stream()
                .filter(parapheur -> parapheur.getWorkflow() == null)
                .filter(parapheur -> !parapheur.getParapheurEtat().equals(ParapheurEtat.REJETE))
                .count();
        parapheurKpiDto.setNombreParapheurSansWorkflow(nombreParapheurSansWorkflow);

        int nombreInitiateurDistinct = (int) parapheurBoList.stream()
                .map(ParapheurBo::getUtilisateur)
                .filter(Objects::nonNull)
                .distinct()
                .count();
        parapheurKpiDto.setNombreInitiateurDistinct(nombreInitiateurDistinct);

        return parapheurKpiDto;
    }
    public List<ParapheurKpiDistinctDto> calculateParapheurKpiByTitle(String title){
        List<ParapheurKpiDistinctDto> parapheurKpiDistinctDtos = new ArrayList<>();
        List<ParapheurBo> parapheurBos = parapheurRepository.findByTitleContaining(title).stream()
                .filter(paraph -> !paraph.getParapheurEtat().equals(ParapheurEtat.REJETE))
                .sorted(Comparator.comparing(ParapheurBo::getId).reversed())
                .collect(Collectors.toList());

        for(ParapheurBo parapheurBo: parapheurBos){
            parapheurKpiDistinctDtos.add(calculateParapheurKpiByTitle(parapheurBo));
        }
        return parapheurKpiDistinctDtos;
    }
    private ParapheurKpiDistinctDto calculateParapheurKpiByTitle(ParapheurBo parapheurBo) {
        ParapheurKpiDistinctDto parapheurKpiDto = new ParapheurKpiDistinctDto();
        parapheurKpiDto.setTitle(parapheurBo.getTitle());
        parapheurKpiDto.setStatus(parapheurBo.getParapheurEtat());
        parapheurKpiDto.setNombreCommentaire(parapheurBo.getComments().size());
        parapheurKpiDto.setNombreDocumentTotal(parapheurBo.getDocuments().size());
        parapheurKpiDto.setNombreDocumentSigne((int) parapheurBo.getDocuments().stream()
                .filter(Document::getSigned).count());
        parapheurKpiDto.setNombreDocumentNonSigne((int) parapheurBo.getDocuments().stream()
                .filter(doc -> !doc.getSigned()).count());
        parapheurKpiDto.setNombreUserAssocie(parapheurBo.getUtilisateurs().size());

        return parapheurKpiDto;
    }
}
