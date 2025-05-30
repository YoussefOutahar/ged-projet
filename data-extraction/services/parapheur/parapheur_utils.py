import re
import pandas as pd
from typing import Any, Dict, List, Union
from werkzeug.datastructures import FileStorage

from models import GedDocument

from ..field_extractor import process_documents_parallel
from ..csv_xls_reader import read_csv_excel

import logging

logger = logging.getLogger(__name__)

CODE_CE_COLUMN = 'CODE CE'

def process_pdf_files(files: List[FileStorage], fields: List[str] = None) -> List[dict]:
    file_contents = []
    for file in files:
        if file.filename.lower().endswith('.pdf'):
            file_contents.append(file.read())
            file.seek(0)  # Reset file pointer
    
    if not file_contents:
        raise ValueError("No valid PDF files found in the request")
    
    processed_documents = process_documents_parallel(file_contents)
    
    if fields:
        # Extract only specified fields
        all_documents_data = [{field: doc.get(field, "") for field in fields} for doc in processed_documents]
    else:
        # Extract all fields
        all_documents_data = processed_documents
    
    return all_documents_data

def clean_code_ce(code: Union[str, float, int]) -> str:
    if isinstance(code, float):
        code = f'{code:g}'
    elif isinstance(code, int):
        code = str(code)
    elif code is None or pd.isna(code):
        return ""
    
    return re.sub(r'[\s.]+$', '', str(code).strip())

def _get_index_value(indexes, key):
    for index in indexes:
        if index.key == key:
            return index.value
    return ""

def map_document_data(data: Union[Dict, GedDocument], source: str = 'db') -> Dict[str, Any]:
    result = {}
    
    if source == 'csv':
        result.update({
            "designation": str(data.get("DESIGNATION", "")),
            "enregistrement": clean_code_ce(data.get("CODE CE", "")),
            "societe": str(data.get("NOM MARQUE", ""))
        })
    elif source == 'pdf':
        result.update({
            "designation": str(data.get("Désignation du (des) dispositif(s)", "")),
            "enregistrement": clean_code_ce(data.get("Code CE", "")),
            "societe": str(data.get("Nom de marque/Nom commercial", ""))
        })
    elif source == 'db':
        if isinstance(data, GedDocument):
            result.update({
                "designation": str(_get_index_value(data.indexes, "DESIGNATION")),
                "enregistrement": clean_code_ce(_get_index_value(data.indexes, "CODE CE")),
                "societe": str(_get_index_value(data.indexes, "NOM MARQUE"))
            })
        else:
            logger.warning("Expected GedDocument instance for 'db' source, got dict instead")
            return map_document_data(data, 'csv')  # Fallback to CSV mapping
    else:
        logger.warning(f"Unknown data source: {source}")
        result.update({"designation": "", "enregistrement": "", "societe": ""})

    if isinstance(data, dict):
        for key, value in data.items():
            if key not in result:
                result[key] = value
    elif isinstance(data, GedDocument):
        for key, value in data.__dict__.items():
            if key not in result and not key.startswith('_'):
                result[key] = value

    return result

def combine_piece_joints(piece_joints: List[FileStorage]) -> pd.DataFrame:
    dfs = []
    for piece_joint in piece_joints:
        try:
            df = read_csv_excel(piece_joint)
            dfs.append(df)
        except ValueError as e:
            logger.warning(f"Skipping file {piece_joint.filename}: {str(e)}")
            continue
    
    if not dfs:
        logger.warning("No data frames to combine")
        return pd.DataFrame()
    
    combined_df = pd.concat(dfs, ignore_index=True)
    
    if CODE_CE_COLUMN not in combined_df.columns:
        logger.warning(f"'{CODE_CE_COLUMN}' column not found in piece_joint data")
        return combined_df
    
    # Remove duplicates based on CODE_CE_COLUMN, keeping the first occurrence
    combined_df_no_duplicates = combined_df.drop_duplicates(subset=[CODE_CE_COLUMN], keep='first')
    
    # Log the number of removed duplicates
    num_duplicates = len(combined_df) - len(combined_df_no_duplicates)
    logger.info(f"Removed {num_duplicates} duplicate '{CODE_CE_COLUMN}' entries from piece_joint data")
    
    return combined_df_no_duplicates