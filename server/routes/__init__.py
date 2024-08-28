from flask import request, make_response, redirect
from flask_restful import Resource
import os
from datetime import datetime
from functools import wraps
from flask_jwt_extended import (
    create_access_token,
    set_access_cookies,
    unset_access_cookies,
    get_jwt,
    get_jwt_identity,
    current_user,
    jwt_required
    
)

# Local imports
from models.contract import Contract
from models.customer import Customer
from models.user import User
from models.party import Party
from models.package import Package
from models.party_package import PartyPackage