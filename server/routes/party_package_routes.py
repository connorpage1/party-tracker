from server.routes.__init__ import PartyPackage, Resource, jwt_required, make_response, request, db


class PartyPackages(Resource):
    @jwt_required()
    def post(self):
        try:
            data = request.get_json()
            new_party_package = PartyPackage(**data)
            db.session.add(new_party_package)
            db.session.commit()
            return make_response(new_party_package.to_dict(), 201)
        except Exception as e:
            db.session.rollback()
            return make_response({'error': str(e)}, 400) 