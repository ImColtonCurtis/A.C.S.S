const awsIoT = require('aws-iot-device-sdk');
const Data = require('../models/data'); // Connection to MongoDB

const livestreamOn = async (req, res, next) => {
  const emailToQuery = req.userData.email;

  let thingName;

  // Logic to check if the email sent already has an email in mongoDB
  let existingUserData;
  try
  {
      // Checks if this email is an existing email in the MongoDB database. This is an async task
      existingUserData = await Data.find({email: emailToQuery});
      thingName = existingUserData[0].thingName;

      console.log(thingName + ' thing found for ' + emailToQuery + '...');
      
  } catch (err)
  {
      console.log("error. Data does not exist");
      return res.json({error: 'Data does not exist.'});  
  }

  const iotKeyPath = './config/' + thingName + '_private.pem.key';
  const iotCertPath = './config/' + thingName + '_certificate.pem.crt';
  const iotCaPath = './config/' + thingName + '_AmazonRootCA1.pem';


  const options = {
    keyPath: iotKeyPath,
    certPath: iotCertPath,
    caPath: iotCaPath,
    clientId: thingName + ' ',
    host:"a3s59sz43jkaet-ats.iot.us-west-1.amazonaws.com"
  };

  let clientTokenUpdate;

  const thingShadow = awsIoT.thingShadow(options);

  thingShadow.on("connect", ()=>{

    thingShadow.register( thingName, {}, ()=>{
      console.log('Registered to ' + thingName + ' thing...');
      console.log('About to perform a livestream ON update on ' + thingName + '...');

      clientTokenUpdate = thingShadow.update( thingName, {
        'state':{
          'desired':{
            'livestream_on' : 1
          }
        }
      });


    // If the clientTokenUpdate is null, then we know that the update was not successful.
    // There seems to be other operations in the queue.
      if(clientTokenUpdate === null){
        console.log('Update shadow failed, operation still in progress...');
      }
    });

    // When the thingShadow.update function completes, the clientTokenUpdate will have a
    // non-empty token and the this 'status' event will be triggered
    thingShadow.on('status', (thingName, stat, clientToken, stateObject)=>{
      console.log('Update function completed, non-null token returned');


      // Force end this connection
      thingShadow.end(true);
      res.json({message: 'Sent livestream ON request to IoT Core', iotCoreResponse: clientTokenUpdate});  
    });
  });


}

const livestreamOff = async (req, res, next) => {
  const emailToQuery = req.userData.email;

  let thingName;

  // Logic to check if the email sent already has an email in mongoDB
  let existingUserData;
  try
  {
      // Checks if this email is an existing email in the MongoDB database. This is an async task
      existingUserData = await Data.find({email: emailToQuery});
      thingName = existingUserData[0].thingName;

      console.log(thingName + ' thing found for ' + emailToQuery + '...');
      
  } catch (err)
  {
      console.log("error. Data does not exist");
      return res.json({error: 'Data does not exist.'});  
  }

  const iotKeyPath = './config/' + thingName + '_private.pem.key';
  const iotCertPath = './config/' + thingName + '_certificate.pem.crt';
  const iotCaPath = './config/' + thingName + '_AmazonRootCA1.pem';


  const options = {
    keyPath: iotKeyPath,
    certPath: iotCertPath,
    caPath: iotCaPath,
    clientId: thingName + ' ',
    host:"a3s59sz43jkaet-ats.iot.us-west-1.amazonaws.com"
  };

  
  let clientTokenUpdate;
  
  const thingShadow = awsIoT.thingShadow(options);
  
  thingShadow.on("connect", ()=>{
  
    thingShadow.register( thingName, {}, ()=>{
      console.log('Registered to ' + thingName + ' thing...');
      console.log('About to perform a livestream OFF update on ' + thingName + '...');
  
      clientTokenUpdate = thingShadow.update( thingName, {
        'state':{
          'desired':{
            'livestream_on' : 0
          }
        }
      });
  
  
    // If the clientTokenUpdate is null, then we know that the update was not successful.
    // There seems to be other operations in the queue.
      if(clientTokenUpdate === null){
        console.log('Update shadow failed, operation still in progress...');
      }
    });
  
    // When the thingShadow.update function completes, the clientTokenUpdate will have a
    // non-empty token and the this 'status' event will be triggered
    thingShadow.on('status', (thingName, stat, clientToken, stateObject)=>{
      console.log('Update function completed, non-null token returned');
      
      // Force end the connection
      thingShadow.end(true);
      res.json({message: 'Sent livestream OFF request to IoT Core', iotCoreResponse: clientTokenUpdate});  
    });
  });
  
};



exports.livestreamOn = livestreamOn; //Multi export
exports.livestreamOff = livestreamOff; //Multi export