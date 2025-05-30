from .parapheur.parapheur_generator import create_fiche_parapheur_pdf
from .field_extractor import process_documents_parallel
from .tesseract import perform_OCR

# from .spacy_processor import extract_certificate_data, train_ner
# from .document_classifier import classify_document_type, train_document_classifier, classify_document_with_trained_model

from .csv_xls_reader import read_csv_excel