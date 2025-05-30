package ma.sir.ged.service.impl.admin.doc;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@Service
public class ExcelService {

    public List<List<String>> readExcel(MultipartFile file) throws IOException {
        return readExcel(file.getInputStream());
    }

    public List<List<String>> readExcel(byte[] bytes) throws IOException {
        return readExcel(new ByteArrayInputStream(bytes));
    }

    private List<List<String>> readExcel(InputStream inputStream) throws IOException {
        List<List<String>> rows = new ArrayList<>();

        try (Workbook workbook = WorkbookFactory.create(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();

            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                List<String> cellValues = new ArrayList<>();

                for (Cell cell : row) {
                    cellValues.add(getCellValueAsString(cell));
                }

                rows.add(cellValues);
            }
        }

        return rows;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return "";
        }

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getLocalDateTimeCellValue().toString();
                }
                return String.valueOf(cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return "";
        }
    }

    public byte[] writeExcel(List<List<String>> data) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Sheet1");

            for (int i = 0; i < data.size(); i++) {
                Row row = sheet.createRow(i);
                List<String> rowData = data.get(i);

                for (int j = 0; j < rowData.size(); j++) {
                    Cell cell = row.createCell(j);
                    cell.setCellValue(rowData.get(j));
                }
            }

            try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
                workbook.write(outputStream);
                return outputStream.toByteArray();
            }
        }
    }

    public boolean isExcelFile(MultipartFile file) throws IOException {
        return isExcelFile(file.getBytes());
    }

    public boolean isExcelFile(byte[] fileBytes) {
        try (InputStream inputStream = new ByteArrayInputStream(fileBytes)) {
            WorkbookFactory.create(inputStream);
            return true;
        } catch (IOException e) {
            return false;
        }
    }

    public int countRows(MultipartFile file) throws IOException {
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            int rowCount = 0;

            for (Row row : sheet) {
                if (isRowEmpty(row)) {
                    continue;
                }
                rowCount++;
            }

            return rowCount;
        }
    }

    private boolean isRowEmpty(Row row) {
        if (row == null) {
            return true;
        }
        for (int cellNum = row.getFirstCellNum(); cellNum < row.getLastCellNum(); cellNum++) {
            Cell cell = row.getCell(cellNum);
            if (cell != null && cell.getCellType() != CellType.BLANK && !cell.toString().trim().isEmpty()) {
                return false;
            }
        }
        return true;
    }

    public List<String> getRowData(MultipartFile file, int rowIndex) throws IOException {
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Row row = sheet.getRow(rowIndex);
            if (row == null) {
                return new ArrayList<>();
            }
            List<String> rowData = new ArrayList<>();
            for (Cell cell : row) {
                rowData.add(getCellValueAsString(cell));
            }
            return rowData;
        }
    }

    public List<String> findRowByValue(MultipartFile file, String searchValue, int columnIndex) throws IOException {
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            for (Row row : sheet) {
                Cell cell = row.getCell(columnIndex);
                if (cell != null && getCellValueAsString(cell).equals(searchValue)) {
                    return getRowDataFromRow(row);
                }
            }
        }
        return null;
    }

    private List<String> getRowDataFromRow(Row row) {
        List<String> rowData = new ArrayList<>();
        for (Cell cell : row) {
            rowData.add(getCellValueAsString(cell));
        }
        return rowData;
    }

    public boolean columnExists(MultipartFile file, String columnName) throws IOException {
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Row headerRow = sheet.getRow(0);
            if (headerRow == null) {
                return false;
            }
            for (Cell cell : headerRow) {
                if (getCellValueAsString(cell).equalsIgnoreCase(columnName)) {
                    return true;
                }
            }
        }
        return false;
    }

    public int getColumnIndex(MultipartFile file, String columnName) throws IOException {
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Row headerRow = sheet.getRow(0);
            if (headerRow == null) {
                return -1;
            }
            for (Cell cell : headerRow) {
                if (getCellValueAsString(cell).equalsIgnoreCase(columnName)) {
                    return cell.getColumnIndex();
                }
            }
        }
        return -1;
    }

    public List<String> getColumnData(MultipartFile file, int columnIndex) throws IOException {
        List<String> columnData = new ArrayList<>();
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            for (Row row : sheet) {
                Cell cell = row.getCell(columnIndex);
                columnData.add(getCellValueAsString(cell));
            }
        }
        return columnData;
    }

    public Map<String, List<String>> getColumnDataByHeaders(MultipartFile file, List<String> headers) throws IOException {
        Map<String, List<String>> columnData = new HashMap<>();
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Row headerRow = sheet.getRow(0);
            if (headerRow == null) {
                return columnData;
            }

            Map<String, Integer> headerIndices = new HashMap<>();
            for (Cell cell : headerRow) {
                String headerName = getCellValueAsString(cell);
                if (headers.contains(headerName)) {
                    headerIndices.put(headerName, cell.getColumnIndex());
                    columnData.put(headerName, new ArrayList<>());
                }
            }

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // Skip header row
                for (Map.Entry<String, Integer> entry : headerIndices.entrySet()) {
                    Cell cell = row.getCell(entry.getValue());
                    columnData.get(entry.getKey()).add(getCellValueAsString(cell));
                }
            }
        }
        return columnData;
    }

    public List<Map<String, String>> getDataAsMapList(MultipartFile file) throws IOException {
        List<Map<String, String>> dataList = new ArrayList<>();
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();

            if (!rowIterator.hasNext()) {
                return dataList;
            }

            Row headerRow = rowIterator.next();
            List<String> headers = new ArrayList<>();
            for (Cell cell : headerRow) {
                headers.add(getCellValueAsString(cell));
            }

            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                Map<String, String> rowData = new HashMap<>();
                for (int i = 0; i < headers.size(); i++) {
                    Cell cell = row.getCell(i);
                    rowData.put(headers.get(i), getCellValueAsString(cell));
                }
                dataList.add(rowData);
            }
        }
        return dataList;
    }

    public List<List<String>> mergeExcelFiles(List<byte[]> excelFiles) throws IOException {
        List<List<String>> mergedData = new ArrayList<>();
        boolean isFirstValidFile = true;

        for (byte[] fileBytes : excelFiles) {
            if (isExcelFile(fileBytes)) {
                List<List<String>> excelData = readExcel(fileBytes);

                if (isFirstValidFile) {
                    mergedData.addAll(excelData);
                    isFirstValidFile = false;
                } else {
                    mergedData.addAll(excelData.subList(1, excelData.size()));
                }
            }
        }

        return mergedData;
    }
}