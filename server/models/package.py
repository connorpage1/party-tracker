from server.models import SerializerMixin, validates, db, association_proxy

class Package(db.Model, SerializerMixin):
    __tablename__ = 'packages'
    
    __table_args__ = {'extend_existing': True}

    
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
    ph_rate_time_hours = db.Column(db.Float, default=2)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    
    party_packages = db.relationship("PartyPackage", back_populates="package")
    parties = association_proxy('party_packages', 'party')

    serialize_rules = ('-party_packages.package', '-party_packages.party')
    @property
    def package_type(self):
        """Converts type_id to type name."""
        if self.type_id == self.TYPE_FOOD:
            return "food"
        elif self.type_id == self.TYPE_BAR_PACKAGE:
            return "bar package"
        elif self.type_id == self.TYPE_BAR_MIN_SPEND:
            return "minimum spend"
        elif self.type_id == self.TYPE_ROOM_FEE:
            return "room fee"
        elif self.type_id == self.TYPE_CLEANING_FEE:
            return "cleaning fee"
        else:
            return "unknown"

    @package_type.setter
    def package_type(self, type_name):
        """Sets type_id based on the type name."""
        if type_name == "food":
            self.type_id = self.TYPE_FOOD
        elif type_name == "bar package":
            self.type_id = self.TYPE_BAR_PACKAGE
        elif type_name == "minimum spend":
            self.type_id = self.TYPE_BAR_MIN_SPEND
        elif type_name == "room fee":
            self.type_id = self.TYPE_ROOM_FEE
        elif type_name == "cleaning fee":
            self.type_id = self.TYPE_CLEANING_FEE
        else:
            raise ValueError("Invalid role name")