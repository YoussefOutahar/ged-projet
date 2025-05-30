import os
import sys
import logging
import threading
from gunicorn import glogging

class ThreadNameFilter(logging.Filter):
    def filter(self, record):
        record.threadName = threading.current_thread().name
        return True

class CustomGunicornLogger(glogging.Logger):
    def setup(self, cfg):
        super().setup(cfg)

        self.error_log.handlers = []
        self.access_log.handlers = []
        
        if not os.path.exists('logs'):
            os.mkdir('logs')
        
        formatter = logging.Formatter('%(asctime)s - %(threadName)s - %(name)s - %(levelname)s - %(message)s')

        file_handler = logging.FileHandler('logs/app.log')
        file_handler.setFormatter(formatter)
        file_handler.setLevel(logging.DEBUG)

        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setFormatter(formatter)
        console_handler.setLevel(logging.DEBUG)

        self.error_log.addHandler(file_handler)
        self.error_log.addHandler(console_handler)
        self.error_log.setLevel(logging.DEBUG)

        # Set up root logger
        root_logger = logging.getLogger()
        root_logger.handlers = []
        root_logger.addHandler(file_handler)
        root_logger.addHandler(console_handler)
        root_logger.setLevel(logging.DEBUG)

def setup_logger(app):
    # Use the existing logger setup by Gunicorn
    app.logger.handlers = []
    app.logger.propagate = True
    return app.logger

def get_logger():
    return logging.getLogger('gunicorn')