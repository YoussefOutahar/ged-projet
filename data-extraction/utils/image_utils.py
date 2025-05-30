from PIL import Image, ImageEnhance
import numpy as np

def binarize_image(image):
    gray = image.convert('L')
    
    np_image = np.array(gray)
    
    mean = np.mean(np_image)
    
    binary = np_image > mean
    
    return Image.fromarray((binary * 255).astype(np.uint8))

def enhance_image(image):
    # Convert to grayscale
    gray = image.convert('L')
    
    # Enhance contrast
    enhancer = ImageEnhance.Contrast(gray)
    enhanced = enhancer.enhance(2.0)  # Increase contrast
    
    # Enhance sharpness
    enhancer = ImageEnhance.Sharpness(enhanced)
    sharpened = enhancer.enhance(1.5)  # Increase sharpness
    
    return sharpened