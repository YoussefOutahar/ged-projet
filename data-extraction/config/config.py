import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    CACHE_DIR = os.getenv('CACHE_DIR', '/tmp/ocr_cache')
    MAX_CACHE_SIZE = int(os.getenv('MAX_CACHE_SIZE', 5 * 1024 * 1024 * 1024)) 
    # MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max-limit
    ALLOWED_EXTENSIONS = {'pdf','csv','xlsx', 'xls'}
    TIMEOUT = 10
    TESSERACT_CMD = os.environ.get('TESSERACT_CMD') or '/usr/bin/tesseract'

    @property
    def DATABASE_URL(self):
        if self.DB_PASSWORD:
            return f"mysql+pymysql://{self.DB_USERNAME}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        else:
            return f"mysql+pymysql://{self.DB_USERNAME}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"