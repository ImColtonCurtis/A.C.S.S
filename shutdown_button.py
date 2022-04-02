# !/bin/python
# Shutdown script via button
# Script body can be thrown into any other script due to nature of
# add_event_detect threaded interrupt generating own thread during call.

import RPi.GPIO as GPIO
import time
import os

# Broadcom SOC PIN count
GPIO.setmode(GPIO.BCM)
# Arbitrary Broadcom pin; swap 17 for desired pin
GPIO_SELECT = 17
# Set up PIN to use internal pull-up as it is connected to collector on 2N3904
GPIO.setup(GPIO_SELECT, GPIO.IN, pull_up_down=GPIO.PUD_UP)

# Interrupt protocol for shutting down
def Shutdown(channel):
    print("Shutting Down.")
    time.sleep(5)
    os.system("sudo shutdown -h now")

# For a falling-edge button event on the chosen GPIO pin after "bouncetime" ms, initiate Shutdown protocol
# add_event_detect will force system to respond regardless of other processes currently running by
# spawning second thread to execute instructions.
GPIO.add_event_detect(GPIO_SELECT, GPIO.FALLING, callback=Shutdown, bouncetime=2000)

# now wait!
while 1:
    time.sleep(1)