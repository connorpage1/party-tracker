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
    jwt_required,
    verify_jwt_in_request,
    
)


# Local imports
from server.models.contract import Contract
from server.models.customer import Customer
from server.models.user import User
from server.models.party import Party
from server.models.package import Package
from server.models.party_package import PartyPackage
from server.config import db
from server.emails.new_account_email import new_account_email