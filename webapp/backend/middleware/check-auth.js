const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    try{

        const token = req.headers.authorization.split(' ')[1]; // Get the token out of the header
        if (!token)
        {
            console.log("Empty Token.")
            throw new Error('Authentication failed!');
        }

        console.log('Received a token...');
        const decodedToken = jwt.verify(token, 'secret');  // Use the Secret key to verify the token. If it fails, go to catch

        req.userData = { email: decodedToken.email };
        console.log(decodedToken);

        next();
    }
    catch (err)
    {
        console.log("Token verification error.");
        return res.status(404).json({message: 'Token error.'});
    }
    
};