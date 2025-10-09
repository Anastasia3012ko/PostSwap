import { Router } from 'express';
import { addLike, removeLike } from '../controllers/likeController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/:postId', protect, addLike);
router.delete('/:postId', protect, removeLike);

export default router;