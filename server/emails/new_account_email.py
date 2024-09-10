from server.emails.__init__ import os, SendGridAPIClient, Mail, datetime, timedelta, app



def new_account_email(admin_name, userObj):
    with app.app_context():
        today = datetime.now()

        subject = f"{admin_name} has created a new account for you on TchoupParties.com"

        body = f"<p><b>Welcome to Tchoup Parties, {userObj.name}</b>. {admin_name} created a new account for you on TchoupParties.com. Please log in and change your password. <p>"

        message = Mail(
            from_email="roundup@tchoupparties.com",
            to_emails=userObj.email,
            subject=subject,
            html_content=body,
        )

        try:
            sg = SendGridAPIClient(os.environ.get("SENDGRID_API_KEY"))
            sg.send(message)
        except Exception as e:
            print(e.message or str(e))
