from models.__init__ import db, SerializerMixin, validates, flask_bcrypt, hybrid_property

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    ROLE_MANAGER = 1
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column('password', db.String, nullable=False)
    role_id = db.Column(db.Integer, nullable=False)
    
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    
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