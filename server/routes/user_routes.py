from server.routes.__init__ import (
    Resource,
    User,
    make_response,
    request,
    jwt_required,
    verify_jwt_in_request,
    db,
    current_user,
    new_account_email,
    secrets,
    string
)

class Users(Resource):
    @jwt_required()
    def get(self):
        try:
            verify_jwt_in_request()
            role = current_user.role
            if role != 'admin':
                return make_response({'error': "Insufficient privileges"}, 403)
            users = db.session.execute(db.select(User)).scalars().all()
            response = [user.to_dict() for user in users]
            
            return make_response(response, 200)

        except Exception as e:
            return make_response({'error': str(e)}, 400)
    
    @jwt_required()
    def post(self):
        try:
            verify_jwt_in_request()
            role = current_user.role
            
            print(current_user)
            print(role)
            
            if role != 'admin':
                return make_response({'error': "Insufficient privileges"}, 403)
            data = request.get_json()
            password = generate_pw(12)
            new_user = User(**data, password_hash=password)
            db.session.add(new_user)
            db.session.commit()
            
            new_account_email(current_user.first_name, new_user, password)
            return make_response(new_user.to_dict(), 200)

        except Exception as e:
            db.session.rollback()
            return make_response({'error': str(e)}, 400)

def generate_pw(length):
    characters = string.ascii_letters + string.digits + string.punctuation
    
    return ''.join(secrets.choice(characters) for _ in range(length))