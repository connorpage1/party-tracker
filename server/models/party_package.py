from models.__init__ import SerializerMixin, validates, db
from models.package import Package
from sqlalchemy import event

class PartyPackage(db.Model, SerializerMixin):
    __tablename__ = 'party_packages'
    
    id = db.Column(db.Integer, primary_key=True)
    party_id = db.Column(db.Integer, db.ForeignKey('parties.id'))
    package_id = db.Column(db.Integer, db.ForeignKey('packages.id'))
    description = db.Column(db.String)
    price_at_purchase = db.Column(db.Float, nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    
    party = db.relationship("Party", back_populates='party_packages')
    package = db.relationship("Package", back_populates='party_packages')
    
    serialize_rules = ('-party.party_packages', '-package.party_packages')

    @property
    def over_package_time(self):
        if self.party.duration > self.package.ph_rate_time_hours:
            return self.party.duration - self.package.ph_rate_time_hours
        return 0
    
    @property
    def price_per_head(self):
        if self.package.per_head:
            if self.over_package_time:
                return self.price_at_purchase * (1 + self.over_package_time)  
            return self.price_at_purchase
        return 0
    
    @property
    def total_price(self):
        if self.price_per_head:
            return self.price_per_head * self.party.guest_number
        
        return self.price_at_purchase
    
@event.listens_for(PartyPackage, 'before_insert')
def set_price_at_purchase(mapper, connection, target):
    # Ensure package is loaded and price_at_purchase is set
    if target.package_id and not target.price_at_purchase:
        package = db.session.query(Package).get(target.package_id)
        if package:
            target.price_at_purchase = package.price
        else:
            raise ValueError(f"Package with id {target.package_id} not found.")
        