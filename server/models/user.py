from server.models import db, SerializerMixin, validates, flask_bcrypt, hybrid_property, re

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    ROLE_ADMIN = 1
    ROLE_MANAGER = 2
    ROLE_BARTENDER = 3
    ROLE_CUSTOMER = 4
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column('password', db.String, nullable=False)
    role_id = db.Column(db.Integer, nullable=False)
    
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    
    serialize_only = ("username", "id", "role_id", 'first_name', "last_name", "role")
    
    parties = db.relationship('Party', back_populates='user')
    
    def __init__(self, email, username, password_hash=None, **kwargs):
        super().__init__(email=email, username=username, **kwargs)
        if password_hash:
            self.password_hash = password_hash
            
            
    @hybrid_property
    def password_hash(self):
        raise AttributeError("Passwords are private")

    @password_hash.setter
    def password_hash(self, new_pw):
        if not isinstance(new_pw, str):
            raise TypeError("Passwords must be a string")
        elif len(new_pw) < 8:
            raise ValueError("Passwords must be at least 8 characters")
        hashed_pw = flask_bcrypt.generate_password_hash(new_pw).decode("utf-8")
        self._password_hash = hashed_pw
        
    def authenticate(self, pw_to_check):
        print("Inside authenticate")
        return flask_bcrypt.check_password_hash(self._password_hash, pw_to_check)
    
    @validates("email")
    def validate_email(self, _, email):
        if not isinstance(email, str):
            raise TypeError("Email must be a string")
        elif not re.match(r"^[\w\.-]+@([\w]+\.)+[\w-]{2,}$", email):
            raise ValueError("Email must be in a proper format")
        return email
    @property
    def role(self):
        """Converts role_id to role name."""
        if self.role_id == self.ROLE_ADMIN:
            return "admin"
        elif self.role_id == self.ROLE_MANAGER:
            return "manager"
        elif self.role_id == self.ROLE_BARTENDER:
            return "bartender"
        elif self.role_id == self.ROLE_CUSTOMER:
            return "customer"
        
        else:
            return "unknown"

    @role.setter
    def role(self, role_name):
        """Sets role_id based on the role name."""
        if role_name == "admin":
            self.role_id = self.ROLE_ADMIN
        elif role_name == "manager":
            self.role_id = self.ROLE_MANAGER
        elif role_name == "bartender":
            self.role_id = self.ROLE_BARTENDER
        elif role_name == "customer":
            self.role_id = self.ROLE_CUSTOMER
        else:
            raise ValueError("Invalid role name")