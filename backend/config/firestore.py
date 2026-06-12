"""
Firestore Database Configuration
"""

import os
from google.cloud import firestore
from firebase_admin import credentials, firestore as admin_firestore, initialize_app

# Initialize Firebase Admin SDK
def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    try:
        # Check if already initialized
        import firebase_admin
        if not firebase_admin._apps:
            # In production (App Engine), use default credentials
            if os.getenv('GOOGLE_APPLICATION_CREDENTIALS'):
                cred = credentials.Certificate(os.getenv('GOOGLE_APPLICATION_CREDENTIALS'))
                initialize_app(cred)
            else:
                # Use default credentials in App Engine
                initialize_app()
        
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
def get_collection(collection_name):
    """Get a Firestore collection reference"""
    db = get_db()
    prefix = os.getenv('FIRESTORE_COLLECTION_PREFIX', '')
    return db.collection(f"{prefix}{COLLECTIONS.get(collection_name, collection_name)}")

def create_document(collection_name, data, doc_id=None):
    """Create a new document in a collection"""
    collection = get_collection(collection_name)
    if doc_id:
        doc_ref = collection.document(doc_id)
        doc_ref.set(data)
        return doc_id
    else:
        doc_ref = collection.document()
        doc_ref.set(data)
        return doc_ref.id

def get_document(collection_name, doc_id):
    """Get a document by ID"""
    collection = get_collection(collection_name)
    doc = collection.document(doc_id).get()
    if doc.exists:
        return {'id': doc.id, **doc.to_dict()}
    return None

def update_document(collection_name, doc_id, data):
    """Update a document"""
    collection = get_collection(collection_name)
    doc_ref = collection.document(doc_id)
    doc_ref.update(data)
    return True

def delete_document(collection_name, doc_id):
    """Delete a document"""
    collection = get_collection(collection_name)
    collection.document(doc_id).delete()
    return True

def query_documents(collection_name, filters=None, order_by=None, limit=None):
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
    return [{'id': doc.id, **doc.to_dict()} for doc in docs]

# Made with Bob
