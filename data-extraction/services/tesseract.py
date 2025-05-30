from typing import OrderedDict
import cv2
import pytesseract
from PIL import Image
import numpy as np
from pdf2image import convert_from_bytes
from concurrent.futures import ThreadPoolExecutor
import io
import hashlib
import time
import os
import pickle

from config import Config

from app import get_logger

logger = get_logger()

# Constants
CACHE_DIR = Config.CACHE_DIR
MAX_CACHE_SIZE = Config.MAX_CACHE_SIZE

if not os.path.exists(CACHE_DIR):
    os.makedirs(CACHE_DIR)

# In-memory cache
memory_cache = OrderedDict()

def compute_hash(data):
    return hashlib.blake2b(data, digest_size=20).hexdigest()

def get_cache_size():
    total_size = 0
    for dirpath, dirnames, filenames in os.walk(CACHE_DIR):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            total_size += os.path.getsize(fp)
    return total_size

def evict_cache_entries():
    while get_cache_size() > MAX_CACHE_SIZE:
        oldest_file = min(
            (os.path.join(root, file) for root, _, files in os.walk(CACHE_DIR) for file in files),
            key=os.path.getctime
        )
        os.remove(oldest_file)
        logger.info(f"OCR: Evicted cache entry: {oldest_file}")

def get_from_cache(key, cache_type="memory"):
    if cache_type == "memory":
        if key in memory_cache:
            memory_cache.move_to_end(key)
            return memory_cache[key]
    elif cache_type == "disk":
        cache_file = os.path.join(CACHE_DIR, key)
        if os.path.exists(cache_file):
            with open(cache_file, 'rb') as f:
                return pickle.load(f)
    return None

def save_to_cache(key, value, cache_type="memory"):
    if cache_type == "memory":
        memory_cache[key] = value
        memory_cache.move_to_end(key)
        if len(memory_cache) > 1000:  # Limit memory cache to 1000 items
            memory_cache.popitem(last=False)
    elif cache_type == "disk":
        evict_cache_entries()  # Ensure we're under the size limit before adding
        cache_file = os.path.join(CACHE_DIR, key)
        with open(cache_file, 'wb') as f:
            pickle.dump(value, f)

def preprocess_image(image, target_width=1000):
    if isinstance(image, Image.Image):
        image = np.array(image)
    
    aspect_ratio = image.shape[1] / image.shape[0]
    target_height = int(target_width / aspect_ratio)
    img = cv2.resize(image, (target_width, target_height))
    
    if len(img.shape) == 3:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    else:
        gray = img
    
    _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    return binary

def ocr_image(image):
    image_bytes = cv2.imencode('.png', image)[1].tobytes()
    image_hash = compute_hash(image_bytes)
    
    # Check memory cache
    result = get_from_cache(image_hash, "memory")
    if result:
        logger.debug(f"OCR cache hit (memory) for image {image_hash[:8]}")
        return result
    
    # Check disk cache
    result = get_from_cache(image_hash, "disk")
    if result:
        logger.debug(f"OCR cache hit (disk) for image {image_hash[:8]}")
        save_to_cache(image_hash, result, "memory")  # Also save to memory for faster future access
        return result
    
    # Perform OCR if not in cache
    logger.debug(f"OCR cache miss for image {image_hash[:8]}")
    image = Image.open(io.BytesIO(image_bytes))
    custom_config = r'--oem 3 --psm 6 -l fra --dpi 300'
    text = pytesseract.image_to_string(image, config=custom_config)
    
    # Save result to both caches
    save_to_cache(image_hash, text, "memory")
    save_to_cache(image_hash, text, "disk")
    
    return text

def is_relevant_page(image):
    text = ocr_image(image)
    relevant_keywords = ['CERTIFICAT', 'ENREGISTREMENT', 'DISPOSITIF']
    return any(keyword in text.upper() for keyword in relevant_keywords)

def process_page(page):
    page_np = np.array(page)
    preprocessed_image = preprocess_image(page_np)
    if is_relevant_page(preprocessed_image):
        return ocr_image(preprocessed_image)
    return ""

def divide_into_chunks(pages, chunk_size):
    for i in range(0, len(pages), chunk_size):
        yield pages[i:i + chunk_size]

def process_chunk(chunk):
    text_results = []
    for page in chunk:
        text_results.append(process_page(page))
    return " ".join(filter(None, text_results))

def perform_OCR(pdf_bytes, chunk_size=5):
    doc_hash = compute_hash(pdf_bytes)
    
    # Check memory cache
    result = get_from_cache(doc_hash, "memory")
    if result:
        logger.info(f"OCR: Document cache hit (memory) for {doc_hash[:8]}")
        return result
    
    # Check disk cache
    result = get_from_cache(doc_hash, "disk")
    if result:
        logger.info(f"OCR: Document cache hit (disk) for {doc_hash[:8]}")
        save_to_cache(doc_hash, result, "memory")  # Also save to memory for faster future access
        return result
    
    logger.info(f"OCR: Document cache miss for {doc_hash[:8]}")
    start_time = time.time()
    pages = convert_from_bytes(pdf_bytes, 300)
    chunks = list(divide_into_chunks(pages, chunk_size))
    
    with ThreadPoolExecutor() as executor:
        results = list(executor.map(process_chunk, chunks))
    
    full_text = " ".join(results)
    
    # Save result to both caches
    save_to_cache(doc_hash, full_text, "memory")
    save_to_cache(doc_hash, full_text, "disk")

    end_time = time.time()
    logger.info(f"OCR completed in {end_time - start_time:.2f} seconds for document {doc_hash[:8]}")
    
    return full_text