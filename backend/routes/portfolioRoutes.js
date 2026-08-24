import express from 'express';
import { getPortfolio, updatePortfolio } from '../controller/portfolioController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPortfolio);

// TEMPORARY: Remove "protect" so you can test saving before you build your login/auth system
// Once you have your login working, put it back: router.put('/', protect, updatePortfolio);
router.put('/', updatePortfolio);

export default router;
