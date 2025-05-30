import magic
import pandas as pd
from io import StringIO
from app import get_logger

logger = get_logger()

def read_csv_excel(file):
    logger.debug("Reading CSV or Excel file")
    
    file_content = file.stream.read()
    file.stream.seek(0) 

    mime = magic.Magic(mime=True)
    file_type = mime.from_buffer(file_content)
    
    logger.debug(f"File type: {file_type}")
    
    if file_type == 'text/csv':
        csv_data = StringIO(file_content.decode("utf-8"))
        df = pd.read_csv(csv_data)
    elif file_type in {'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}:
        df = pd.read_excel(file)
    else:
        if file_content.startswith(b'PK'):
            try:
                df = pd.read_excel(file)
            except Exception as e:
                raise ValueError("Invalid Excel file format.") from e
        elif b',' in file_content or b'\t' in file_content:
            try:
                csv_data = StringIO(file_content.decode("utf-8"))
                df = pd.read_csv(csv_data)
            except Exception as e:
                raise ValueError("Invalid CSV file format.") from e
        else:
            raise ValueError("Invalid file format. Only CSV and Excel files are accepted.")
    
    return df