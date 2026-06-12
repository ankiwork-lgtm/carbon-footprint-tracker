"""
Activities API Routes
Handles activity logging and retrieval
"""

from flask import Blueprint, request, jsonify
from datetime import datetime
from services.carbon_calculator import CarbonCalculator
from config.firestore import create_document, get_document, update_document, delete_document, query_documents
import uuid

bp = Blueprint('activities', __name__)

@bp.route('', methods=['POST'])
def log_activity():
    """Log a new activity"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['user_id', 'category', 'activity_type', 'amount', 'date']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': {
                        'code': 'VALIDATION_ERROR',
                        'message': f'Missing required field: {field}'
                    }
                }), 400
        
        # Calculate emissions
        calculation = CarbonCalculator.calculate_emissions(
            category=data['category'],
            activity_type=data['activity_type'],
            amount=float(data['amount']),
            unit=data.get('unit')
        )
        
        # Create activity document
        activity_data = {
            'user_id': data['user_id'],
            'category': data['category'],
            'activity_type': data['activity_type'],
            'amount': float(data['amount']),
            'unit': calculation['unit'],
            'emissions_kg': calculation['emissions_kg'],
            'date': data['date'],
            'notes': data.get('notes', ''),
            'created_at': datetime.utcnow().isoformat()
        }
        
        # Save to Firestore
        activity_id = create_document('activity_logs', activity_data)
        activity_data['id'] = activity_id
        
        # Get daily total
        daily_total = CarbonCalculator.get_daily_total(data['user_id'], data['date'])
        
        # Get user's daily target (simplified - would come from user profile)
        daily_target = 8.0  # kg CO2
        
        status = 'under_target' if daily_total <= daily_target else 'over_target'
        
        return jsonify({
            'success': True,
            'data': {
                'activity': activity_data,
                'daily_total': daily_total,
                'daily_target': daily_target,
                'status': status
            }
        }), 201
        
    except ValueError as e:
        return jsonify({
            'success': False,
            'error': {
                'code': 'VALIDATION_ERROR',
                'message': str(e)
            }
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': str(e)
            }
        }), 500

@bp.route('', methods=['GET'])
def get_activities():
    """Get user's activity history"""
    try:
        user_id = request.args.get('user_id')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        category = request.args.get('category')
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        
        if not user_id:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'user_id is required'
                }
            }), 400
        
        # Build filters
        filters = [('user_id', '==', user_id)]
        
        if start_date:
            filters.append(('date', '>=', start_date))
        if end_date:
            filters.append(('date', '<=', end_date))
        if category:
            filters.append(('category', '==', category))
        
        # Query activities
        activities = query_documents(
            'activity_logs',
            filters=filters,
            order_by=[('date', 'DESCENDING')],
            limit=limit
        )
        
        return jsonify({
            'success': True,
            'data': {
                'activities': activities,
                'pagination': {
                    'page': page,
                    'limit': limit,
                    'total': len(activities)
                }
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': str(e)
            }
        }), 500

@bp.route('/<activity_id>', methods=['PUT'])
def update_activity(activity_id):
    """Update an existing activity"""
    try:
        data = request.get_json()
        
        # Get existing activity
        activity = get_document('activity_logs', activity_id)
        if not activity:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'NOT_FOUND',
                    'message': 'Activity not found'
                }
            }), 404
        
        # Recalculate emissions if amount changed
        if 'amount' in data:
            calculation = CarbonCalculator.calculate_emissions(
                category=activity['category'],
                activity_type=activity['activity_type'],
                amount=float(data['amount']),
                unit=activity.get('unit')
            )
            data['emissions_kg'] = calculation['emissions_kg']
        
        # Update document
        data['updated_at'] = datetime.utcnow().isoformat()
        update_document('activity_logs', activity_id, data)
        
        # Get updated activity
        updated_activity = get_document('activity_logs', activity_id)
        
        return jsonify({
            'success': True,
            'data': {
                'activity': updated_activity
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': str(e)
            }
        }), 500

@bp.route('/<activity_id>', methods=['DELETE'])
def delete_activity_route(activity_id):
    """Delete an activity"""
    try:
        # Check if activity exists
        activity = get_document('activity_logs', activity_id)
        if not activity:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'NOT_FOUND',
                    'message': 'Activity not found'
                }
            }), 404
        
        # Delete document
        delete_document('activity_logs', activity_id)
        
        return jsonify({
            'success': True,
            'message': 'Activity deleted successfully'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': str(e)
            }
        }), 500

@bp.route('/summary', methods=['GET'])
def get_summary():
    """Get activity summary for a time period"""
    try:
        user_id = request.args.get('user_id')
        period = request.args.get('period', 'weekly')  # daily, weekly, monthly
        date = request.args.get('date')  # Optional specific date
        
        if not user_id:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'user_id is required'
                }
            }), 400
        
        # Calculate date range based on period
        if date:
            target_date = datetime.strptime(date, '%Y-%m-%d')
        else:
            target_date = datetime.now()
        
        if period == 'daily':
            start_date = target_date.strftime('%Y-%m-%d')
            end_date = start_date
        elif period == 'weekly':
            start_date = (target_date - timedelta(days=6)).strftime('%Y-%m-%d')
            end_date = target_date.strftime('%Y-%m-%d')
        else:  # monthly
            start_date = target_date.replace(day=1).strftime('%Y-%m-%d')
            end_date = target_date.strftime('%Y-%m-%d')
        
        # Get summary
        summary = CarbonCalculator.get_period_summary(user_id, start_date, end_date)
        
        # Compare to baseline
        comparison = CarbonCalculator.compare_to_baseline(
            user_id,
            summary['average_daily']
        )
        
        return jsonify({
            'success': True,
            'data': {
                'period': period,
                'start_date': start_date,
                'end_date': end_date,
                'total_emissions': summary['total_emissions'],
                'average_daily': summary['average_daily'],
                'breakdown': summary['breakdown'],
                'compared_to_baseline': comparison
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': str(e)
            }
        }), 500

# Made with Bob
