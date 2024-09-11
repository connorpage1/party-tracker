from flask import make_response
from functools import wraps
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request, current_user



def role_required(required_role):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            user = current_user

            user_role = user.role

            if user_role != required_role:
                return make_response({"msg": "Forbidden: insufficient role"}, 403)

            return func(*args, **kwargs)
        return wrapper
    return decorator