
import User from '../models/user.js'; // Assuming you have a User model defined

// Function to create a new user and store it in the database
const createUserAccount = async (oauthId, email, name) => {
    
    try {
        const user = new User({
            oauthId: oauthId,
            email:  email,
            name:name
        });
        await user.save();
        return user;
    } catch (error) {
        throw new Error('Error creating user: ' + error.message);
    }
};

export {
    createUserAccount,
};