// services/authService.js
import User from '../models/User.js';

export const createOrUpdateUser = async (decodedToken) => {
  try {
    // Check if user exists
    let user = await User.findOne({ googleId: decodedToken.sub });

    // If not, create new user
    if (!user) {
      user = await User.create({
        googleId: decodedToken.sub,
        email: decodedToken.email,
        name: decodedToken.name,
        picture: decodedToken.picture
      });
    } else {
      // Update user info if they already exist
      user.email = decodedToken.email;
      user.name = decodedToken.name;
      user.picture = decodedToken.picture;
      await user.save();
    }

    // Return user data without token
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture
      }
    };
  } catch (error) {
    console.error('Error in createOrUpdateUser:', error);
    throw error;
  }
};

export const getUserProfile = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture
    };
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
};