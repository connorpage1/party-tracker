from server.emails.__init__ import os, SendGridAPIClient, Mail, datetime, timedelta, app, load_dotenv



def new_account_email(admin_name, userObj, password):
    
    with app.app_context():
        load_dotenv()

        SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')
        
        today = datetime.now()

        subject = f"{admin_name} has created a new account for you on TchoupParties.com"

        body = f"""<p><b>Welcome to Tchoup Parties, {userObj.first_name}</b>. 
                {admin_name} created a new account for you on TchoupParties.com. 
                Please log in and change your password. </p> <br/> <h3>Login Details:</h3>
                <p><b>Email: </b>{userObj.email}</p><br/>
                <p><b>Username: </b>{userObj.username}</p><br/>
                <p><b>Password: </b>{password}</p><br/><br/>
                <p><b>NOTE: THIS PASSWORD HAS BEEN SENT OVER UNENCRYPTED
                EMAIL AND SHOULD BE CHANGED IMMEDIATELY.</b> Please log in to your 
                profile and change this password."""

        message = Mail(
            from_email="roundup@tchoupparties.com",
            to_emails='connor@connorpage.com',
            subject=subject,
            html_content=body,
        )

        try:
            sg = SendGridAPIClient(SENDGRID_API_KEY)
            sg.send(message)
        except Exception as e:
            print(e.message or str(e))
