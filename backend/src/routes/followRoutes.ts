import express, {Router} from 'express';
import { followUser, unfollowUser } from '../controllers/followController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router: Router = express.Router();

router.post('/follow/:userId', protect, followUser);
router.delete('/unfollow/:userId', protect, unfollowUser);

export default router;