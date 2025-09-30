import express, {Router} from 'express';
// import { followUser, unfollowUser } from '../controllers/followController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router: Router = express.Router();

//router.post('/:id/follow', protect, followUser);
//router.post('/:id/unfollow', protect, unfollowUser);

export default router;