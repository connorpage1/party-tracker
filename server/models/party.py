from models.__init__ import SerializerMixin, validates, db, datetime, association_proxy


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
    
    customer = db.relationship("Customer", back_populates="parties")
    contract = db.relationship("Contract", back_populates='party')
    user = db.relationship("User", back_populates="parties")
    party_packages = db.relationship("PartyPackage", back_populates='party')
    packages = association_proxy('party_packages', 'package')
    
    serialize_only = ('name', 'date_and_start_time', 'end_time', 'status')
    
    @validates("name", "status", "organization")
    def validate_strings(self, key, value):
        if value:
            if not isinstance(value, str):
                raise TypeError(f"{key} must be a string")
            elif len(value) < 1:
                raise ValueError(f"{key} must be at least one character long")
        return value
    
    #! Might want to implement this validation in the future, 
    #! but for now want to be able to add past parties
    # @validates("date_and_start_time")
    # def date_in_future(self, _, date_time):
    #     if date_time < datetime.now():
    #         raise ValueError("Start date must be in the future")
    #     return date_time