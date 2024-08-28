from routes.__init__ import Party, Resource, make_response, datetime, request
from config import db

class Parties(Resource):
    def get(self):
        future = None
        year = None
        month = None
        day = None
        
        if request.args.get('future'):
            future = request.args.get('future')
        elif request.args.get('year') and request.args.get('month') and request.args.get('day'):
            try:
                year = int(request.args.get('year'))
                month = int(request.args.get('month'))
                day = int(request.args.get('day'))
            except Exception as e:
                return make_response({'error': str(e)}, 400)
        
        now = datetime.now()
                
        query = db.select(Party).order_by(Party.date_and_start_time)
        
        try:
            if future == "True":
                query = db.select(Party).where(Party.date_and_start_time.__ge__(now)).order_by(Party.date_and_start_time)
            elif year and month and day:
                query = db.select(Party).where(Party.date_and_start_time.__ge__(datetime(year, month, day))).order_by(Party.date_and_start_time)
            return make_response([party.to_dict() for party in db.session.scalars(query).all()])
        except Exception as e:
            return make_response({'error': str(e)}, 404)
        
    def post(self):
        try:
            data = request.get_json()
            date_and_start_time = datetime.fromisoformat(data['date_and_start_time'])
            end_time = datetime.fromisoformat(data['end_time'])
            new_party = Party(
                name=data.get('name'),
                date_and_start_time=date_and_start_time, 
                end_time=end_time,
                status=data.get('status'),
                organization=data.get('organization'),
                customer_id=data.get('customer_id'),
                user_id=data.get('user_id')
                )
            db.session.add(new_party)
            db.session.commit()
            return make_response(new_party.to_dict(), 201)
        except Exception as e:
            db.session.rollback()
            return make_response({'error': str(e)}, 400)


class PartiesById(Resource):
    def get(self, id):
        try:
            if party := db.session.get(Party, id):
                return make_response(party.to_dict(), 200)
            return make_response({'error': f'No party found with id {id}'}, 404)
        except Exception as e:
            return make_response({'error': str(e)}, 400)
    
    def patch(self, id):
        try:
            data = request.get_json()
            if party := db.session.get(Party, id):
                for attr, value in data.items():
                    if value:
                        if attr in ['date_and_start_time', 'end_time']:
                            value = datetime.fromisoformat(value)
                        setattr(party, attr, value)    
                db.session.commit()
                return make_response(party.to_dict(), 200)
            return make_response({'error': f'No party found with id {id}'}, 404)
        except Exception as e:
            db.session.rollback()
            return make_response({'error': str(e)}, 400)
        
    
    def delete(self, id):
        try:
            if party := db.session.get(Party, id):
                db.session.delete(party)
                db.session.commit()
                return make_response({}, 204)
        except Exception as e:
            db.session.rollback()
            return make_response({"error": str(e)}, 400)
