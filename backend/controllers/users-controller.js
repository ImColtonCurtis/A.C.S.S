const uuid = require('uuid').v4;

const DUMMY_USERS = [
    {
        id: uuid(),
        name: 'Kevin Nguyen',
        email: 'engr.kevin.nguyen@gmail.com',
        password: 'password'
    }

];

// Middleware that sends back all users
const getUsers = (req, res, next) => {    
    res.json({ users: DUMMY_USERS});    // Send back all users as a JSON   
};

const signup = (req, res, next) => {
    const { name, email, password } = req.body; // Extract name, email, password from request body

    const createdUser = {
        id: uuid(),
        name: name,
        email: email,
        password: password
    };

    DUMMY_USERS.push(createdUser);

    res.status(201).json({user: createdUser}); // send back response 201 because we created new data
}; 

const login = (req, res, next) => {
    const { email, password } = req.body;

    const identifiedUser = DUMMY_USERS.find( u => u.email === email ); // u.email is an email in DUMMY_USERS that equals email

    if (!identifiedUser || identifiedUser.password !== password) // If no identifiedUser has been found or password does not match
    {
        console.log("Could not identify user!");
        res.json({message: 'Could not log in'});
        console.log(identifiedUser);
    }
    else
    {
        res.json({message: 'Logged in'});
        console.log(identifiedUser)
    }
};

exports.getUsers = getUsers; //Multi export
exports.signup = signup; //Multi export
exports.login = login; //Multi export