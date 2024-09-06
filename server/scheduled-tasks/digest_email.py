import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from datetime import datetime, timedelta
from models.party import Party
from app import app

with app.app_context():
    today = datetime.now()
    next_week = today + timedelta(weeks=1)

    upcoming_parties = Party.query.filter(Party.date_and_start_time >= today, Party.date_and_start_time <= next_week).all()

    subject=f"Upcoming Parties for the Week of {today.strftime('%m/%d/%Y')} - {next_week.strftime('%m/%d/%Y')}"


            
    party_summary = '\n\n'.join([f"""<p>Customer: {party.customer.first_name} {party.customer.last_name} ({party.customer.email})
                                        Organization: {party.organization or "N/A"} Theme: {party.theme or "N/A"}
                                        Day: {party.date_and_start_time.strftime('%A, %m/%d/%Y')} Start Time: {party.date_and_start_time.strftime('%-I:%M %p')} Duration: {party.duration} hours
                                        </p>""" for party in upcoming_parties])
            
    body = f"<h4>Here are the upcoming parties for the week of {today.strftime('%m/%d/%Y')} - {next_week.strftime('%m/%d/%Y')}:</h4>\n\n{party_summary}"
            

    message = Mail(
        from_email='roundup@tchoupparties.com',
        to_emails='connor@connorpage.com',
        subject=subject,
        html_content=body)

    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(e.message)