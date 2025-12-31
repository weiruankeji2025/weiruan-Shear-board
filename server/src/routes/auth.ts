import { Router } from 'express';
import passport from 'passport';
import { register, login, getProfile, updateProfile, oauthCallback } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Local auth
router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), oauthCallback);

// Microsoft OAuth
router.get('/microsoft', passport.authenticate('microsoft', { scope: ['user.read'] }));
router.get('/microsoft/callback', passport.authenticate('microsoft', { session: false }), oauthCallback);

export default router;
