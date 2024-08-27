from models.__init__ import SerializerMixin, validates, db

class PartyPackage(db.Model, SerializerMixin):
    __tablename__ = 'party_packages'
    
    id = db.Column(db.Integer, primary_key=True)
    party_id = db.Column(db.String, db.ForeignKey('parties.id'))
    package_id = db.Column(db.String, db.ForeignKey('packages.id'))

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    