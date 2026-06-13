"""
Carbon Footprint Tracker - Flask Backend API
Main application entry point
"""

import os
import logging
import uuid
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
_ = load_dotenv()

# Import route blueprints
from routes.auth import bp as auth_bp
from routes.activities import bp as activities_bp
from routes.quiz import bp as quiz_bp
from routes.insights import bp as insights_bp
from routes.challenges import bp as challenges_bp
from routes.community import bp as community_bp
from routes.dashboard import bp as dashboard_bp
from routes.calculations import bp as calculations_bp

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['DEBUG'] = os.getenv('FLASK_ENV') == 'development'

# CORS configuration
def get_allowed_origins() -> list[str]:
    """
    Get allowed CORS origins from environment variable.
    Supports comma-separated multiple URLs for different environments.
    """
    frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
    
    # Support multiple origins (comma-separated)
    origins = [url.strip() for url in frontend_url.split(',') if url.strip()]
    
    # Validate origins
    if not origins:
        print("WARNING: No valid FRONTEND_URL configured, using default")
        origins = ['http://localhost:3000']
    
    return origins

# Get allowed origins
allowed_origins = get_allowed_origins()

# Configure CORS with security best practices
cors_config = {
    "origins": allowed_origins,
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin"
    ],
    "expose_headers": ["Content-Range", "X-Content-Range"],
    "supports_credentials": True,
    "max_age": 3600  # Cache preflight requests for 1 hour
}

# Apply CORS configuration to all /api/* routes
_ = CORS(app, resources={r"/api/*": cors_config})

# Log CORS configuration in development
if app.config['DEBUG']:
    print(f"CORS enabled for origins: {allowed_origins}")

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(activities_bp, url_prefix='/api/activities')
app.register_blueprint(quiz_bp, url_prefix='/api/quiz')
app.register_blueprint(insights_bp, url_prefix='/api/insights')
app.register_blueprint(challenges_bp, url_prefix='/api/challenges')
app.register_blueprint(community_bp, url_prefix='/api/community')
app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
app.register_blueprint(calculations_bp, url_prefix='/api/calculations')

# Root endpoint
@app.route('/')
def index():
    """API information endpoint"""
    return jsonify({
        'success': True,
        'message': 'Carbon Footprint Tracker API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/health',
            'auth': '/api/auth/*',
            'activities': '/api/activities/*',
            'quiz': '/api/quiz/*',
            'insights': '/api/insights/*',
            'challenges': '/api/challenges/*',
            'community': '/api/community/*',
            'dashboard': '/api/dashboard/*',
            'calculations': '/api/calculations/*'
        }
    })

# Health check endpoint
@app.route('/health')
def health():
    """Health check endpoint for monitoring"""
    return jsonify({
        'success': True,
        'status': 'healthy',
        'service': 'carbon-footprint-api',
        'environment': os.getenv('FLASK_ENV', 'production')
    })

# Utility functions for error handlers
def get_client_ip() -> str:
    """
    Extract real client IP address, handling proxies and load balancers.
    
    Returns:
        str: Client IP address or 'unknown' if not available
    """
    # Check X-Forwarded-For header (set by proxies/load balancers)
    forwarded_for = request.headers.get('X-Forwarded-For')
    if forwarded_for:
        # Take the first IP in the chain (original client)
        return forwarded_for.split(',')[0].strip()
    
    # Check X-Real-IP header (alternative proxy header)
    real_ip = request.headers.get('X-Real-IP')
    if real_ip:
        return real_ip.strip()
    
    # Fall back to remote_addr
    return request.remote_addr or 'unknown'

def sanitize_log_string(value: str, max_length: int = 500) -> str:
    """
    Sanitize string for safe logging by removing control characters and limiting length.
    
    Args:
        value: String to sanitize
        max_length: Maximum allowed length
        
    Returns:
        str: Sanitized string safe for logging
    """
    if not value:
        return ''
    
    # Remove newlines, carriage returns, and other control characters
    sanitized = value.replace('\n', '').replace('\r', '').replace('\t', ' ')
    
    # Limit length to prevent log flooding
    return sanitized[:max_length]

def generate_request_id() -> str:
    """
    Generate a unique request ID for tracing.
    
    Returns:
        str: Unique request identifier
    """
    return str(uuid.uuid4())

# Error handlers
@app.errorhandler(404)
def not_found(error: Exception) -> tuple[Response, int]:
    """
    Handle 404 Not Found errors with comprehensive logging and standardized response.
    
    Features:
    - Extracts real client IP (handles proxies/load balancers)
    - Generates unique request ID for tracing
    - Sanitizes input to prevent log injection attacks
    - Provides debug information in development mode
    - Returns consistent JSON error structure
    - Includes security headers and proper caching directives
    
    Args:
        error: The Flask error object containing error details
        
    Returns:
        tuple[Response, int]: JSON response with error details and 404 status code
        
    Security:
        - Sanitizes all user input before logging
        - Prevents log injection attacks
        - Limits exposed information in production
    """
    # Generate unique request ID for tracing across logs
    # Use existing request ID if available (e.g., from middleware)
    request_id = getattr(request, 'request_id', None) or generate_request_id()
    
    # Extract client information safely
    client_ip = get_client_ip()
    safe_path = sanitize_log_string(request.path)
    safe_method = sanitize_log_string(request.method, 10)
    safe_user_agent = sanitize_log_string(request.headers.get('User-Agent', 'unknown'), 200)
    safe_referer = sanitize_log_string(request.headers.get('Referer', 'none'), 200)
    
    # Sanitize error description to prevent information leakage
    safe_error_desc = sanitize_log_string(str(error), 100) if error else 'No error details'
    
    # Log with structured information for better monitoring
    # Use extra parameter for structured logging compatibility
    logging.warning(
        "404 Not Found [%s]: %s %s | IP: %s | User-Agent: %s | Referer: %s | Error: %s",
        request_id,
        safe_method,
        safe_path,
        client_ip,
        safe_user_agent,
        safe_referer,
        safe_error_desc,
        extra={
            'request_id': request_id,
            'client_ip': client_ip,
            'http_method': safe_method,
            'path': safe_path,
            'status_code': 404
        }
    )
    
    # Build standardized error response
    error_details: dict[str, str | int | None | dict[str, str | None]] = {
        'code': 'NOT_FOUND',
        'message': 'The requested resource was not found',
        'status': 404,
        'request_id': request_id,
        'timestamp': request.environ.get('REQUEST_START_TIME', None)
    }
    
    # Include additional debug info in development mode only
    if app.config['DEBUG']:
        error_details['debug'] = {
            'path': request.path,
            'method': request.method,
            'endpoint': request.endpoint,
            'url': request.url,
            'error_description': str(error)
        }
    
    response_data: dict[str, bool | dict[str, str | int | None | dict[str, str | None]]] = {
        'success': False,
        'error': error_details
    }
    
    # Create response with security and caching headers
    response = jsonify(response_data)
    response.headers['X-Request-ID'] = request_id
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'  # HTTP/1.0 compatibility
    response.headers['Expires'] = '0'  # Proxies
    
    return response, 404

@app.errorhandler(500)
def internal_error(error: Exception) -> tuple[Response, int]:
    """
    Handle 500 Internal Server errors.
    
    Logs the error with full traceback and returns a standardized JSON response.
    In development mode, includes additional debugging information.
    
    Args:
        error: The error object from Flask
        
    Returns:
        tuple: JSON response and HTTP status code 500
    """
    # Log the 500 error with full details for debugging
    # Log the 500 error with structured logging for better observability
    client_ip = request.remote_addr or request.headers.get('X-Forwarded-For', 'unknown')
    logging.error(
        "Internal server error occurred",
        extra={
            'error_type': type(error).__name__,
            'http_method': request.method,
            'request_path': request.path,
            'client_ip': client_ip,
            'user_agent': request.headers.get('User-Agent', 'unknown'),
            'request_id': request.headers.get('X-Request-ID', str(uuid.uuid4()))
        },
        exc_info=True  # Include full traceback in logs
    )
    
    error_details: dict[str, str | int | dict[str, str]] = {
        'code': 'INTERNAL_ERROR',
        'message': 'An internal server error occurred',
        'status': 500
    }
    
    # Include additional debug info in development mode
    if app.config['DEBUG']:
        error_details['debug'] = {
            'path': request.path,
            'method': request.method,
            'error_type': type(error).__name__,
            'error_message': str(error)
        }
    
    response: dict[str, bool | dict[str, str | int | dict[str, str]]] = {
        'success': False,
        'error': error_details
    }
    
    return jsonify(response), 500

@app.errorhandler(400)
def bad_request(error: Exception) -> tuple[Response, int]:
    """
    Handle 400 Bad Request errors.
    
    Logs the error with request details and returns a standardized JSON response.
    In development mode, includes additional debugging information.
    
    Args:
        error: The error object from Flask
        
    Returns:
        tuple: JSON response and HTTP status code 400
    """
    # Get client IP with fallback for proxy scenarios
    client_ip = get_client_ip()
    
    # Log the 400 error with structured logging for better parsing and analysis
    logging.info(
        "Bad request received",
        extra={
            'status_code': 400,
            'method': request.method,
            'path': request.path,
            'client_ip': client_ip,
            'user_agent': request.headers.get('User-Agent', 'unknown')
        }
    )
    
    error_details: dict[str, str | int | dict[str, str]] = {
        'code': 'BAD_REQUEST',
        'message': 'The request was invalid or malformed',
        'status': 400
    }
    
    # Include additional debug info in development mode
    if app.config['DEBUG']:
        error_details['debug'] = {
            'path': request.path,
            'method': request.method,
            'error_message': str(error)
        }
    
    response: dict[str, bool | dict[str, str | int | dict[str, str]]] = {
        'success': False,
        'error': error_details
    }
    
    return jsonify(response), 400

# Run the application
if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    print(f"Starting Carbon Footprint Tracker API on port {port}")
    print(f"Environment: {os.getenv('FLASK_ENV', 'production')}")
    print(f"Debug mode: {debug}")
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )

# Made with Bob
