FROM python:3.11-slim

WORKDIR /app

ADD * /app

RUN apt-get update && \
    apt-get install -y tesseract-ocr tesseract-ocr-ara tesseract-ocr-fra poppler-utils python3-opencv libmagic1 libmagic-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV TESSDATA_PREFIX=/usr/share/tesseract-ocr/5/tessdata/

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000:5000

ENV FLASK_APP=server/wsgi.py
ENV TESSERACT_CMD=/usr/bin/tesseract

ENV PYTHONPATH=/usr/local/lib/python3.11/site-packages:$PYTHONPATH

# RUN chmod +x /app/entrypoint.sh

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--timeout", "400", "--workers", "1", "--threads", "4", "--logger-class", "app.log_config.CustomGunicornLogger", "app.wsgi:application"]