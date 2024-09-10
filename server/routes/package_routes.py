from server.routes.__init__ import Package, Resource, request, make_response, db, jwt_required

class Packages(Resource):
    @jwt_required()
    def get(self):
        try:
            packages = db.session.execute(db.select(Package)).scalars().all()
            response = [package.to_dict() for package in packages]
            return make_response(response, 200)
        except Exception as e:
            return make_response({'error': str(e)}, 400)
        
    @jwt_required()
    def post(self):
        try:
            data = request.get_json()
            new_package = Package(**data)
            db.session.add(new_package)
            db.session.commit()
            return make_response(new_package.to_dict(), 201)

        except Exception as e:
            db.session.rollback()
            return make_response({'error': str(e)}, 400)
