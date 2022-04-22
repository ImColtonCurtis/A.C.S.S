import ultrasonicSensor
import accelerometerGryoscopeSensor
import microphoneSensor
import sendText
import mongoConnection # for database
import numpy as np
import time # for time
from threading import Thread

# vigilanteMode flag
vigilanteMode = 1

# calibration flag
sensorsCalibrated = 0

# calibrated base values
calibratedAccelerometer = np.array([0.0, 0.0, 0.0])
calibratedMicrophone = 0.0

# alert flag
alertFlag = 0
inAlertMode = 0

# ultrasonic sensor
# flagging array when ultrasonic distance has changed dramatically
ultrasonicFlag = np.array([0, 0, 0, 0, 0, 0]) # set to 0, 1, 2, 3, or 4 based on threat level
# ultrasonic previous distance array
ultrasonicPrevDistance = np.array([1020.0, 1020.0, 1020.0, 1020.0, 1020.0, 1020.0])

# accelerometer/gyroscope
# accelerometer previous value
accelerometerFlag = np.array([0, 0, 0]) # set to 0, 1, 2, 3, or 4 based on threat level
accelerometerPrev = np.array([0.0, 0.0, 0.0])
# gyroscope previous value
gyroscopeFlag = np.array([0, 0, 0]) # set to 0, 1, 2, 3, or 4 based on threat level
gyroscopePrev = np.array([0.0, 0.0, 0.0])

# microphone previous value
microphonePrev = 0.0
micIsCalculating = 0

prevPointTotal = 0 # used  to track point totals

pushingData = 0 # pushing data flag

def calcPoints():
    # ultrasonic sensor parameters:
    # no more than 4 points may be contributed from the ultrasonic sensor
    for i in range(6):
        if ultrasonicPrevDistance[i] <= 180 and ultrasonicPrevDistance[i] > 122:
            ultrasonicFlag[i] = 1
        elif ultrasonicPrevDistance[i] <= 122 and ultrasonicPrevDistance[i] > 76:
            ultrasonicFlag[i] = 2
        elif ultrasonicPrevDistance[i] <= 76 and ultrasonicPrevDistance[i] > 30:
            ultrasonicFlag[i] = 3
        elif ultrasonicPrevDistance[i] <= 30 and ultrasonicPrevDistance[i] > 0:
            ultrasonicFlag[i] = 4
        else:
            ultrasonicFlag[i] = 0            

    # accelerometer parameters:
    # no more than 4 points may be contributed from the accelerometer
    #accelerometerFlag = 0
    for j in range(3):
        if accelerometerPrev[j] >= 2 and accelerometerPrev[j] < 4:
            accelerometerFlag[j] = 1
        elif accelerometerPrev[j] >= 4 and accelerometerPrev[j] < 7:
            accelerometerFlag[j] = 2
        elif accelerometerPrev[j] >= 7 and accelerometerPrev[j] < 11:
            accelerometerFlag[j] = 3
        elif accelerometerPrev[j] >= 11:
            accelerometerFlag[j] = 4
        else:
            accelerometerFlag[j] = 0 
    
    # gyroscope parameters:
    # no more than 4 points may be contributed from the gyroscope
    for k in range(3):
        if gyroscopePrev[k] >= 4 and gyroscopePrev[k] < 6:
            gyroscopeFlag[k] = 1
        elif gyroscopePrev[k] >= 6 and gyroscopePrev[k] < 9:
            gyroscopeFlag[k] = 2
        elif gyroscopePrev[k] >= 9 and gyroscopePrev[k] < 15:
            gyroscopeFlag[k] = 3
        elif gyroscopePrev[k] >= 15:
            gyroscopeFlag[k] = 4
        else:
            gyroscopeFlag[k] = 0
        
    # microphone parameters:
    # no more than 4 points may be contributed from the microhpone
    microphoneFlag = 0
    if microphonePrev >= 0.35 and microphonePrev < 0.5:
        microphoneFlag = 1
    elif microphonePrev >= 0.5 and microphonePrev < 0.7:
        microphoneFlag = 2
    elif microphonePrev >= 0.7 and microphonePrev < 0.85:
        microphoneFlag = 3
    elif microphonePrev >= 0.85:
        microphoneFlag = 4
    else:
        microphoneFlag = 0

    pointVal = np.amax(ultrasonicFlag) + np.amax(accelerometerFlag) + np.amax(gyroscopeFlag) #+ microphoneFlag
    global alertFlag
    if pointVal >= 5 and alertFlag == 0 or inAlertMode == 1:
        if inAlertMode == 0:
            alertFlag = 1
            print("Total Points: ", pointVal, " <- ", ultrasonicFlag, " ", accelerometerFlag, " ", gyroscopeFlag, " ", microphoneFlag) 
            print("Alert Sent!")       
            sendText.sendMessage(0)
    
    global prevPointTotal
    if (pointVal != prevPointTotal and alertFlag == 0):
        prevPointTotal = pointVal
    if (alertFlag == 0):
        print("Total Points: ", pointVal, " <- ", ultrasonicFlag, " ", accelerometerFlag, " ", gyroscopeFlag, " ", microphoneFlag)        

# get ultrasonicSensors
def getUltrasonicSensors():
    global ultrasonicPrevDistance    
    for i in range(6):
        # filter out bad values
        ultrasonicPrevDistance[i] = ultrasonicSensor.calcDistance(i)
        
        #accurate to 380 centimeters            
        if ultrasonicPrevDistance[i] > 400:         
            ultrasonicPrevDistance[i] = 400
    time.sleep(0.0334)
            
# get accelerometer (rotation)
def getAccelerometer():
    global accelerometerPrev
    if sensorsCalibrated == 0:
        accelerometerPrev[0] = accelerometerGryoscopeSensor.calcAccelerometer()['x']
        accelerometerPrev[1] = accelerometerGryoscopeSensor.calcAccelerometer()['y']
        accelerometerPrev[2] = accelerometerGryoscopeSensor.calcAccelerometer()['z']
    elif sensorsCalibrated == 1:
        accelerometerPrev[0] = accelerometerGryoscopeSensor.calcAccelerometer()['x']-calibratedAccelerometer[0]
        accelerometerPrev[1] = accelerometerGryoscopeSensor.calcAccelerometer()['y']-calibratedAccelerometer[1]
        accelerometerPrev[2] = accelerometerGryoscopeSensor.calcAccelerometer()['z']-calibratedAccelerometer[2]

# get gyroscope
def getGyroscope():
    global gyroscopePrev
    gyroscopePrev[0] = abs(accelerometerGryoscopeSensor.calcGyroscope()['x'])
    gyroscopePrev[1] = abs(accelerometerGryoscopeSensor.calcGyroscope()['y'])
    gyroscopePrev[2] = abs(accelerometerGryoscopeSensor.calcGyroscope()['z'])

# get Mic
def getMic():
    if sensorsCalibrated == 1:
        global micIsCalculating
        micIsCalculating = 1 # mic is calculating
    global microphonePrev    
    
    if sensorsCalibrated == 0:
        microphonePrev = microphoneSensor.calcPeaking()
    elif sensorsCalibrated == 1:
        microphonePrev = microphoneSensor.calcPeaking()-calibratedMicrophone
    if microphonePrev < 0:
        microphonePrev = 0 
    
    if sensorsCalibrated == 1:
        micIsCalculating = 0 # mic is not calculating
    
# calibrate sensors
def calibrateSensors():
    global sensorsCalibrated
    if sensorsCalibrated == 0:
        print("Calibrating Sensors...")
    else:
        print("Recalibrating Sensors...")
        sensorsCalibrated == 0
        
    global calibratedAccelerometer
    calibratedAccelerometer = 0
    for i in range(3):
        getAccelerometer()
        calibratedAccelerometer += accelerometerPrev        
    calibratedAccelerometer /= 3
    
    global calibratedMicrophone
    calibratedMicrophone = 0
    for j in range(3):
        getMic()
        calibratedMicrophone += microphonePrev
    calibratedMicrophone /= 3
    
    if sensorsCalibrated == 0:
        print("Sensors Calibrated!")
        
    sensorsCalibrated = 1 # sensors are calibrated

def pushData():
    global pushingData
    pushingData = 1
    
    ultrasonic_data = {
                'ultrasonic_1' : ultrasonicPrevDistance[0],
                'ultrasonic_2' : ultrasonicPrevDistance[1],
                'ultrasonic_3' : ultrasonicPrevDistance[2],
                'ultrasonic_4' : ultrasonicPrevDistance[3],
                'ultrasonic_5' : ultrasonicPrevDistance[4],
                'ultrasonic_6' : ultrasonicPrevDistance[5]
            }
    accel_gyro_data = {
            'gyroscope': [gyroscopePrev[0],gyroscopePrev[1],gyroscopePrev[2]],
            'accelerometer' : [accelerometerPrev[0], accelerometerPrev[1], accelerometerPrev[2]]
    }
    mic_data = microphonePrev
    #send data
    mongoConnection.update_db_sensor_data(ultrasonic_data, microphonePrev, accel_gyro_data)
    
    time.sleep(0.5)
    
    pushingData = 0
    
def getSensors():
    #other sensor calls
    while micIsCalculating == 1:
        #sensor calls
        getAccelerometer()        
        getGyroscope()
        if alertFlag == 0 and inAlertMode == 0:
            calcPoints() # calculate points
        
def main():
    calibrateSensors() # wait to proceed until sensors are calibrated
    global alertFlag
    global inAlertMode
    #superloop for vigilante mode
    while vigilanteMode == 1:        
        if alertFlag == 1 or inAlertMode == 1:
            # reset flag and set alert mode to high
            alertFlag = 0
            inAlertMode = 1
            
            for i in range (90):
                print(i, "Retrieving Data...")
                alertThread = Thread(target = pushData, args = ( ))
                ultraThread2 = Thread(target = getUltrasonicSensors, args = ( ))
                micThread2 = Thread(target = getMic, args = ( ))
                sensorThread2 = Thread(target = getSensors, args = ( )) 
                micThread2.start()   
                ultraThread2.start()   
                sensorThread2.start()
                alertThread.start()                
                alertThread.join()
                micThread2.join()
                ultraThread2.join()  
                sensorThread2.join()
                print(i, "Pushing Data!")
            global ultrasonicFlag
            ultrasonicFlag = np.array([0, 0, 0, 0, 0, 0])
            global accelerometerFlag
            accelerometerFlag = np.array([0, 0, 0])
            global gyroscopeFlag
            gyroscopeFlag = np.array([0, 0, 0])
            global microphonePrev
            microphonePrev = 0.0
            inAlertMode = 0
        else:
            # sensors
            micThread = Thread(target = getMic, args = ( ))
            ultraThread = Thread(target = getUltrasonicSensors, args = ( ))
            sensorThread = Thread(target = getSensors, args = ( ))    
            micThread.start()
            ultraThread.start()  
            sensorThread.start()
            micThread.join()
            ultraThread.join()  
            sensorThread.join()

if __name__ == "__main__":
    main()
    