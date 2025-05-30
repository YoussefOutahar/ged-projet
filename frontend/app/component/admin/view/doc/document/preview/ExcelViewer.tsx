import React, { useEffect, useState } from 'react';
import { read, utils, WorkSheet } from 'xlsx';
import Spreadsheet from 'react-spreadsheet';

type Props = {
  fileUrl?: string;
  documentBlob?: Blob;
};

const ExcelViewer: React.FC<Props> = ({ fileUrl, documentBlob }: Props) => {
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null);
  const [data, setData] = useState<any[][]>([]);
  const [workbook, setWorkbook] = useState<null | ReturnType<typeof read>>(null);

  // Loading the file from the file URL
  const fetchAndReadFileFromUrl = async (url: string) => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const wb = read(arrayBuffer, { type: 'array' });
    setWorkbook(wb);

    const sheetNames = wb.SheetNames;
    setSheets(sheetNames);

    if (sheetNames.length > 0) {
      const firstSheet = wb.Sheets[sheetNames[0]];
      setSelectedSheet(sheetNames[0]);
      parseSheet(firstSheet);
    }
  };

  // Loading the file from the Blob
  const readFileFromBlob = (blob: Blob) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result;
      const wb = read(arrayBuffer, { type: 'array' });
      setWorkbook(wb);

      const sheetNames = wb.SheetNames;
      setSheets(sheetNames);

      if (sheetNames.length > 0) {
        const firstSheet = wb.Sheets[sheetNames[0]];
        setSelectedSheet(sheetNames[0]);
        parseSheet(firstSheet);
      }
    };
    reader.readAsArrayBuffer(blob);
  };

  useEffect(() => {
    if (documentBlob) {
      readFileFromBlob(documentBlob);
    } else if (fileUrl) {
      fetchAndReadFileFromUrl(fileUrl);
    }
  }, [documentBlob, fileUrl]);

  const handleSheetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sheetName = event.target.value;
    if (sheetName && workbook) {
      const sheet = workbook.Sheets[sheetName];
      setSelectedSheet(sheetName);
      parseSheet(sheet);
    }
  };

  const parseSheet = (sheet: WorkSheet) => {
    const jsonData = utils.sheet_to_json<any[]>(sheet, { header: 1 });
    // Determine the maximum number of columns in the data
    const maxColumns = Math.max(...jsonData.map(row => row.length));

    // Fill empty cells with { "value": "" }
    const formattedData = jsonData.map((row: any[]) =>
      row.map((value) => ({ value: value === undefined ? "" : String(value) }))
        .concat(Array.from({ length: maxColumns - row.length }, () => ({ value: "" })))
    );
    setData(formattedData);
  };

  return (
    <div>
      {sheets.length > 0 && (
        <div>
          <label>Feuilles de calcul : </label>
          <select value={selectedSheet || ''} onChange={handleSheetChange}>
            {sheets.map((sheetName) => (
              <option key={sheetName} value={sheetName}>
                {sheetName}
              </option>
            ))}
          </select>
        </div>
      )}
      <Spreadsheet data={data} />
    </div>
  );
};

export default ExcelViewer;
