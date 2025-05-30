import io
import re
import hashlib
from typing import Dict, List, Tuple, Union
from concurrent.futures import ProcessPoolExecutor

from services.tesseract import perform_OCR


from app import get_logger

logger = get_logger()

def compile_patterns() -> Dict[str, List[Tuple[re.Pattern, re.Pattern]]]:
    patterns = {
        "Désignation du (des) dispositif(s)": [
            (
                re.compile(r"D[ée]signation\s+du\s*\(?des?\)?\s*dispositif\s*\(?s?\)?.*?[:;]\s*(.*?)(?=\n\s*[-•]\s*Nom\s+de\s+marque|\Z)", re.IGNORECASE | re.MULTILINE | re.DOTALL),
                re.compile(r"Nom\s+de\s+marque|\Z", re.IGNORECASE)
            ),
            (
                re.compile(r"[-—\s]*D[ée]signation\s+du\s*\(?des?\)?\s*dispositif\s*\(?s?\)?.*?[:;]\s*(.*?)(?=\n\s*[-—\s]*Nom\s+de\s+marque|\Z)", re.IGNORECASE | re.MULTILINE | re.DOTALL),
                re.compile(r"[-—\s]*Nom\s+de\s+marque|\Z", re.IGNORECASE)
            ),
        ],
        "Nom de marque/Nom commercial": [
            (
                re.compile(r"Nom\s+de\s+marque\s*/?.*?commercial.*?[:;]\s*(.*?)(?=\n\s*[-•]\s*Pr[ée]sentation|\Z)", re.IGNORECASE | re.MULTILINE | re.DOTALL),
                re.compile(r"Pr[ée]sentation|\Z", re.IGNORECASE)
            ),
            (
                re.compile(r"[-—\s]*Nom\s+de\s+marque\s*/?.*?commercial.*?[:;]\s*(.*?)(?=\n\s*[-—\s]*Pr[ée]sentation|\Z)", re.IGNORECASE | re.MULTILINE | re.DOTALL),
                re.compile(r"[-—\s]*Pr[ée]sentation|\Z", re.IGNORECASE)
            ),
        ],
        "Présentation": [
            (
                re.compile(r"Pr[ée]sentation.*?[:;]\s*(.*?)(?=\n\s*[-•]\s*Num[ée]ro|\Z)", re.IGNORECASE | re.MULTILINE | re.DOTALL),
                re.compile(r"Num[ée]ro|\Z", re.IGNORECASE)
            ),
            (
                re.compile(r"[-—\s]*Pr[ée]sentation.*?[:;]\s*(.*?)(?=\n\s*[-—\s]*Num[ée]ro|\Z)", re.IGNORECASE | re.MULTILINE | re.DOTALL),
                re.compile(r"[-—\s]*Num[ée]ro|\Z", re.IGNORECASE)
            ),
        ],
        "Numéro(s) de référence(s) ou de série": [
            (
                re.compile(r"Num[ée]ro.*?r[ée]f[ée]rence.*?s[ée]rie\s*[:;]\s*(.*?)(?=\n\s*[-•]\s*Classe\s+de\s+risque|\Z)", re.IGNORECASE | re.MULTILINE | re.DOTALL),
                re.compile(r"Classe\s+de\s+risque|\Z", re.IGNORECASE)
            ),
            (
                re.compile(r"[-—\s]*Num[ée]ro.*?r[ée]f[ée]rence.*?s[ée]rie\s*[:;]\s*(.*?)(?=\n\s*[-—\s]*Classe\s+de\s+risque|\Z)", re.IGNORECASE | re.MULTILINE | re.DOTALL),
                re.compile(r"[-—\s]*Classe\s+de\s+risque|\Z", re.IGNORECASE)
            ),
        ],
        "Classe de risque": [
            (
                re.compile(r"Classe\s+de\s+risque.*?[:;]\s*(.*?)(?=\n\s*[-•]\s*Code\s+CE|\Z)", re.IGNORECASE | re.MULTILINE | re.DOTALL),
                re.compile(r"Code\s+CE|\Z", re.IGNORECASE)
            ),
            (
                re.compile(r"[-—\s]*Classe\s+de\s+risque.*?[:;]\s*(.*?)(?=\n\s*[-—\s]*Code\s+CE|\Z)", re.IGNORECASE | re.MULTILINE | re.DOTALL),
                re.compile(r"[-—\s]*Code\s+CE|\Z", re.IGNORECASE)
            ),
        ],
        "Code CE": [
            (
                re.compile(r"Code\s+CE.*?[:;]\s*(.*?)(?=\n\s*[-•]\s*Cat[ée]gorie|\Z)", re.IGNORECASE | re.MULTILINE | re.DOTALL),
                re.compile(r"Cat[ée]gorie|\Z", re.IGNORECASE)
            ),
            (
                re.compile(r"[-—\s]*Code\s+CE.*?[:;]\s*(.*?)(?=\n\s*[-—\s]*Cat[ée]gorie|\Z)", re.IGNORECASE | re.MULTILINE | re.DOTALL),
                re.compile(r"[-—\s]*Cat[ée]gorie|\Z", re.IGNORECASE)
            ),
        ],
        "Catégorie": [
            (
                re.compile(r"Cat[ée]gorie.*?[:;]\s*(.*?)(?=\n\s*Informations\s+administratives|\Z)", re.IGNORECASE | re.MULTILINE | re.DOTALL),
                re.compile(r"Informations\s+administratives|\Z", re.IGNORECASE)
            ),
            (
                re.compile(r"[-—\s]*Cat[ée]gorie.*?[:;]\s*(.*?)(?=\n\s*[-—\s]*Informations\s+administratives|\Z)", re.IGNORECASE | re.MULTILINE | re.DOTALL),
                re.compile(r"[-—\s]*Informations\s+administratives|\Z", re.IGNORECASE)
            ),
        ],
        "Nom et adresse de l'établissement marocain": [
            (
                re.compile(r"(?:Non|Nom)\s+et\s+adresse\s+d[eo]\s+[Il][''](?:é|e)tablissement\s+maro[ce]ain.*?[:;]\s*(.*?)(?=\n\s*[-•]\s*(?:Non|Nom)\s+et\s+adresse|\Z)", re.IGNORECASE | re.MULTILINE | re.DOTALL),
                re.compile(r"(?:Non|Nom)\s+et\s+adresse\s+d[eo]\s+[Il][''](?:é|e)tablissement\s+d[eo]\s+fabrication|\Z", re.IGNORECASE)
            ),
            (
                re.compile(r"[-—\s]*(?:Non|Nom)\s+et\s+adresse\s+d[eo]\s+[Il][''](?:é|e)tablissement\s+maro[ce]ain.*?[:;]\s*(.*?)(?=\n\s*[-—\s]*(?:Non|Nom)\s+et\s+adresse|\Z)", re.IGNORECASE | re.MULTILINE | re.DOTALL),
                re.compile(r"[-—\s]*(?:Non|Nom)\s+et\s+adresse\s+d[eo]\s+[Il][''](?:é|e)tablissement\s+d[eo]\s+fabrication|\Z", re.IGNORECASE)
            ),
        ],
        "Nom et adresse de l'établissement de fabrication": [
            (
                re.compile(r"(?:Non|Nom)\s+et\s+adresse\s+d[eo]\s+[Il][''](?:é|e)tablissement\s+d[eo]\s+fabrication.*?[:;]\s*(.*?)(?=\n\s*[-•]\s*(?:Non|Nom)\s+et\s+adresse|\Z)", re.IGNORECASE | re.MULTILINE | re.DOTALL),
                re.compile(r"(?:Non|Nom)\s+et\s+adresse\s+du\s+sous-traitant|\Z", re.IGNORECASE)
            ),
            (
                re.compile(r"[-—\s]*(?:Non|Nom)\s+et\s+adresse\s+d[eo]\s+[Il][''](?:é|e)tablissement\s+d[eo]\s+fabrication.*?[:;]\s*(.*?)(?=\n\s*[-—\s]*(?:Non|Nom)\s+et\s+adresse|\Z)", re.IGNORECASE | re.MULTILINE | re.DOTALL),
                re.compile(r"[-—\s]*(?:Non|Nom)\s+et\s+adresse\s+du\s+sous-traitant|\Z", re.IGNORECASE)
            ),
        ],
        "Nom et adresse du sous-traitant": [
            (
                re.compile(r"(?:Non|Nom)\s+et\s+adresse\s+du\s+sous-traitant.*?[:;]\s*(.*?)(?=\n\s*Signature|\Z)", re.IGNORECASE | re.MULTILINE | re.DOTALL),
                re.compile(r"Signature|\Z", re.IGNORECASE)
            ),
            (
                re.compile(r"[-—\s]*(?:Non|Nom)\s+et\s+adresse\s+du\s+sous-traitant.*?[:;]\s*(.*?)(?=\n\s*[-—\s]*Signature|\Z)", re.IGNORECASE | re.MULTILINE | re.DOTALL),
                re.compile(r"[-—\s]*Signature|\Z", re.IGNORECASE)
            ),
        ],
        "Numéro d'enregistrement": [
            (
                re.compile(r"(?:sous le N°|Certificat d'enregistrement N°).*?(\d+-\d{4})(?:/[A-Z/]+)?", re.IGNORECASE | re.MULTILINE | re.DOTALL),
                re.compile(r"\.")
            ),
        ],
    }
    return patterns

def clean_extracted_value(value: str) -> str:
    value = re.split(r"Informations\s+administratives|PARTIE\s+II", value, flags=re.IGNORECASE)[0]
    
    field_starts = [
        "Nom et adresse",
        "Désignation du",
        "Nom de marque",
        "Présentation",
        "Numéro",
        "Classe de risque",
        "Code CE",
        "Catégorie"
    ]
    for start in field_starts:
        value = re.split(f"{start}", value, flags=re.IGNORECASE)[0]
    
    value = re.sub(r'\s+', ' ', value).strip()
    value = re.sub(r'[,:;.]+$', '', value)
    
    return value

def extract_annexe_data(annexe_text: str) -> Dict[str, str]:
    logger.info("Extracting data from Annexe")
    annexe_data = {}
    
    lines = annexe_text.split('\n')
    
    header_index = next((i for i, line in enumerate(lines) if "Nom Commercial" in line and "référence" in line), -1)
    
    if header_index == -1:
        logger.warning("Couldn't find header in Annexe")
        return annexe_data
    
    for line in lines[header_index + 1:]:
        parts = line.split(';')
        if len(parts) >= 2:
            nom_commercial = parts[0].strip()
            reference = parts[1].strip()
            annexe_data[nom_commercial] = reference
            logger.debug(f"Extracted from Annexe: {nom_commercial} -> {reference}")
    
    return annexe_data

def split_name_and_address(text: str) -> Tuple[str, str]:
    match = re.search(r',|\d', text)
    if match:
        split_index = match.start()
        name = text[:split_index].strip()
        address = text[split_index:].strip().lstrip(',')
        return name, address
    else:
        return text.strip(), text.strip()

def extract_field(text: str, patterns: List[Tuple[re.Pattern, re.Pattern]]) -> Union[str, Dict[str, str]]:
    for i, (start_pattern, end_pattern) in enumerate(patterns):
        start_match = start_pattern.search(text)
        if start_match:
            if start_match.groups():
                value = start_match.group(1)
            else:
                start = start_match.end()
                end_match = end_pattern.search(text, start)
                if end_match:
                    value = text[start:end_match.start()]
                else:
                    value = text[start:]
            
            value = clean_extracted_value(value)
            
            if value and value.lower() != "n/a":
                if "établissement" in start_pattern.pattern or "sous-traitant" in start_pattern.pattern:
                    name, address = split_name_and_address(value)
                    return {
                        "combined": value,
                        "name": name,
                        "address": address
                    }
                return value
    
    return "N/A"

def extract_data_from_document(text: str, patterns: Dict[str, List[Tuple[re.Pattern, re.Pattern]]]) -> Dict[str, str]:
    document_data = {}
    
    for key, field_patterns in patterns.items():
        value = extract_field(text, field_patterns)
        if isinstance(value, dict):
            document_data[key] = value["combined"]
            document_data[f"{key} - Nom"] = value["name"]
            document_data[f"{key} - Adresse"] = value["address"]
        else:
            document_data[key] = value
    
    return document_data

COMPILED_PATTERNS = compile_patterns()

def cached_extract_data(text: str) -> Dict[str, str]:
    return extract_data_from_document(text, COMPILED_PATTERNS)

def process_single_document(file_or_bytes: Union[io.BytesIO, bytes]) -> Dict[str, str]:
    logger.info("Processing single document")
    if isinstance(file_or_bytes, io.BytesIO):
        pdf_bytes = file_or_bytes.read()
        file_or_bytes.seek(0)
    elif isinstance(file_or_bytes, bytes):
        pdf_bytes = file_or_bytes
    else:
        raise ValueError("Input must be either io.BytesIO or bytes")

    logger.info("Performing OCR on document")
    all_text = perform_OCR(pdf_bytes)
    
    text_hash = hashlib.md5(all_text.encode('utf-8')).hexdigest()
    
    result = cached_extract_data(all_text)
    
    logger.info("Finished processing single document")
    
    return result

def process_documents_parallel(files_or_bytes: List[Union[io.BytesIO, bytes]]) -> List[Dict[str, str]]:
    logger.info("Processing multiple documents in parallel")
    with ProcessPoolExecutor() as executor:
        results = list(executor.map(process_single_document, files_or_bytes))
    return results