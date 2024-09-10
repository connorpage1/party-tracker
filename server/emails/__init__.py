import sys
import os

# Add the server folder to the system path
sys.path.append(os.path.dirname(os.path.abspath(__file__)) + '/../')

from server.models.party import Party

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from datetime import datetime, timedelta
from server.config import app