const bcrypt = require('bcryptjs'); // Library to hash passwords
const User = require('../models/user'); // Connection to MongoDB
const jwt = require('jsonwebtoken'); // Library to generate JWT 
const Data = require('../models/data'); // Connection to MongoDB

const signup = async (req, res, next) => {
    const { email, password, phoneNumber } = req.body; // Extract email, password, phone number from request body

    // Logic to check if the email sent already has an email in mongoDB
    let existingUser;
    try
    {
        // Checks if this email is an existing email in the MongoDB database. This is an async task
        existingUser = await User.findOne({email : email});
    } catch (err)
        {
            console.log("error. Email does not exist");
            return res.json({error: 'Email does not exist.'});  
        }

    if (existingUser)
    {
        console.log("Sign up failed... email is taken");
        return res.json({error: 'Email taken.'});  
    }
    else
    {
        let hashedPassword;

        try
        {
            // Salt the password by 12 salting rounds (fast and can't be reversed)
            hashedPassword = await bcrypt.hash(password, 12); 
        }
        catch (err)
        {
            console.log("Could not create hash");
            return res.json({error: 'Bcrypt error.'});  
        }

        const createdUser = new User(
            {
                email: email,
                password: hashedPassword,
                phoneNumber: phoneNumber
            }
        )
        
        const createdData = new Data(
            {
                email: email,
                thingName: 'None',
                ultrasonic: [],
                gyroscope: [],
                accelerometer: [],
                microphone: 0
            }
        )
        // Save the user
        try{
            // Saving createdUser to mongoDB
            await createdUser.save();
            console.log("Created user in DB");
        } catch(err)
        {
            console.log("Error creating user in DB");
            return res.json({error: 'Could not create user.'});  
        }
        
        // Save the user
        try{
            // Saving createdUser to mongoDB
            await createdData.save();
            console.log("Created user sensor data in DB");
        } catch(err)
        {
            console.log("Error creating user data in DB");
            return res.json({error: 'Could not create user data.'});  
        }

        res.json({user: createdUser.toObject()}); // send back response 201 because we created new data
}
}; 

const login = async (req, res, next) => {
    const { email, password } = req.body;

    // Logic to check if the email sent is an existing email in mongoDB
    let existingUser;
    try
    {
        // Checks if this email is an existing email in the MongoDB database. This is an async task
        existingUser = await User.findOne({email : email});
    } 
    catch (err)
    {
        console.log("error. Email does not exist");
        return res.json({error: 'Email does not exist'});  
    }



    if (!existingUser)
    {
        console.log("Error. Non-existent User");
        return res.json({error: 'Non-existent user'});
    }

    
   
    let isValidPassword = false;
    try
    {
        // Compare pulls salt out of hashed password and uses that salt to hash given password to compare 
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    }
    catch
    {
        console.log("Error. Could not compare hash. Check credentials again.");
        return res.json({error: 'Could not log in. Check password.'});
    }

    if (!isValidPassword)
    {
        console.log("Wrong password.");
        return res.json({error: 'Could not log in.'});
    }

    else
    {
        let token_str;
        try{
            token_str = jwt.sign(
                {email: existingUser.email},    // What to encode into the token
                "private-key",     // string (private key) to sign the token with
                {expiresIn: '1h'}       // Token expires in one hour
            );
            res.json({
                message: "Logged in",
                token: token_str
            });
        }
        catch
        {
            console.log("Error. Could not generate token.");
            return res.json({error: 'Could not generate token.'});
        }
        
    }
};


exports.signup = signup; //Multi export
exports.login = login; //Multi export