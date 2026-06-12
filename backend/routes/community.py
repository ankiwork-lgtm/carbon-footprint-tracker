from flask import Blueprint, jsonify
bp = Blueprint('community', __name__)
@bp.route('/posts', methods=['GET'])
def get_posts():
    return jsonify({'success': True, 'message': 'Community endpoint - to be implemented'}), 200
