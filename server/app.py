import os

from server.models.contract import Contract
from server.models.customer import Customer
from server.models.user import User
from server.models.party import Party
from server.models.package import Package
from server.models.party_package import PartyPackage

from server.config import app, db, api, jwt
from server.routes.party_routes import Parties, PartiesById
from server.routes.customer_routes import Customers, CustomerById
from server.routes.authentication import Login, Logout, Me
from server.routes.package_routes import Packages
from server.routes.party_package_routes import PartyPackages


from flask_jwt_extended import (
    create_access_token,
    set_access_cookies,
    unset_access_cookies,
    get_jwt,
    get_jwt_identity,
    current_user,
    jwt_required
    
)

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
api.add_resource(PartyPackages, '/party-packages')


if __name__ == "__main__":
    app.run(port=5555, debug=True)