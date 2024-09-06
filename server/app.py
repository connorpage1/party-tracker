import os
from config import app

from models.contract import Contract
from models.customer import Customer
from models.user import User
from models.party import Party
from models.package import Package
from models.party_package import PartyPackage

from config import app, db, api, jwt, mail
from routes.party_routes import Parties, PartiesById
from routes.customer_routes import Customers, CustomerById
from routes.authentication import Login, Logout, Me
from routes.package_routes import Packages


from flask_jwt_extended import (
    create_access_token,
    set_access_cookies,
    unset_access_cookies,
    get_jwt,
    get_jwt_identity,
    current_user,
    jwt_required
    
)
from flask_mail import Message

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get("DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")

# Register a callback function that loads a user from your database whenever
# a protected route is accessed. This should return any python object on a
# successful lookup, or None if the lookup failed for any reason (for example
# if the user has been deleted from the database).
@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return db.session.get(User, identity)

api.add_resource(Parties, '/parties')
api.add_resource(PartiesById, '/parties/<int:id>')
api.add_resource(Customers, '/customers')
api.add_resource(CustomerById, '/customers/<int:id>')
api.add_resource(Login, '/login')
api.add_resource(Packages, '/packages')
api.add_resource(Logout, '/signout')
api.add_resource(Me, '/me')


if __name__ == "__main__":
    app.run(port=5555, debug=True)