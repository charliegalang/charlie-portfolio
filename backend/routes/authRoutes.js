import express from 'express';
import { login, logout, forgotPassword, register, resetPassword } from '../controller/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

export default router;
