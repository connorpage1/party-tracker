from server.models import SerializerMixin, validates, db, datetime, association_proxy
from datetime import timedelta
from sqlalchemy import event



class Party(db.Model, SerializerMixin):
    __tablename__ = "parties"
    
    LH_AND_GRASS = 1
    LH_NO_GRASS = 2
    FULL_WH = 3
    PART_WH = 4
    FULL_BUY = 5
    TERRACE = 6
    OAK_TREE = 7
    OAK_AND_TERRACE = 8
    GRASS_ONLY = 9
    
    TENTATIVE = 1
    CONFIRMED_PENDING_DEETS = 2
    AWAITING_CONTRACT_OR_PAYMENT = 3
    CANCELLED = 4
    CONFIRMED_PAID = 5
    FINALIZED = 6
    FOLLOW_UP = 7
    COMPLETED = 8
    
    id = db.Column(db.Integer, primary_key=True)
    theme = db.Column(db.String)
    date_and_start_time = db.Column(db.DateTime, nullable=False)
    duration = db.Column(db.Float, nullable=False)
    end_time =db.Column(db.DateTime)
    status_id = db.Column(db.Integer, nullable=False)
    organization = db.Column(db.String)
    guest_number = db.Column(db.Integer, nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    location_id = db.Column(db.Integer, nullable=False)
    discount = db.Column(db.Float, default=0)
    
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    
    customer = db.relationship("Customer", back_populates="parties")
    contract = db.relationship("Contract", back_populates='party', cascade='all, delete-orphan')
    user = db.relationship("User", back_populates="parties")
    party_packages = db.relationship("PartyPackage", back_populates='party', cascade='all, delete-orphan')
    packages = association_proxy('party_packages', 'package')
    
    serialize_only = ('id', 'theme', 'date_and_start_time', 'end_time', 'status')
    
    @property
    def end_time(self):
        if self.date_and_start_time and self.duration:
            return self.date_and_start_time + timedelta(hours=self.duration)
        return None
    
    
    @validates("theme", "status", "organization")
    def validate_strings(self, key, value):
        if value:
            if not isinstance(value, str):
                raise TypeError(f"{key} must be a string")
            elif len(value) < 1:
                raise ValueError(f"{key} must be at least one character long")
        return value
    
    
    @property
    def location(self):
        if self.location_id == self.LH_AND_GRASS:
            return 'Little House and Grass'
        elif self.location_id == self.LH_NO_GRASS:
            return 'Little House ONLY, (no grass)'
        elif self.location_id == self.FULL_WH:
            return 'Full Warehouse'
        elif self.location_id == self.PART_WH:
            return 'Partial Warehouse'
        elif self.location_id == self.FULL_BUY:
            return 'Full Buyout'
        elif self.location_id == self.TERRACE:
            return 'Terrace'
        elif self.location_id == self.OAK_TREE:
            return 'Oak Tree'
        elif self.location_id == self.OAK_AND_TERRACE:
            return 'Oak Tree and Terrace'
        elif self.location_id == self.GRASS_ONLY:
            return 'Grass ONLY'
    
    @property
    def status(self):
        if self.status_id == self.TENTATIVE:
            return 'Tentative (Hold Date)'
        elif self.status_id == self.CONFIRMED_PENDING_DEETS:
            return 'Date Confimed, Pending Party Details'
        elif self.status_id == self.AWAITING_CONTRACT_OR_PAYMENT:
            return 'Awaiting Contract/Payment'
        elif self.status_id == self.CANCELLED:
            return 'Cancelled'
        elif self.status_id == self.CONFIRMED_PAID:
            return 'Confirmed, Paid'
        elif self.status_id == self.FINALIZED:
            return 'Finalized'
        elif self.status_id == self.FOLLOW_UP:
            return 'Needs Follow-Up'
        elif self.status_id == self.COMPLETED:
            return 'Completed'

    def to_dict_custom(self):
        return {
            'id': self.id,
            'theme': self.theme,
            'date_and_start_time': str(self.date_and_start_time),
            'end_time': str(self.end_time),
            'duration': self.duration,
            'status': self.status,
            'status_id': self.status_id,
            'organization': self.organization,
            'guest_number': self.guest_number,
            'location': self.location,
            'location_id': self.location_id,
            'discount': self.discount,
            'customer': {
                'id': self.customer.id,
                'first_name': self.customer.first_name,
                'last_name': self.customer.last_name,
                'email': self.customer.email,
                'phone': self.customer.phone
            },
            'party_packages': [
                {
                    'id': pp.id,
                    'description': pp.description,
                    'price_at_purchase': pp.price_at_purchase,
                    'over_package_time': pp.over_package_time,
                    'price_per_head': pp.price_per_head,
                    'total_price': pp.total_price,
                    'package': pp.package.to_dict(rules=('-party_packages',))
                } for pp in self.party_packages
            ]
        }
    #! Might want to implement this validation in the future, 
    #! but for now want to be able to add past parties
    # @validates("date_and_start_time")
    # def date_in_future(self, _, date_time):
    #     if date_time < datetime.now():
    #         raise ValueError("Start date must be in the future")
    #     return date_time
    