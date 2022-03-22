const Data = require('../models/data'); // Connection to MongoDB

const getData = async (req,res,next) => {
    const emailToQuery = req.userData.email;


    // Logic to check if the email sent already has an email in mongoDB
    let existingUserData;
    try
    {
        // Checks if this email is an existing email in the MongoDB database. This is an async task
        existingUserData = await Data.find({email: emailToQuery});
        console.log(existingUserData);
    } catch (err)
    {
        console.log("error. Data does not exist");
        return res.json({error: 'Data does not exist.'});  
    }
    
    res.json({data: existingUserData});  
};

exports.getData = getData; //export getData 