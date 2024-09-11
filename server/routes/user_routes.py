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
from server.wrappers.jwt_role_required import role_required

class Users(Resource):
    @jwt_required()
    @role_required('admin')
    def get(self):
        try:
            verify_jwt_in_request()
            role = current_user.role
            if role != 'admin':
                return make_response({'error': "Insufficient privileges"}, 403)
            
            email = request.args.get('email')
            username = request.args.get('username')
            
            if email:
                stmt = db.select(User).where(User.email.ilike(email))
                if db.session.execute(stmt).scalars().first():
                    return make_response({'error': 'Email already in use'}, 400)
                else:
                    return make_response({'message': 'valid username'}, 204)
            if username:
                stmt = db.select(User).where(User.username.ilike(username))
                if db.session.execute(stmt).scalars().first():
                    return make_response({'error': 'Username already in use'}, 400)
                else:   
                    return make_response({'message': 'valid username'}, 204)

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

class UserById(Resource):
    @jwt_required()
    def get(self, id):
        try:
            if user := db.session.get(User, id):
                return make_response(user.to_dict(), 200)
            return make_response({'error': f'No user with id {id}'}, 404)
        except Exception as e:
            return make_response({'error': str(e)}, 400)
    @jwt_required()
    def patch(self, id):
        try:
            if user := db.session.get(User, id):
                data = request.get_json()
                for attr, value in data.items():
                    setattr(user, attr, value)
                db.session.commit()
                return make_response(user.to_dict(), 200)
            return make_response({'error': f'No user with id {id}'}, 404)
        except Exception as e:
            db.session.rollback()
            return make_response({'error': str(e)}, 400)

    @jwt_required()
    def delete(self, id):
        try:
            if user := db.session.get(User, id):
                db.session.delete(user)
                db.session.commit()
                return make_response({}, 204)
            return make_response({'error': f'No user with id {id}'}, 404)
        except Exception as e:
            db.session.rollback()
            return make_response({'error': str(e)}, 400)