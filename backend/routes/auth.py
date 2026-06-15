"""Authentication API routes."""

from __future__ import annotations

from typing import Any
from datetime import datetime, timezone
import re

from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import os

from config.firestore import create_document, query_documents

bp = Blueprint("auth", __name__)


def validate_email(email: str) -> bool:
    """Validate email format."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_password(password: str) -> tuple[bool, str]:
    """Validate password strength."""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Za-z]', password):
        return False, "Password must contain at least one letter"
    if not re.search(r'[0-9]', password):
        return False, "Password must contain at least one number"
    return True, ""


def generate_token(user_id: str) -> str:
    """Generate JWT token for user."""
    secret_key = os.getenv('JWT_SECRET_KEY', 'dev-jwt-secret-key')
    expiration_hours = int(os.getenv('JWT_EXPIRATION_HOURS', '24'))
    
    payload = {
        'user_id': user_id,
        'exp': datetime.now(timezone.utc).timestamp() + (expiration_hours * 3600)
    }
    
    return jwt.encode(payload, secret_key, algorithm='HS256')


@bp.route("/signup", methods=["POST"])
def signup() -> tuple[Any, int]:
    """Handle user registration requests."""
    try:
        data = request.get_json(silent=True)
        
        if not data:
            return jsonify({
                "success": False,
                "error": {
                    "code": "INVALID_REQUEST",
                    "message": "Request body is required"
                }
            }), 400
        
        # Extract and validate required fields
        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        # Validate required fields
        if not name:
            return jsonify({
                "success": False,
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "Name is required"
                }
            }), 400
        
        if not email:
            return jsonify({
                "success": False,
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "Email is required"
                }
            }), 400
        
        if not password:
            return jsonify({
                "success": False,
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "Password is required"
                }
            }), 400
        
        # Validate email format
        if not validate_email(email):
            return jsonify({
                "success": False,
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "Invalid email format"
                }
            }), 400
        
        # Validate password strength
        is_valid, error_message = validate_password(password)
        if not is_valid:
            return jsonify({
                "success": False,
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": error_message
                }
            }), 400
        
        # Check if user already exists
        existing_users = query_documents(
            'users',
            filters=[('email', '==', email)]
        )
        
        if existing_users:
            return jsonify({
                "success": False,
                "error": {
                    "code": "USER_EXISTS",
                    "message": "An account with this email already exists"
                }
            }), 409
        
        # Hash password
        password_hash = generate_password_hash(password)
        
        # Create user document
        user_data = {
            'name': name,
            'email': email,
            'password_hash': password_hash,
            'created_at': datetime.now(timezone.utc).isoformat(),
            'updated_at': datetime.now(timezone.utc).isoformat(),
            'onboarding_completed': False
        }
        
        user_id = create_document('users', user_data)
        
        # Generate JWT token
        token = generate_token(user_id)
        
        # Return success response
        return jsonify({
            "success": True,
            "data": {
                "user": {
                    "id": user_id,
                    "name": name,
                    "email": email,
                    "onboarding_completed": False
                },
                "token": token
            },
            "message": "Account created successfully"
        }), 201
        
    except Exception as e:
        print(f"Signup error: {str(e)}")
        return jsonify({
            "success": False,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An error occurred during signup"
            }
        }), 500


@bp.route("/signin", methods=["POST"])
def signin() -> tuple[Any, int]:
    """Handle user login requests."""
    try:
        data = request.get_json(silent=True)
        
        if not data:
            return jsonify({
                "success": False,
                "error": {
                    "code": "INVALID_REQUEST",
                    "message": "Request body is required"
                }
            }), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({
                "success": False,
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "Email and password are required"
                }
            }), 400
        
        # Find user by email
        users = query_documents(
            'users',
            filters=[('email', '==', email)]
        )
        
        if not users:
            return jsonify({
                "success": False,
                "error": {
                    "code": "INVALID_CREDENTIALS",
                    "message": "Invalid email or password"
                }
            }), 401
        
        user = users[0]
        
        # Verify password
        if not check_password_hash(user['password_hash'], password):
            return jsonify({
                "success": False,
                "error": {
                    "code": "INVALID_CREDENTIALS",
                    "message": "Invalid email or password"
                }
            }), 401
        
        # Generate JWT token
        token = generate_token(user['id'])
        
        # Return success response
        return jsonify({
            "success": True,
            "data": {
                "user": {
                    "id": user['id'],
                    "name": user['name'],
                    "email": user['email'],
                    "onboarding_completed": user.get('onboarding_completed', False)
                },
                "token": token
            },
            "message": "Signed in successfully"
        }), 200
        
    except Exception as e:
        print(f"Signin error: {str(e)}")
        return jsonify({
            "success": False,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An error occurred during signin"
            }
        }), 500


@bp.route("/signout", methods=["POST"])
def signout() -> tuple[Any, int]:
    """Handle user logout requests."""
    # For JWT-based auth, signout is handled client-side by removing the token
    return jsonify({
        "success": True,
        "message": "Signed out successfully"
    }), 200
