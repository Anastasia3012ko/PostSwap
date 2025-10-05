import express, { Router } from 'express';
import {
  getUserById,
  updateAvatarOnly,
  updateUser
} from '../controllers/UserController.js';
import { protect } from '../middlewares/authMiddleware.js';
import multer from 'multer';

const router: Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/:userId', protect, getUserById);
router.put("/update/:userId", protect, upload.single("avatar"), updateUser);
router.post('/upload-avatar/:userId', protect, upload.single('avatar'), updateAvatarOnly);

export default router;
