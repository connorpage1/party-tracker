from models.__init__ import SerializerMixin, validates, db, re


class Party(db.Model, SerializerMixin):
    __tablename__ = "parties"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    date_and_start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String, nullable=False)
    organization = db.Column(db.String)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    
    