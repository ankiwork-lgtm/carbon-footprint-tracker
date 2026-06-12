from flask import Blueprint, jsonify
bp = Blueprint('challenges', __name__)
@bp.route('', methods=['GET'])
def get_challenges():
    return jsonify({'success': True, 'message': 'Challenges endpoint - to be implemented'}), 200
