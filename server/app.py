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

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get("DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")

api.add_resource(Parties, '/parties')
api.add_resource(PartiesById, '/parties/<int:id>')

if __name__ == "__main__":
    app.run(port=5555, debug=True)