from pymongo import MongoClient
import certifi
import config

def update_db_sensor_data(ultrasonic_data, microphone_data, mpu6050_data):
    ca = certifi.where()

    # Connect to my cluster
    cluster = MongoClient(config.uri, tlsCAFile=ca)

    # Connect to the database and collection within the database
    db = cluster[config.database]
    collection = db[config.collection]

    # What to filter, filtering by email
    filter = {'email': config.email}

    # What to set the key's value to
    newvalues = {"$set": {'ultrasonic': [ultrasonic_data['ultrasonic_1'],
                                         ultrasonic_data['ultrasonic_2'],
                                         ultrasonic_data['ultrasonic_3'],
                                         ultrasonic_data['ultrasonic_4'],
                                         ultrasonic_data['ultrasonic_5'],
                                         ultrasonic_data['ultrasonic_6']],
                          'microphone': microphone_data,
                          'accelerometer': mpu6050_data['accelerometer'],
                          'gyroscope': mpu6050_data['gyroscope']
                          }}

    # update it
    collection.update_one(filter, newvalues)

    # display it
    cursor = collection.find()
    for record in cursor:
        print(record)
