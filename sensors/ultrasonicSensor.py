import RPi.GPIO as GPIO
import time

TRIG0 = 21
ECHO0 = 20
TRIG1 = 19
ECHO1 = 26
TRIG5 = 6
ECHO5 = 13
TRIG2 = 12
ECHO2 = 16
TRIG3 = 23
ECHO3 = 24
TRIG4 = 27
ECHO4 = 22
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

def calcDistance(num):
    # sensor setup
    if num == 0:
        TRIG = TRIG0
        ECHO = ECHO0
    elif num == 1:
        TRIG = TRIG1
        ECHO = ECHO1
    elif num == 2:
        TRIG = TRIG2
        ECHO = ECHO2
    elif num == 3:
        TRIG = TRIG3
        ECHO = ECHO3
    elif num == 4:
        TRIG = TRIG4
        ECHO = ECHO4
    else:
        TRIG = TRIG5
        ECHO = ECHO5    
    GPIO.setup(TRIG,GPIO.OUT)
    GPIO.setup(ECHO,GPIO.IN)
    GPIO.output(TRIG,False)

    # wait for sensors to settle
    time.sleep(0.175) #was 0.0334
    GPIO.output(TRIG,True)
    time.sleep(0.00001) # wait 10 micro seconds
    GPIO.output(TRIG,False)
    pulse_start = 0
    while GPIO.input(ECHO) == 0:
        pulse_start = time.time()
    pulse_end = 0
    while GPIO.input(ECHO) == 1:
        pulse_end = time.time()
    pulse_duration = pulse_end - pulse_start
    distance = pulse_duration * 17150
    distance = round(distance,2)
    return distance

def main():
    while True:
        print(calcDistance(5))
        
if __name__ == "__main__":
    main()