import { Router } from 'express';
import { addLike, removeLike, getAllLikes } from '../controllers/likeController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', protect, getAllLikes)
router.post('/:postId', protect, addLike);
router.delete('/:postId', protect, removeLike);


export default router;