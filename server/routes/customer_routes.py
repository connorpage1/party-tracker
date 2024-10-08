from server.routes.__init__ import Customer, Resource, make_response, datetime, request, jwt_required, db

class Customers(Resource):
    @jwt_required()
    def get(self):
        email = request.args.get('email')
        try:
            if email:
                stmt = db.select(Customer).where(Customer.email.ilike(f"%{email}%"))
                customers = db.session.execute(stmt).scalars().all()  
            else:
                customers = db.session.execute(db.select(Customer)).scalars().all()
            return make_response({'customers': [customer.to_dict() for customer in customers]}, 200)
        except Exception as e:
            return make_response({'error': str(e)}, 400)
    @jwt_required()
    def post(self):
        try:
            data = request.get_json()
            new_customer = Customer(**data)
            db.session.add(new_customer)
            db.session.commit()
            return make_response(new_customer.to_dict(), 201)

        except Exception as e:
            db.session.rollback()
            if "UNIQUE constraint failed" in str(e):
                #! Maybe change this to return the existing user? See how FE needs it
                return make_response({"error": "Email already exists"}, 400)
            return make_response({'error': str(e)}, 400)
        
class CustomerById(Resource):
    @jwt_required()
    def get(self, id):
        try:
            if customer := db.session.get(Customer, id):
                return make_response(customer.to_dict(), 200)
            return make_response({'error': f'No customer with id {id}'}, 404)
        except Exception as e:
            return make_response({'error': str(e)}, 400)
    @jwt_required()
    def patch(self, id):
        try:
            if customer := db.session.get(Customer, id):
                data = request.get_json()
                for attr, value in data.items():
                    setattr(customer, attr, value)
                db.session.commit()
                return make_response(customer.to_dict(), 200)
            return make_response({'error': f'No customer with id {id}'}, 404)
        except Exception as e:
            db.session.rollback()
            return make_response({'error': str(e)}, 400)

    @jwt_required()
    def delete(self, id):
        try:
            if customer := db.session.get(Customer, id):
                db.session.delete(customer)
                db.session.commit()
                return make_response({}, 204)
            return make_response({'error': f'No customer with id {id}'}, 404)
        except Exception as e:
            db.session.rollback()
            return make_response({'error': str(e)}, 400)
