from mpu6050 import mpu6050
import time
mpu = mpu6050(0x68)

def calcAccelerometer():
    return mpu.get_accel_data()
    
def calcGyroscope():
    return mpu.get_gyro_data()
