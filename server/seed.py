import sys
sys.path.append("..")

from random import randint, choice as rc

from faker import Faker

from server.config import app, db
from server.models.party import Party
from server.models.customer import Customer
from server.models.package import Package
from server.models.party_package import PartyPackage
from server.models.user import User
from server.models.contract import Contract

from datetime import datetime, timedelta

fake = Faker()


def seed_data():
    with app.app_context():
        Contract.query.delete()
        PartyPackage.query.delete()
        Package.query.delete()
        Party.query.delete()
        Customer.query.delete()
        User.query.delete()
        
        admin = User(name="Connor", username="connor", email='connor@page.com', password_hash='password', role='admin')
        
        db.session.add(admin)
        db.session.commit()
        
        users = []
        for _ in range(20):
            name=fake.name()
            username=fake.user_name()
            email=fake.email()
            password_hash = 'password'
            role_id = 2
            
            user = User(name=name, username=username, email=email, password_hash=password_hash, role_id=role_id)
            
            db.session.add(user)
            users.append(user)
        
        db.session.commit()
        
        customers = []
        for _ in range(50):
            first_name=fake.first_name()
            last_name = fake.last_name()
            email=fake.email()
            phone=fake.phone_number()
            
            customer = Customer(first_name=first_name, last_name=last_name, email=email, phone=phone)
            
            db.session.add(customer)
            customers.append(customer)
        
        db.session.commit()
        
        parties = []
        for _ in range(100):
            theme = fake.word()
            start = fake.date_time_between(start_date='now', end_date='+1y')
            duration = rc([1, 1.5, 2, 2.5, 3, 3.5])
            status = randint(1, 9)
            org = fake.word()
            customer = rc([customer.id for customer in customers])
            user = rc([user.id for user in users])
            guests = randint(50, 250)
            location = randint (1, 8)
            
            party = Party(theme=theme, date_and_start_time=start, duration=duration, status_id=status, organization=org, customer_id=customer, user_id=user, guest_number=guests, location_id=location)
            
            db.session.add(party)
            parties.append(party)
        
        db.session.commit()
        
        packages = []
        package_1 = Package(name="Full Tchoup", type_id=2, price=38, per_head=1)
        package_2 = Package(name="Taco Bar", type_id=1, price=500, per_head=0)
        
        packages.append(package_1) 
        packages.append(package_2) 
        db.session.add(package_1)
        db.session.add(package_2)
        
        db.session.commit()
        
        party_packages = []
        for _ in range(500):
            party = rc([party.id for party in parties])
            package = rc([package.id for package in packages])
            description = fake.sentence()
            
            party_package = PartyPackage(party_id = party, package_id=package, description=description)
            
            db.session.add(party_package)
            party_packages.append(party_package)
            
        db.session.commit()
        
        contracts = []
        for party in parties:
            terms = fake.paragraph()
            date = rc([fake.date_this_month(), None])
            if date:
                status='signed'
            else:
                status='pending'
            party_id = party.id
            
            contract = Contract(terms=terms, date_signed=date, status=status, party_id=party_id)
            db.session.add(contract)
            contracts.append(contract)
        db.session.commit()
        
        print('Seeding complete')
    
if __name__ == "__main__":
    seed_data()
        

