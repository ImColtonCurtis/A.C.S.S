import os
import config
from twilio.rest import Client

account_sid = config.account_sid
auth_token = config.auth_token

client = Client(account_sid, auth_token)

def sendMessage(x):
    if x == 0:
        text="Door Ding: It appears your vehicle may have encountered an incident."
    
    message = client.messages \
              .create(
        body=text,        
        from_= config.outgoing_phone,
        to= config.incoming_phone)