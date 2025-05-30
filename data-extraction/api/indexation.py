from flask import Blueprint, current_app, jsonify, request

from services import process_documents_parallel

bp = Blueprint('index', __name__)

@bp.route('/extract-certificate-data', methods=['POST'])
def extract_certificate_data():
    current_app.logger.debug("Entered /extract-data endpoint")
    
    if 'files' not in request.files:
        current_app.logger.debug("No file part in the request")
        return jsonify({"error": "No file part in the request"}), 400

    files = request.files.getlist('files')
    
    if not files or files[0].filename == '':
        current_app.logger.debug("No selected file")
        return jsonify({"error": "No selected file"}), 400
    
    try:
        file_contents = []
        filenames = []
        for file in files:
            file_contents.append(file.read())
            filenames.append(file.filename)
        
        results = process_documents_parallel(file_contents)
        
        combined_results = {filename: result for filename, result in zip(filenames, results)}
        
        return jsonify(combined_results), 200
    except Exception as e:
        current_app.logger.error(f"An error occurred while extracting data from the PDF: {e}")
        return jsonify({"error": "An error occurred while extracting data from the PDF"}), 500
