package ma.sir.ged.ws.facade.bo;

import ma.sir.ged.bean.core.bureauOrdre.History.CourrielHistory;
import ma.sir.ged.service.facade.bo.CourrielHistoryService;
import ma.sir.ged.ws.converter.BureauOrdre.CourrielHistoryConverter;
import ma.sir.ged.ws.dto.BureauOrdre.CourrielHistoryDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/courriel-history")
public class CourrielHistoryController {

    @Autowired
    private CourrielHistoryService courrielHistoryService;

    @Autowired
    private CourrielHistoryConverter courrielHistoryConverter;

    @GetMapping
    public ResponseEntity<List<CourrielHistoryDto>> getAll() {
        List<CourrielHistory> courrielHistories = courrielHistoryService.getAll();
        List<CourrielHistoryDto> courrielHistoryDtos = new ArrayList<>();
        for (CourrielHistory courrielHistory : courrielHistories) {
            courrielHistoryDtos.add(courrielHistoryConverter.toDto(courrielHistory));
        }
        return ResponseEntity.ok(courrielHistoryDtos);
    }

    @GetMapping("/courriel/{id}")
    public ResponseEntity<List<CourrielHistoryDto>> getByCourrielId(@PathVariable Long id) {
        List<CourrielHistory> courrielHistories = courrielHistoryService.getAllByCourrielId(id);
        List<CourrielHistoryDto> courrielHistoryDtos = new ArrayList<>();
        for (CourrielHistory courrielHistory : courrielHistories) {
            courrielHistoryDtos.add(courrielHistoryConverter.toDto(courrielHistory));
        }
        return ResponseEntity.ok(courrielHistoryDtos);
    }

    @GetMapping("history-pdf/{courrielId}")
    public ResponseEntity<byte[]> generatePdf(@PathVariable Long courrielId) {
        ByteArrayOutputStream pdfStream = courrielHistoryService.generatePdf(courrielId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=query_results.pdf");
        headers.setContentLength(pdfStream.size());

        return new ResponseEntity<>(pdfStream.toByteArray(), headers, HttpStatus.OK);
    }
}
