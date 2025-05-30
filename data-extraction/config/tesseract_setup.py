import pytesseract
import config.config as cfg

print("Setting up Tesseract...")
tesseract_cmd = cfg.Config.TESSERACT_CMD

print(f"Using Tesseract command: {tesseract_cmd}")

if tesseract_cmd:
    pytesseract.pytesseract.tesseract_cmd = tesseract_cmd
else:
    raise EnvironmentError("TESSERACT_CMD environment variable not set")