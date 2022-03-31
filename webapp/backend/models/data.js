const mongoose = require('mongoose');

const dataSchema =     {
    email: { type: String, required: true, unique: true},
    thingName : { type: String, unique: false, required: true},
    ultrasonic: { type: Array, unique: false, required: true},
    gyroscope: { type: Array, unique: false, required: true},
    accelerometer: { type: Array, unique: false, required: true},
    microphone: { type: Number, unique: false, required: true}
};

// Name of DB will be called 'User' + 's' on MongoDB
module.exports = mongoose.model('data', dataSchema);