"""
Firestore Database Configuration
"""

import os
from typing import Any, cast
import firebase_admin
from firebase_admin import credentials, firestore as admin_firestore
from firebase_admin.credentials import Certificate
from google.cloud.firestore_v1.base_document import DocumentSnapshot
from google.cloud.firestore_v1.base_document import BaseDocumentReference
from google.cloud.firestore_v1.types import WriteResult

# Type alias for better type checking
type CredentialType = Certificate | None

# Initialize Firebase Admin SDK
def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    try:
        # Check if already initialized using public API
        try:
            firebase_admin.get_app()
        except ValueError:
            # App not initialized, so initialize it
            # In production (App Engine), use default credentials
            cred_path: str | None = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
            if cred_path:
                cred: CredentialType = credentials.Certificate(cred_path)
                _ = firebase_admin.initialize_app(cast(Any, cred))
            else:
                # Use default credentials in App Engine
                _ = firebase_admin.initialize_app()
        
        return admin_firestore.client()
    except Exception as e:
        print(f"Error initializing Firebase: {e}")
        raise

# Get Firestore client
def get_db():
    """Get Firestore database client"""
    return initialize_firebase()

# Collection names
COLLECTIONS = {
    'users': 'users',
    'user_profiles': 'user_profiles',
    'activity_logs': 'activity_logs',
    'emission_factors': 'emission_factors',
    'quiz_responses': 'quiz_responses',
    'user_insights': 'user_insights',
    'challenges': 'challenges',
    'user_challenges': 'user_challenges',
    'achievements': 'achievements',
    'community_posts': 'community_posts',
    'post_likes': 'post_likes'
}

# Helper functions
def get_collection(collection_name: str):
    """Get a Firestore collection reference"""
    db = get_db()
    prefix = os.getenv('FIRESTORE_COLLECTION_PREFIX', '')
    return db.collection(f"{prefix}{COLLECTIONS.get(collection_name, collection_name)}")

def create_document(collection_name: str, data: dict[str, Any], doc_id: str | None = None) -> str:
    """Create a new document in a collection"""
    collection = get_collection(collection_name)
    if doc_id:
        doc_ref: BaseDocumentReference = collection.document(doc_id)
        doc_ref.set(data)
        return doc_id
    else:
        doc_ref: BaseDocumentReference = collection.document()
        doc_ref.set(data)
        return doc_ref.id

def get_document(collection_name: str, doc_id: str) -> dict[str, Any] | None:
    """Get a document by ID"""
    collection = get_collection(collection_name)
    doc_result = collection.document(doc_id).get()
    doc = cast(DocumentSnapshot, doc_result)
    if not doc.exists:
        return None

    data = doc.to_dict()
    if data is None:
        return None

    return {'id': doc.id, **data}

def update_document(collection_name: str, doc_id: str, data: dict[str, Any]) -> bool:
    """Update a document"""
    collection = get_collection(collection_name)
    doc_ref = collection.document(doc_id)
    doc_ref.update(data)
    return True

def delete_document(collection_name: str, doc_id: str) -> bool:
    """Delete a document"""
    collection = get_collection(collection_name)
    collection.document(doc_id).delete()
    return True

def query_documents(
    collection_name: str,
    filters: list[tuple[str, str, Any]] | None = None,
    order_by: list[tuple[str, str]] | None = None,
    limit: int | None = None
) -> list[dict[str, Any]]:
    """Query documents with filters"""
    collection = get_collection(collection_name)
    query = collection
    
    if filters:
        for field, operator, value in filters:
            query = query.where(field, operator, value)
    
    if order_by:
        for field, direction in order_by:
            query = query.order_by(field, direction=direction)
    
    if limit:
        query = query.limit(limit)
    
    docs = query.stream()
    results: list[dict[str, Any]] = []

    for doc in docs:
        data = doc.to_dict()
        if data is None:
            continue
        results.append({'id': doc.id, **data})

    return results

# Made with Bob
