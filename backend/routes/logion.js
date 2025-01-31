import express from 'express';
import { login, getProfile } from '../controllers/authcontroller.js';


const authRoutes = express.Router();

// Auth routes
authRoutes.post('/login', login);
authRoutes.get('/profile',getProfile);

export default authRoutes;