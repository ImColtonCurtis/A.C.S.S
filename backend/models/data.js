const mongoose = require('mongoose');

const dataSchema =     {
    email: { type: String, required: true, unique: true},
    thingName : { type: String, unique: true},
    ultrasonic: { type: Array, required: true},
    gyroscope: { type: Array, required: true},
    accelerometer: { type: Array, required: true},
    microphone: { type: Number, required: true}
};

// Name of DB will be called 'User' + 's' on MongoDB
module.exports = mongoose.model('data', dataSchema);