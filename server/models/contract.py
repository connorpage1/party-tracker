from models.__init__ import SerializerMixin, validates, db, re

class Contract(db.Model, SerializerMixin):
    __tablename__ = 'contracts'
    
    id = db.Column(db.Integer, primary_key=True)
    terms = db.Column(db.String)
    date_signed = db.Column(db.DateTime)
    status = db.Column(db.String)
    party_id = db.Column(db.Integer, db.ForeignKey('parties.id'), nullable=False)
    
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    