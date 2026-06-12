from flask import Blueprint, jsonify
bp = Blueprint('dashboard', __name__)
@bp.route('/summary', methods=['GET'])
def get_summary():
    return jsonify({'success': True, 'message': 'Dashboard endpoint - to be implemented'}), 200
