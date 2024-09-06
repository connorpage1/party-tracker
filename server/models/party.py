from models.__init__ import SerializerMixin, validates, db, datetime, association_proxy
from datetime import timedelta
from sqlalchemy import event



class Party(db.Model, SerializerMixin):
    __tablename__ = "parties"
    
    id = db.Column(db.Integer, primary_key=True)
    theme = db.Column(db.String)
    date_and_start_time = db.Column(db.DateTime, nullable=False)
    duration = db.Column(db.Float, nullable=False)
    end_time =db.Column(db.DateTime)
    status = db.Column(db.String, nullable=False)
    organization = db.Column(db.String)
    guest_number = db.Column(db.Integer, nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    location = db.Column(db.String, nullable=False)
    discount = db.Column(db.Float, default=0)
    
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    
    customer = db.relationship("Customer", back_populates="parties")
    contract = db.relationship("Contract", back_populates='party')
    user = db.relationship("User", back_populates="parties")
    party_packages = db.relationship("PartyPackage", back_populates='party')
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
    
    
    def to_dict_custom(self):
        return {
            'id': self.id,
            'theme': self.theme,
            'date_and_start_time': str(self.date_and_start_time),
            'end_time': str(self.end_time),
            'status': self.status,
            'organization': self.organization,
            'guest_number': self.guest_number,
            'location': self.location,
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
    