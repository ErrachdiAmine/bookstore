#utilities for the website

from django.core.mail import send_mail
import os
from django.conf import settings
from core.models import verification_token


link = "http://localhost:5173/verification?token"



def send_verification_email(user):
    username = user.username
    sender = settings.EMAIL_HOST_USER
    reciever = user.email
    message = 'Hey dear user'
    html_body = f"<p>Hey {username}!,<p/><p>\nThank you for using our website, please <a href='{link}={verification_token.token}'> click here <a/>to verify your email.</p>"


    send_mail(
        subject="Email Verification",
        from_email={sender},
        recipient_list={reciever},
        message=message,
        html_message=html_body
    )