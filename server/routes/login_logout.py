from routes.__init__ import Resource, User, make_response, request, create_access_token, set_access_cookies, jwt_required

class Login(Resource):
    def post(self):
        try:
            data = request.get_json()
            username_or_email = data.get('username_or_email')
            if user := User.query.filter_by(email=username_or_email).first():
                if user.authenticate(data.get('password_hash')):
                    return self.make_jwt_response(user)
            elif user := User.query.filter_by(username=username_or_email).first():
                if user.authenticate(data.get('password_hash')):
                    return self.make_jwt_response(user)
            else:
                return make_response({'error': 'Incorrect username/email or password'}, 401)
        except Exception as e:
            return make_response({'error': str(e)})

    def make_jwt_response(self, user):
        response = make_response(user.to_dict(), 200)
        access_token = create_access_token(
            identity=user.id, additional_claims={'role_id': user.role_id}, fresh=True
        )
        set_access_cookies(response, access_token)
        return response
        