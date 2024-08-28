from routes.__init__ import Customer, Resource, make_response, datetime, request
from config import db

class Customers(Resource):
    def get(self):
        try:
            customers = db.session.execute(db.select(Customer)).scalars().all()
            return make_response([customer.to_dict() for customer in customers], 200)
        except Exception as e:
            return make_response({'error': str(e)}, 400)
    def post(self):
        try:
            pass
        except Exception as e:
            raise e