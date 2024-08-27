from models.__init__ import SerializerMixin, validates, db

class Package(db.Model, SerializerMixin):
    __tablename__ = 'packages'
    
    TYPE_FOOD = 1
    TYPE_BAR_PACKAGE = 2
    TYPE_BAR_MIN_SPEND = 3
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    type_id = db.Column(db.Integer)
    description = db.Column(db.String)
    price = db.Column(db.Float)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    