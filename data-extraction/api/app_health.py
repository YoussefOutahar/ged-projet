from flask import Blueprint, jsonify, current_app

bp = Blueprint('health', __name__)

@bp.route('/health', methods=['GET'])
def health_check():
    current_app.logger.info("Health check successful")
    return jsonify({"status": "healthy"}), 200

@bp.route('/site-map', methods=['GET'])
def site_map():
    output = []
    for rule in current_app.url_map.iter_rules():
        methods = ','.join(sorted(rule.methods))
        line = f"{rule.endpoint}: {rule.rule} [{methods}]"
        output.append(line)
    return jsonify(output), 200