from models.party import Party
from models.customer import Customer
from datetime import datetime, timedelta

party_1 = Party(name="Engagement Party", date_and_start_time=datetime.now(), end_time=datetime.now(), status='confirmed', organization='LCMC',customer_id=1, user_id=1)

party_3 = Party(name="Test 2", date_and_start_time=datetime(2024, 9, 13, hour=7), end_time=datetime(2024, 9, 13, hour=10), status='pending', organization='LCMC',customer_id=1, user_id=1)

c=Customer(name='connor', email="connor@page.com", phone='504-111-1111')
c2 = Customer(name='test2', email='valid@email.com', phone='504-901-9010')