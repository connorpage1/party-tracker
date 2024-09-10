from server.routes.__init__ import Contract, Resource, jwt_required, make_response, request, db

class Contracts(Resource):
    @jwt_required()
    def post(self):
        try:
            data = request.get_json()
            new_contract = Contract(**data)
            db.session.add(new_contract)
            db.session.commit()
            return make_response(new_contract.to_dict(), 201)
        except Exception as e:
            db.session.rollback()
            return make_response({'error': str(e)}, 400)