"""Authentication API routes."""

from __future__ import annotations

from typing import Any

from flask import Blueprint, jsonify, request

bp = Blueprint("auth", __name__)


def _not_implemented_response(action: str) -> tuple[Any, int]:
    """Return a consistent placeholder response for unimplemented auth endpoints."""
    payload = {
        "success": False,
        "message": f"{action} is not implemented yet.",
    }
    return jsonify(payload), 501


@bp.route("/signup", methods=["POST"])
def signup() -> tuple[Any, int]:
    """Handle user registration requests."""
    # Get JSON data (will be used when implementing actual logic)
    data = request.get_json(silent=True)
    return _not_implemented_response("Signup")


@bp.route("/signin", methods=["POST"])
def signin() -> tuple[Any, int]:
    """Handle user login requests."""
    # Get JSON data (will be used when implementing actual logic)
    data = request.get_json(silent=True)
    return _not_implemented_response("Signin")


@bp.route("/signout", methods=["POST"])
def signout() -> tuple[Any, int]:
    """Handle user logout requests."""
    # Get JSON data (will be used when implementing actual logic)
    data = request.get_json(silent=True)
    return _not_implemented_response("Signout")
