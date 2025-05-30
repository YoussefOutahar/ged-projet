package ma.sir.ged.service.impl.admin.dashboard;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import java.io.ByteArrayOutputStream;

import ma.sir.ged.dao.facade.core.dashboard.DashboardDao;
import ma.sir.ged.dao.facade.core.doc.DocumentDao;
import ma.sir.ged.dao.specification.core.ProductionGlobal;
import ma.sir.ged.service.facade.admin.dashbord.IDashboardService;
import ma.sir.ged.ws.dto.dashboard.AdminEntityStatsDetailDTO;
import ma.sir.ged.ws.dto.dashboard.DocumentStatsDetailDTO;
import ma.sir.ged.ws.dto.dashboard.MonthlyDocumentCountDTO;
import ma.sir.ged.ws.dto.dashboard.MonthlyStatsDTO;
import ma.sir.ged.ws.dto.dashboard.UserStatsDetailDTO;
import ma.sir.ged.zynerator.exception.EntityNotFoundException;
import ma.sir.ged.zynerator.util.DateUtil;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Year;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class DashboardServiceImpl implements IDashboardService {

    @Autowired
    DashboardDao dao;
    @Autowired
    private DocumentDao documentRepository;

    private DateUtil dateUtil;


    @Override
    public Long sumAllCounts(List<DocumentStatsDetailDTO> statistics) {
        return dao.countDocuments();
    }
    public List<ProductionGlobal> countDocumentsGroupByPlanClassement(String startDateString, String endDateString) {
        LocalDateTime midnight = LocalTime.MIDNIGHT.atDate(LocalDate.now());
        if (startDateString.equals("")&& endDateString.equals("")) {throw new IllegalArgumentException("Veuillez renseigner les dates de début et de fin!");}

        if (!startDateString.equals("")) {
            LocalDate startDate = dateUtil.stringToLocalDate(startDateString);
            LocalDateTime startDateTime = startDate.atTime(LocalTime.from(midnight));

            if (!endDateString.equals("")) {
                LocalDate endDate = dateUtil.stringToLocalDate(endDateString);
                if (startDate.isAfter(endDate)) {
                    throw new IllegalArgumentException("La date de début sélectionnée ne peut pas être supérieure à la date de fin !");
                }
                LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);
                return documentRepository.countDocumentsGroupByPlanClassement(startDateTime, endDateTime);
            } else {

                LocalDateTime endDateTime = startDate.atTime(LocalTime.MAX);
                return documentRepository.countDocumentsGroupByPlanClassement(startDateTime, endDateTime);
            }
        } else {
            LocalDate endDate = dateUtil.stringToLocalDate(endDateString);
            LocalDateTime startDateTime = endDate.atTime(LocalTime.from(midnight));
            LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);
            return documentRepository.countDocumentsGroupByPlanClassement(startDateTime,endDateTime);
        }
    }
    @Override
    public byte[] exportDocumentsGlobalProductionToPdf(List<ProductionGlobal> productionGlobalList, String startDate, String endDate)
            throws DocumentException, IOException {
        // Create ByteArrayOutputStream to hold the generated PDF content
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        // Create PDF document
        com.itextpdf.text.Document document = new Document();
        PdfWriter.getInstance(document, outputStream);
        document.open();
        PdfPTable table = new PdfPTable(2);

        table.setWidthPercentage(100);
        table.setHorizontalAlignment(Element.ALIGN_CENTER);

        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 15, BaseColor.WHITE);

        PdfPCell headerCell = new PdfPCell(new Phrase("Production global de "+startDate+" Jusqu'au "+endDate, headerFont));
        headerCell.setColspan(2);  // Span two columns for "Documents" and "Documents Indexer" titles
        headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        headerCell.setBackgroundColor(BaseColor.BLACK);
        headerCell.setPaddingBottom(20);
        headerCell.setBorderWidthBottom(8);
        headerCell.setBorderColorBottom(BaseColor.WHITE);
        table.addCell(headerCell);

        headerCell = new PdfPCell(new Phrase("Documents ", headerFont));
        headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        headerCell.setBackgroundColor(BaseColor.BLACK);
        headerCell.setBorderWidthRight(2);
        headerCell.setBorderColorRight(BaseColor.WHITE);
        table.addCell(headerCell);
        headerCell = new PdfPCell(new Phrase("Documents Indexer", headerFont));
        headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        headerCell.setBackgroundColor(BaseColor.BLACK);
        table.addCell(headerCell);


        // Remplir les données dans la table
        Font cellFontPlantClassemnt = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, BaseColor.BLACK);
        Font cellFont = FontFactory.getFont(FontFactory.HELVETICA, 12, BaseColor.BLACK);

        for (ProductionGlobal production : productionGlobalList) {
            PdfPCell cell;

            cell = new PdfPCell(new Phrase(production.getPlanClassmentLibelle(), cellFontPlantClassemnt));
            cell.setVerticalAlignment(Element.ALIGN_CENTER);
            cell.setColspan(2);
            cell.setBackgroundColor(BaseColor.ORANGE);
            cell.setPaddingBottom(10);
            cell.setBorderWidthBottom(8);
            cell.setBorderColorBottom(BaseColor.WHITE);
            table.addCell(cell);

            cell = new PdfPCell(new Phrase(String.valueOf(production.getNombreDocument()), cellFont));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);

            cell = new PdfPCell(new Phrase(String.valueOf(production.getNombreDocumentIndexe()), cellFont));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);
        }
        // Ajouter la table au document
        document.add(table);

        document.close();
        return outputStream.toByteArray();
    }

    @Override
    public String convertPDFToBase62(List<ProductionGlobal> productionGlobalList, String startDateString, String endDateString) throws DocumentException, IOException{

        if(productionGlobalList.isEmpty()) throw new EntityNotFoundException("Résultat introuvable");
        byte[] pdfContent = exportDocumentsGlobalProductionToPdf(productionGlobalList, startDateString, endDateString);

        return Base64.getEncoder().encodeToString(pdfContent);

    }
    @Override
    public List<UserStatsDetailDTO> getUserStatsDetailList() {
        List<UserStatsDetailDTO> userStatsDetailDTOS = dao.countUsersByRole();
        if(CollectionUtils.isNotEmpty(userStatsDetailDTOS)){
            return userStatsDetailDTOS;
        }
        return Collections.emptyList();
    }

    @Override
    public Long countUsers() {
        return dao.countUsers();
    }

    @Override
    public List<AdminEntityStatsDetailDTO> getAdminEntityStatsDetailList(String typeEntity) {
        List<AdminEntityStatsDetailDTO> adminEntityStatsDetailDTOS = hasText(typeEntity) ? dao.countEntityAdministrative(typeEntity) : dao.countEntityAdministrative();
        if(CollectionUtils.isNotEmpty(adminEntityStatsDetailDTOS)){
            return adminEntityStatsDetailDTOS;
        }
        return Collections.emptyList();
    }

    @Override
    public List<DocumentStatsDetailDTO> getDocumentStatDetailListByUser(String username) {
        int year = Year.now().getValue();
        List<MonthlyDocumentCountDTO> monthlyStats = hasText(username) ?
                dao.countDocumentsByMonthByUser(year, username) :
                dao.countDocumentsByMonthByUser(year);
        return extractMonthlyStats(monthlyStats);

    }

    @Override
    public List<DocumentStatsDetailDTO> getDocumentStatDetailListByEntiteAdministrative(String entity) {
        int year = Year.now().getValue();
        return hasText(entity) ?
                extractMonthlyStats(dao.countDocumentsByEntiteAdministrative(year, entity)) :
                extractMonthlyStats(dao.countDocumentsByMonthByEntiteAdministrative(year));
    }

    private boolean hasText(String text){
        return Objects.nonNull(text) && StringUtils.isNotBlank(text);
    }



    private List<DocumentStatsDetailDTO> extractMonthlyStats(List<MonthlyDocumentCountDTO> data){
        Set<String> identifiers = data.stream().map(MonthlyDocumentCountDTO::getIdentifier).collect(Collectors.toSet());
        return identifiers.stream().map(identifier ->  extractStatsFromData(data, identifier)).collect(Collectors.toList());
    }
    private DocumentStatsDetailDTO extractStatsFromData(List<MonthlyDocumentCountDTO> data, String identifier){
        MonthlyStatsDTO statsByMonth = new MonthlyStatsDTO();
        Stream<MonthlyDocumentCountDTO> dataByIdentifierStream = data.stream().filter(element -> element.getIdentifier().equalsIgnoreCase(identifier));
        dataByIdentifierStream.forEach(e -> {
            switch (e.getMonth()){
                case 1:
                    statsByMonth.setJanvier(e.getCount());
                case 2:
                    statsByMonth.setFevrier(e.getCount());
                case 3:
                    statsByMonth.setMars(e.getCount());
                case 4:
                    statsByMonth.setAvril(e.getCount());
                case 5:
                    statsByMonth.setMai(e.getCount());
                case 6:
                    statsByMonth.setJuin(e.getCount());
                case 7:
                    statsByMonth.setJuiellet(e.getCount());
                case 8:
                    statsByMonth.setAout(e.getCount());
                case 9:
                    statsByMonth.setSeptember(e.getCount());
                case 10:
                    statsByMonth.setOctobre(e.getCount());
                case 11:
                    statsByMonth.setNovembre(e.getCount());
                case 12:
                    statsByMonth.setDecembre(e.getCount());
                default:
            }});
        return new DocumentStatsDetailDTO(identifier, statsByMonth);
    }

    private Long sumMonthlyStats(MonthlyStatsDTO stats) {
        return Optional.ofNullable(stats.getJanvier()).orElse(0L)
                + Optional.ofNullable(stats.getFevrier()).orElse(0L)
                + Optional.ofNullable(stats.getMars()).orElse(0L)
                + Optional.ofNullable(stats.getAvril()).orElse(0L)
                + Optional.ofNullable(stats.getMai()).orElse(0L)
                + Optional.ofNullable(stats.getJuin()).orElse(0L)
                + Optional.ofNullable(stats.getJuiellet()).orElse(0L)
                + Optional.ofNullable(stats.getAout()).orElse(0L)
                + Optional.ofNullable(stats.getSeptember()).orElse(0L)
                + Optional.ofNullable(stats.getOctobre()).orElse(0L)
                + Optional.ofNullable(stats.getNovembre()).orElse(0L)
                + Optional.ofNullable(stats.getDecembre()).orElse(0L);
    }
}
