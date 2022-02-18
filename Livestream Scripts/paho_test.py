import paho.mqtt.client as mqtt
import json
import ssl
import subprocess

# The callback for when the client receives a CONNACK response from the server
def on_connect(client, userdata, flags, rc):
    print("Connected to AWS with result code " + str(rc))

    # Subscribing in on_connect() means that if we lose the connection and reconnect
    # then subscriptions will be renewed

    # Subscribe to IoT Core Console topic here, upon connection
    client.subscribe("$aws/things/ACSS-0/shadow/update/accepted")

# The callback for when a PUBLISH message is received from the server
def on_message(client, userdata, msg):
    payload_str = str(msg.payload)
    global proc
    if '"state":{"desired":{"livestream_on":1}}' in payload_str:
        if proc is None: # Only create a new process if there is not a process already running
            proc = subprocess.Popen(["./start_livestream_client.sh"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            print("Livestream is ON")

    elif '{"state":{"desired":{"livestream_on":0}}' in payload_str:
        try:
            while proc.poll() is None: # if proc.poll() is None, it is running
                # TODO: find a better way to kill the child process without pkilling ffmpeg
                subprocess.run(["pkill", "ffmpeg"])
                proc.terminate()
                print("Livestream is OFF")
            proc = None
        except AttributeError: # AttributeError: 'NoneType' object has no attribute 'terminate'
            pass

# create subprocess variable
proc = None

# MQTT Client setup
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.tls_set(ca_certs="AmazonRootCA1.pem",certfile="certificate.pem.crt", keyfile="private.pem.key", cert_reqs=ssl.CERT_REQUIRED,tls_version=ssl.PROTOCOL_TLS, ciphers=None)

client.connect("a3s59sz43jkaet-ats.iot.us-west-1.amazonaws.com", 8883)

client.loop_forever()
