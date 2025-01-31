// controllers/authController.js
import jwt from 'jsonwebtoken';
import { createOrUpdateUser, getUserProfile } from '../services/userServices.js';

export const login = async (req, res) => {
  try {
    const { token } = req.body;
    console.log(token);
    
    // Verify Google token
    const decoded = jwt.decode(token);
    if (!decoded) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }

    // Create or get user
    const result = await createOrUpdateUser(decoded);

    // Send success response with user data
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: result.user
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed', 
      error: error.message 
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const profile = await getUserProfile(email);
    res.status(200).json({
      success: true,
      user: profile
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get profile', 
      error: error.message 
    });
  }
};