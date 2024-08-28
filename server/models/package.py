from models.__init__ import SerializerMixin, validates, db, association_proxy

class Package(db.Model, SerializerMixin):
    __tablename__ = 'packages'
    
    TYPE_FOOD = 1
    TYPE_BAR_PACKAGE = 2
    TYPE_BAR_MIN_SPEND = 3
    TYPE_ROOM_FEE = 4
    TYPE_CLEANING_FEE = 5
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    type_id = db.Column(db.Integer)
    per_head = db.Column(db.Boolean, default=False)
    price = db.Column(db.Float)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    
    party_packages = db.relationship("PartyPackage", back_populates="package")
    parties = association_proxy('party_packages', 'party')

    