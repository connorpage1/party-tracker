import os
from config import app

from models.contract import Contract
from models.customer import Customer
from models.user import User
from models.party import Party
from models.package import Package
from models.party_package import PartyPackage

from config import app, db, api
from routes.party_routes import Parties, PartiesById
from routes.customer_routes import Customers, CustomerById
from routes.login_logout import Login

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

api.add_resource(Parties, '/parties')
api.add_resource(PartiesById, '/parties/<int:id>')
api.add_resource(Customers, '/customers')
api.add_resource(CustomerById, '/customers/<int:id>')
api.add_resource(Login, '/login')

if __name__ == "__main__":
    app.run(port=5555, debug=True)