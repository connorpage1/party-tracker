from server.routes.__init__ import (
    Resource,
    User,
    make_response,
    request,
    create_access_token,
    set_access_cookies,
    unset_access_cookies,
    jwt_required,
    verify_jwt_in_request,
    db,
    current_user
)

class Login(Resource):
    def post(self):
        try:
            data = request.get_json()
            username_or_email = data.get("username_or_email")
            if user := User.query.filter_by(email=username_or_email).first():
                if user.authenticate(data.get("password_hash")):
                    return self.make_jwt_response(user)
            elif user := User.query.filter_by(username=username_or_email).first():
                if user.authenticate(data.get("password_hash")):
                    return self.make_jwt_response(user)
            else:
                return make_response(
                    {"error": "Incorrect username/email or password"}, 401
                )
        except Exception as e:
            return make_response({"error": str(e)})

    def make_jwt_response(self, user):
        response = make_response(user.to_dict(), 200)
        access_token = create_access_token(
            identity=user.id, additional_claims={"role_id": user.role_id}, fresh=True
        )
        set_access_cookies(response, access_token)
        return response


class Logout(Resource):
    @jwt_required()
    def delete(self):
        try:
            response = make_response({}, 204)
            unset_access_cookies(response)
            #! Add token invalidation
            return response
        except Exception as e:
            return make_response({"error": str(e)})
        
class Me(Resource):
    @jwt_required()
    def get(self):
        try:
            # verify_jwt_in_request()
            return make_response(current_user.to_dict(), 200)
        except Exception as e:
            return make_response({"error": str(e)}, 400)


class Profile(Resource):
    """ More information than the 'me' route for 
    viewing profile and changing password
    once logged in """
    @jwt_required()
    def get(self):
        try:
            # verify_jwt_in_request()
            return make_response(current_user.to_dict(
                rules=("email", "role", "created_at",
                        "updated_at", "parties")), 200)
        except Exception as e:
            return make_response({"error": str(e)}, 400)
    
    @jwt_required()
    def patch(self): 
        try:
            # verify_jwt_in_request()
            user = current_user
            data = request.json()
            if "pwupdate" in request.args and not user.authenticate(
                data.get("current_password")
            ):
                return make_response({'error': 'Incorrect password'}, 401)
            for attr, value in data.items():
                setattr(user, attr, value)
            db.session.commit()
            return make_response(user.to_dict(), 200)
            
        except Exception as e:
            db.session.rollback()
            make_response({'error': str(e)}, 400) 