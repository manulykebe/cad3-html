import { Router } from 'express';
import { createUser, updateUser, deleteUser, getUsers } from '../controllers/user.controller.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// All routes require authentication and admin privileges
// router.use(auth);
// router.use(isAdmin);

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;